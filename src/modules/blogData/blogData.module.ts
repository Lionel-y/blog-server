import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/db/entities/Article.entity';
import { BlogData } from 'src/db/entities/BlogData.entity';
import { Comment } from 'src/db/entities/Comment.entity';
import { BlogDataService } from './blogData.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogData, Article, Comment])],
  providers: [BlogDataService],
  exports: [BlogDataService],
})
export class BlogDataModule {}
