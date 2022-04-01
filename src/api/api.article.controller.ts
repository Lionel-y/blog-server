import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { FetchInfoResponseInterceptor } from 'src/interceptor/fetchInfoResponse.interceptor';
import { FetchListResponseInterceptor } from 'src/interceptor/fetchListResponse.interceptor';
import { OperationResponseInterceptor } from 'src/interceptor/operationResponse.interceptor';
import { ArticleService } from 'src/modules/article/article.service';
import { CreateArticleDto } from 'src/modules/article/dto/create-article.dto';

type QueryType = 'brief' | 'detail';

@Controller({
  path: 'api/article',
})
export class ApiArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @UseInterceptors(FetchListResponseInterceptor)
  getArticleList(@Query('type') type?: QueryType) {
    const isBrief = type === 'brief' ? true : false;
    return this.articleService.getAll(isBrief);
  }

  @Post()
  @UseInterceptors(OperationResponseInterceptor)
  createArticle(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }
}
