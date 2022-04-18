import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from 'src/db/entities/Reply.entity';
import { Comment } from 'src/db/entities/Comment.entity';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Reply])],
  exports: [CommentService],
  providers: [CommentService],
})
export class CommentModule {}
