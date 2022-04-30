import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/db/entities/Article.entity';
import { Category } from 'src/db/entities/Category.entity';
import TagMap from 'src/db/entities/TagMap.entity';
import { TagMapView } from 'src/db/entities/TagMap.view.entity';
import { BlogDataModule } from '../blogData/blogData.module';
import { CommentModule } from '../comment/comment.module';
import { UserModule } from '../user/user.module';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, TagMapView, TagMap, Category]),
    UserModule,
    BlogDataModule,
    CommentModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
