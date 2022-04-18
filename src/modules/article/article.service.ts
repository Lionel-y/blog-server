import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/db/entities/Article.entity';
import { In, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
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
    if (!!pid) {
      const ret = await this.updateArticle(pid, saveArticleDto);
      return ret;
    } else {
      const ret = await this.create(saveArticleDto);
      return ret;
    }
  }

  // 创建文章
  async create(createArticleDto: CreateArticleDto) {
    const article = new Article();
    article.title = createArticleDto.title;
    article.desc = createArticleDto.desc;
    article.content = createArticleDto.content;
    article.author = 'Lionel';
    const category = await this.CategoryRepo.findOne({
      category_name: createArticleDto.category,
    });
    article.category = category;
    article.is_draft = false;
    const ret = await this.ArticleRepo.save(article);
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
    return ret;
  }

  // 更新文章信息
  async updateArticle(pid: string, updateArticleDto: UpdateArticleDto) {
    // const { pid } = updateArticleDto;
    const article = await this.ArticleRepo.findOne({ pid });
    if (article === null) {
      return new HttpException({ msg: '无对应文章' }, 404);
    }
    // 替换内容
    article.title = updateArticleDto.title;
    article.desc = updateArticleDto.desc;
    article.content = updateArticleDto.content;
    const category = await this.CategoryRepo.findOne({
      category_name: updateArticleDto.category,
    });
    article.category = category;
    await this.ArticleRepo.save(article);
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

  async getAll(isBrief = false): Promise<[Article[], number]> {
    const selectColumns = isBrief
      ? excludeColumns(Article, ['content'])
      : excludeColumns(Article, []);

    // 新逻辑
    const [articles] = await this.ArticleRepo.findAndCount({
      select: selectColumns,
    });

    const ret = await this.getMultiTags(articles);

    return [ret || [], ret.length];
  }

  async deleteArticle(pid: string) {
    return await this.ArticleRepo.delete({ pid });
  }

  async thumbUp(pid: string) {
    const article = await this.ArticleRepo.findOne({ pid });
    article && article.likes++;
    const ret = await this.ArticleRepo.save(article);
    return ret;
  }
}
