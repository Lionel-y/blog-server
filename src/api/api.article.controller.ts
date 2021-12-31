import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ArticleService } from 'src/modules/article/article.service';
import { CreateArticleDto } from 'src/modules/article/dto/create-article.dto';

@Controller({
    path: 'api/article',
})
export class ApiArticleController {
    constructor(private readonly articleService: ArticleService) {}
    
    @Get()
    getArticleList() {
        return this.articleService.getList();
    }
    @Get(':pid')
    getArticle(@Param('pid') pid: string) {
        return this.articleService.getArticle(pid);
    }



    @Post()
    createArticle(@Body() createArticleDto: CreateArticleDto) {
        return this.articleService.create(createArticleDto);
    }
}
