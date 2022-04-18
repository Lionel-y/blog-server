import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentCounterInterceptor } from 'src/interceptor/commentCounter.interceptor';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CommentService } from '../comment/comment.service';

@Controller('/api/comment')
export class ApiCommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtGuard)
  @UseInterceptors(CommentCounterInterceptor)
  @Post()
  createComment(
    @Body() comment: { pid: string; content: string },
    @Request() req,
  ) {
    const { username } = req.user;
    return this.commentService.createComment({ ...comment, from: username });
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(CommentCounterInterceptor)
  @Post('/reply')
  reply(
    @Body() reply: { to_user: string; content: string; commentId: string },
    @Request() req,
  ) {
    const from_user = req.user.username;
    return this.commentService.replyComment({ ...reply, from_user: from_user });
  }
}
