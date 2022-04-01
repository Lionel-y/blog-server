import { Module } from '@nestjs/common';
import { ArticleModule } from 'src/modules/article/article.module';
import { CategoryModule } from 'src/modules/category/category.module';
import { TagModule } from 'src/modules/tag/tag.module';
import { UserModule } from 'src/modules/user/user.module';
import { ApiArticleController } from './api.article.controller';
import { ApiCategoryController } from './api.category.controller';
import { ApiTagController } from './api.tag.controller';
import { ApiUserController } from './api.user.controller';

@Module({
  imports: [UserModule, ArticleModule, CategoryModule, TagModule],
  controllers: [
    ApiUserController,
    ApiArticleController,
    ApiCategoryController,
    ApiTagController,
  ],
})
export class ApiModule {}
