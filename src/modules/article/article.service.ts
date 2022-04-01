import { Inject, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { TStream } from 'src/transformer/index';
import { Article } from 'src/db/entities/article.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { QueryListTransformer } from 'src/transformer/transformers/queryList.tranformer';
import { TagMapService } from '../tagMap/tagMap.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private ArticleRepo: Repository<Article>,
    @Inject(UserService)
    private userService: UserService,
    @Inject(TagMapService)
    private tagMapService: TagMapService,
    @Inject(CategoryService)
    private categoryService: CategoryService,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const article = new Article();
    article.title = createArticleDto.title;
    article.desc = createArticleDto.desc;
    article.content = createArticleDto.content;
    article.author = '0fbc1686fbb44d30b3088333bb4fb0c5';
    const category = await this.categoryService.getCategoryByName(
      createArticleDto.category,
    );
    article.category = category;
    const ret = await this.ArticleRepo.save(article);
    const pid = article.pid;
    const tags = createArticleDto.tags;
    // 创建 文章<->标签 映射
    if (tags.length > 0) {
      await this.tagMapService.create(pid, tags);
    }
    return ret;
  }

  async getListByUser(uid: string) {
    const author = await this.userService.getUser(uid);
    const _ = await this.ArticleRepo.findAndCount({
      relations: ['user'],
      where: { user: author[0] },
    });
    const ret = new TStream(_).use(QueryListTransformer).value;
    return ret;
  }

  async getAll(isBrief = false) {
    if (isBrief) {
      const ret = await this.ArticleRepo.findAndCount({
        select: [
          'pid',
          'title',
          'desc',
          'views',
          'likes',
          'author',
          'create_at',
          'update_at',
          'category',
        ],
      });
      return ret;
    }
    const ret = await this.ArticleRepo.createQueryBuilder('article');
    return ret;
  }
}
