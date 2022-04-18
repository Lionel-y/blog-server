import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { BlogDataService } from 'src/modules/blogData/blogData.service';

/**
 * 用于记录文章浏览计数
 * 作用于查看文章路由时（非api接口）
 */
@Injectable()
export class ViewsCounterInterceptor implements NestInterceptor {
  constructor(
    @Inject(BlogDataService)
    private blogDataService: BlogDataService,
  ) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    console.log('viewsCounter');
    return next.handle().pipe(
      map((v) => {
        this.blogDataService.recordViews();
        return v;
      }),
    );
  }
}
