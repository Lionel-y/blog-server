import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.useGlobalInterceptors(new ErrorsInterceptor());
  app.useStaticAssets(join(__dirname, '..', 'admin', 'build', 'static'), {
    prefix: '/static',
  });
  app.useStaticAssets(join(__dirname, '..', 'assets'), {
    prefix: '/public',
  });

  app.setBaseViewsDir(join(__dirname, '..', 'pages'));
  app.setViewEngine('hbs');

  hbs.registerPartials(join(__dirname, '..', 'pages', 'partials'));
  hbs.registerHelper('date', (currentDate) => {
    if (currentDate) {
      return new Date(currentDate).toLocaleDateString('zh-CN');
    } else {
      return '';
    }
  });

  await app.listen(3000);
}
bootstrap();
