import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/db/entities/Article.entity';
import { In, Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { TagMapView } from 'src/db/entities/TagMap.view.entity';
import { Category } from 'src/db/entities/Category.entity';
import { excludeColumns } from 'src/utils';
import TagMap from 'src/db/entities/TagMap.entity';
import { UpdateArticleDto } from './dto/update-article.dto';
import { SaveArticleDto } from './dto/save-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private ArticleRepo: Repository<Article>,
    @InjectRepository(TagMapView)
    private TagMapViewRepo: Repository<TagMapView>,
    @InjectRepository(Category)
    private CategoryRepo: Repository<Category>,
    @InjectRepository(TagMap)
    private TagMapRepo: Repository<TagMap>,
  ) {}

  async test() {
    const ret = await this.ArticleRepo.find({
      select: excludeColumns(Article, ['content', 'author']),
    });
    console.log(ret);
    return ret;
  }

  async save(saveArticleDto: SaveArticleDto) {
    const { pid } = saveArticleDto;
    if (pid && pid.trim() !== '') {
      const ret = await this.updateArticle(pid, saveArticleDto);
      return ret;
    } else {
      const ret = await this.create(saveArticleDto);
      return ret;
    }
  }

  async publish(publishArticleDto: SaveArticleDto) {
    const { pid } = publishArticleDto;
    if (pid && pid.trim() !== '') {
      const ret = await this.updateArticle(pid, {
        ...publishArticleDto,
        is_draft: false,
      });
      return ret;
    } else {
      const ret = await this.create({ ...publishArticleDto, is_draft: false });
      return ret;
    }
  }

  // 创建文章
  async create(createArticleDto: CreateArticleDto) {
    const article = new Article();
    article.title = createArticleDto.title;
    article.desc = createArticleDto.desc;
    article.content = createArticleDto.content;
    article.author = createArticleDto.author;
    const category = await this.CategoryRepo.findOne({
      category_name: createArticleDto.category,
    });
    article.category = category;
    if (typeof createArticleDto.is_draft !== 'undefined') {
      article.is_draft = createArticleDto.is_draft;
    }
    const pid = article.pid;
    const tags = createArticleDto.tags;
    // 创建 文章<->标签 映射
    if (tags.length > 0) {
      const tagMaps = tags.map((tag) => {
        const tagMap = new TagMap();
        tagMap.pid = pid;
        tagMap.tid = tag;
        return tagMap;
      });
      await this.TagMapRepo.save(tagMaps);
    }
    const ret = await this.ArticleRepo.save(article);

    return ret;
  }

  // 更新文章信息
  async updateArticle(pid: string, updateArticleDto: UpdateArticleDto) {
    let article = await this.ArticleRepo.findOne({ pid });
    if (article === null) {
      article = await this.create(updateArticleDto);
    }
    // 替换内容
    article.title = updateArticleDto.title;
    article.desc = updateArticleDto.desc;
    article.content = updateArticleDto.content;
    const category = await this.CategoryRepo.findOne({
      category_name: updateArticleDto.category,
    });
    article.category = category;
    if (typeof updateArticleDto.is_draft !== 'undefined') {
      article.is_draft = updateArticleDto.is_draft;
    }
    // 这里直接删除原有的tagMap 然后建立新的tagMap映射
    await this.TagMapRepo.delete({ pid });
    const tags = updateArticleDto.tags;

    if (tags.length > 0) {
      const tagMaps = tags.map((tag) => {
        const tagMap = new TagMap();
        tagMap.pid = pid;
        tagMap.tid = tag;
        return tagMap;
      });
      await this.TagMapRepo.save(tagMaps);
    }
    await this.ArticleRepo.save(article);

    return article;
  }

  // 这里暂时没有处理好ts的问题，暂时将功能进行拆分
  private async getMultiTags(articles: Article[]) {
    const pids = articles.map(({ pid }) => pid);
    const tagMap = await this.TagMapViewRepo.find({
      where: {
        pid: In(pids),
      },
    });
    return articles.map((item) => {
      return Object.assign(item, {
        tags: tagMap.find(({ pid }) => pid === item.pid)?.tags.split(',') || [],
      });
    });
  }

  private async getTags(article: Article) {
    const tagMap = await this.TagMapViewRepo.findOne({
      where: { pid: article.pid },
    });
    return Object.assign(article, { tags: tagMap?.tags.split(',') || [] });
  }

  async getArticlesByCategory(category: Category) {
    const ret = await this.ArticleRepo.find({
      where: { category: category.category_name },
      select: excludeColumns(Article, ['content']),
    });
    return await this.getMultiTags(ret);
  }

  async getArticleDetailInfo(pid: string, isView = false) {
    const ret = await this.ArticleRepo.findOne({ pid });
    //TODO: 这里考虑是否要优化下 将浏览数据统计抽离到拦截器里 目前使用的是创建一个专门提供记录的接口
    if (isView && ret) {
      ret.views++;
      this.ArticleRepo.save(ret);
    }
    return await this.getTags(ret);
  }

  async viewCount(pid: string) {
    const ret = await this.ArticleRepo.findOne({ pid });
    if (ret) {
      ret.views++;
      await this.ArticleRepo.save(ret);
    }
  }

  async getMultiArticles(pids: string[]) {
    const articles = await this.ArticleRepo.find({
      where: {
        pid: In(pids),
      },
      select: excludeColumns(Article, ['content']),
    });
    return await this.getMultiTags(articles);
  }

  async getAll() {
    const articles = await this.ArticleRepo.find({
      select: excludeColumns(Article, ['content']),
    });
    if (!!!articles) {
      return [];
    }
    const ret = await this.getMultiTags(articles);
    return ret;
  }

  async deleteArticle(pid: string) {
    return await this.ArticleRepo.delete({ pid });
  }

  //TODO: 可以直接用update函数进行更新操作
  async thumbUp(pid: string) {
    const article = await this.ArticleRepo.findOne({ pid });
    article && article.likes++;
    const ret = await this.ArticleRepo.save(article);
    return ret;
  }
}
