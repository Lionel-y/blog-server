import { Injectable } from '@nestjs/common';
import { Article } from './db/entities/Article.entity';

@Injectable()
export class AppService {
  getHotArticles(articles: Article[]) {
    const _ = articles.sort((a, b) => b.likes + b.views - (a.likes + a.views));
    return _.length >= 3 ? [_[0], _[1], _[2]] : _;
  }
}
