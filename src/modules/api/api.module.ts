import { Module } from '@nestjs/common';
import { ArticleModule } from 'src/modules/article/article.module';
import { BlogDataModule } from 'src/modules/blogData/blogData.module';
import { CategoryModule } from 'src/modules/category/category.module';
import { ViewsCounterInterceptor } from 'src/interceptor/viewsCounter.interceptor';
import { TagModule } from 'src/modules/tag/tag.module';
import { UserModule } from 'src/modules/user/user.module';
import { ApiArticleController } from './api.article.controller';
import { ApiCategoryController } from './api.category.controller';
import { ApiTagController } from './api.tag.controller';
import { ApiUserController } from './api.user.controller';
import { ArticlesCounterInterceptor } from 'src/interceptor/articleCounter.interceptor';
import { AuthModule } from '../auth/auth.module';
import { CommentModule } from '../comment/comment.module';
import { ApiCommentController } from './api.comment.controller';
import ApiDataController from './api.data.controller';

@Module({
  imports: [
    UserModule,
    ArticleModule,
    CategoryModule,
    TagModule,
    BlogDataModule,
    AuthModule,
    CommentModule,
  ],
  providers: [ViewsCounterInterceptor, ArticlesCounterInterceptor],
  controllers: [
    ApiUserController,
    ApiArticleController,
    ApiCategoryController,
    ApiTagController,
    ApiCommentController,
    ApiDataController,
  ],
})
export class ApiModule {}
