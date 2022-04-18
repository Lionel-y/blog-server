import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { BlogDataService } from 'src/modules/blogData/blogData.service';

@Injectable()
export class CommentCounterInterceptor implements NestInterceptor {
  constructor(
    @Inject(BlogDataService) private blogDataService: BlogDataService,
  ) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((v: any) => {
        this.blogDataService.recordComments();
        return v;
      }),
    );
  }
}
