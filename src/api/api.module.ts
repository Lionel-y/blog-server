import { Module } from '@nestjs/common';
import { ArticleModule } from 'src/modules/article/article.module';
import { UserModule } from 'src/modules/user/user.module';
import { ApiArticleController } from './api.article.controller';
import { ApiUserController } from './api.user.controller';

@Module({
    imports: [UserModule, ArticleModule],
    controllers: [ApiUserController, ApiArticleController],
})
export class ApiModule {}
