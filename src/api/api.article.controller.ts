import { Body, Controller, Get, Post } from '@nestjs/common';
import { ArticleService } from 'src/modules/article/article.service';
import { CreateArticleDto } from 'src/modules/article/dto/create-article.dto';

@Controller({
  path: 'api/article',
})
export class ApiArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  getArticleList() {
    return this.articleService.getList();
  }

  @Post()
  createArticle(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }
}
