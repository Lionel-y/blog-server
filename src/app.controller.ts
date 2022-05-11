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
    const articles = await this.articleService.getAll();
    console.log(articles);
    const showArticles = articles.filter((article) => !article.is_draft);
    const hotArticles = this.appService.getHotArticles(showArticles);
    const tags = await this.tagService.getAll();
    return {
      articles: showArticles,
      hotArticles: hotArticles,
      tags: tags[0],
    };
  }
}
