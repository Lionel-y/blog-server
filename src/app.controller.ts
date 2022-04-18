import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ArticleService } from './modules/article/article.service';
import { TagService } from './modules/tag/tag.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly articleService: ArticleService,
    private readonly tagService: TagService,
  ) {}

  @Get()
  @Render('home')
  async home(): Promise<any> {
    const articles = await this.articleService.getAll(true);
    const hotArticles = this.appService.getHotArticles(articles[0]);
    const tags = await this.tagService.getAll();
    console.log(tags);
    return {
      articles: articles[0],
      hotArticles: hotArticles,
      tags: tags[0],
    };
  }
}
