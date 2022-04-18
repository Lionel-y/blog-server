import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Tag from 'src/db/entities/Tag.entity';
import TagMap from 'src/db/entities/TagMap.entity';
import { ArticleModule } from '../article/article.module';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, TagMap]), ArticleModule],
  exports: [TagService],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}
