import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FetchListResponseInterceptor } from 'src/interceptor/fetchListResponse.interceptor';
import { OperationResponseInterceptor } from 'src/interceptor/operationResponse.interceptor';
import { ArticleService } from 'src/modules/article/article.service';
import { CreateArticleDto } from 'src/modules/article/dto/create-article.dto';
import { ViewsCounterInterceptor } from 'src/interceptor/viewsCounter.interceptor';
import { ArticlesCounterInterceptor } from 'src/interceptor/articleCounter.interceptor';
import { FetchInfoResponseInterceptor } from 'src/interceptor/fetchInfoResponse.interceptor';
import { UpdateArticleDto } from 'src/modules/article/dto/update-article.dto';
import { LikeCounterInterceptor } from 'src/interceptor/likeCounter.interceptor';
import { JwtGuard } from '../auth/guard/jwt.guard';

type QueryType = 'brief' | 'detail';

@Controller({
  path: 'api/article',
})
export class ApiArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @UseInterceptors(FetchListResponseInterceptor)
  getArticleList(@Query('type') type?: QueryType) {
    console.log('api service');
    const isBrief = type === 'brief' ? true : false;
    console.log(123);
    return this.articleService.getAll(isBrief);
  }

  @Get(':pid')
  @UseInterceptors(FetchInfoResponseInterceptor)
  getArticleDetailInfo(@Param('pid') pid: string) {
    return this.articleService.getArticleDetailInfo(pid);
  }

  @Get('/view_count/:pid')
  @UseInterceptors(ViewsCounterInterceptor)
  viewCount(@Param('pid') pid: string) {
    this.articleService.viewCount(pid);
  }

  @Patch(':pid')
  @UseInterceptors(OperationResponseInterceptor)
  updateArticle(
    @Body() updateArticleDto: UpdateArticleDto,
    @Param('pid') pid: string,
  ) {
    return this.articleService.updateArticle(pid, updateArticleDto);
  }

  @Post()
  @UseInterceptors(OperationResponseInterceptor, ArticlesCounterInterceptor)
  createArticle(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Delete(':pid')
  @UseInterceptors(OperationResponseInterceptor)
  deleteArticle(@Param('pid') pid: string) {
    return this.articleService.deleteArticle(pid);
  }

  @UseGuards(JwtGuard)
  @Post('/thumb-up/:pid')
  @UseInterceptors(LikeCounterInterceptor, OperationResponseInterceptor)
  thumbUp(@Param('pid') pid: string) {
    return this.articleService.thumbUp(pid);
  }
}
