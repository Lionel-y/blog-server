import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/db/entities/Article.entity';
import { Category } from 'src/db/entities/Category.entity';
import { TagMapView } from 'src/db/entities/TagMap.view.entity';
import { ArticleModule } from '../article/article.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Category, TagMapView, Article]),
    ArticleModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
