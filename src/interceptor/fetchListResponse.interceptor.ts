import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class FetchListResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    console.log('fetchInfo');
    return next.handle().pipe(
      map((v) => {
        return { statusCode: 200, data: v[0] || [], total: v[1] || 0 };
      }),
    );
  }
}
