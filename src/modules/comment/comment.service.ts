import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/db/entities/Comment.entity';
import { Reply } from 'src/db/entities/Reply.entity';
import { In, Repository } from 'typeorm';
import { createCommentDto } from './dto/create-comment.dto';
import { CreateReplyDto } from './dto/create-reply.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly CommentRepo: Repository<Comment>,
    @InjectRepository(Reply)
    private readonly ReplyRepo: Repository<Reply>,
  ) {}

  async createComment(createCommentDto: createCommentDto) {
    const comment = new Comment();
    comment.pid = createCommentDto.pid;
    comment.from = createCommentDto.from;
    comment.content = createCommentDto.content;
    const ret = await this.CommentRepo.save(comment);
    return ret;
  }

  async replyComment(createReplyDto: CreateReplyDto) {
    const reply = new Reply();
    reply.commentId = createReplyDto.commentId;
    reply.from_user = createReplyDto.from_user;
    reply.to_user = createReplyDto.to_user;
    reply.content = createReplyDto.content;
    const ret = await this.ReplyRepo.save(reply);
    return ret;
  }

  async getCommentList(pid: string) {
    const comments = await this.CommentRepo.find({ pid });
    const commentIds = comments.map(({ commentId }) => commentId);
    const replies = await this.ReplyRepo.find({
      where: { commentId: In(commentIds) },
    });
    const commentList = comments.map((comment) => {
      const _replies = replies.filter(
        (reply) => reply.commentId === comment.commentId,
      );
      return {
        ...comment,
        replies: _replies || [],
      };
    });
    return commentList;
  }
}
