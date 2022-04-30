import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
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
import { LikeCounterInterceptor } from 'src/interceptor/likeCounter.interceptor';
import { SaveArticleDto } from '../article/dto/save-article.dto';
import { Roles } from '../auth/decorator/role.decorator';
import { ROLE } from '../auth/role.enum';

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

  @Post('/save')
  @Roles(ROLE.ADMIN)
  @UseInterceptors(OperationResponseInterceptor)
  createArticle(@Body() createArticleDto: CreateArticleDto, @Request() req) {
    createArticleDto.author = req.user.user.username;
    return this.articleService.save(createArticleDto);
  }

  @Post('/publish')
  @Roles(ROLE.ADMIN)
  @UseInterceptors(ArticlesCounterInterceptor, OperationResponseInterceptor)
  publishArticle(@Body() saveArticleDto: SaveArticleDto, @Request() req) {
    console.log(req.user);
    saveArticleDto.author = req.user.username;
    return this.articleService.publish(saveArticleDto);
  }

  @Patch('/publish')
  @Roles(ROLE.ADMIN)
  @UseInterceptors(OperationResponseInterceptor)
  updateArticle(@Body() saveArticleDto: SaveArticleDto, @Request() req) {
    saveArticleDto.author = req.user.username;
    return this.articleService.publish(saveArticleDto);
  }

  @Delete(':pid')
  @Roles(ROLE.ADMIN)
  @UseInterceptors(OperationResponseInterceptor)
  deleteArticle(@Param('pid') pid: string) {
    return this.articleService.deleteArticle(pid);
  }

  @Post('/thumb-up/:pid')
  @Roles(ROLE.USER)
  @UseInterceptors(LikeCounterInterceptor, OperationResponseInterceptor)
  thumbUp(@Param('pid') pid: string) {
    return this.articleService.thumbUp(pid);
  }
}
