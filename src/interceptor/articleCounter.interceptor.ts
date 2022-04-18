import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Article } from 'src/db/entities/Article.entity';
import { BlogDataService } from 'src/modules/blogData/blogData.service';

@Injectable()
export class ArticlesCounterInterceptor implements NestInterceptor {
  constructor(
    @Inject(BlogDataService) private blogDataService: BlogDataService,
  ) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((v: Article) => {
        this.blogDataService.recordArticles(v.create_at);
        return v;
      }),
    );
  }
}
