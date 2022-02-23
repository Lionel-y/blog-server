import { Inject, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { TStream } from 'src/transformer/index';
import { Article } from 'src/db/entities/article.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { QueryListTransformer } from 'src/transformer/transformers/queryList.tranformer';
import { ArticleInfoTransformer } from 'src/transformer/transformers/articleInfo.transformer';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private ArticleRepo: Repository<Article>,
    @Inject(UserService)
    private userService: UserService,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const article = new Article();
    article.title = createArticleDto.title;
    article.desc = createArticleDto.desc;
    article.content = createArticleDto.desc;
    const author = await this.userService.getUser(createArticleDto.user);
    article.user = author;
    const ret = await this.ArticleRepo.insert(article);
    return !!ret;
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

  async getList() {
    const res = await this.ArticleRepo.findAndCount({
      relations: ['user'],
    });
    const ret = new TStream(res)
      .use(QueryListTransformer)
      .map(ArticleInfoTransformer, { property: 'data' }).value;

    return ret;
  }
}
