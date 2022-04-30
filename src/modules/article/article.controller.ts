import { Controller, Get, Param, Render } from '@nestjs/common';
import { Renderer, marked } from 'marked';
import { tocTokens2HTML } from 'src/utils/mdTOC';
import { CommentService } from '../comment/comment.service';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
  ) {}

  @Get(':pid')
  @Render('article')
  async article(@Param('pid') pid: string) {
    const article = await this.articleService.getArticleDetailInfo(pid);
    const tocTokens = [];
    const renderer = new Renderer();
    renderer.heading = function (text, level, raw, slugger) {
      const anchor = slugger.slug(raw);
      tocTokens.push({ text, level, anchor });
      return `<h${level} id="${anchor}" class="markdown-body-anchor" index="${
        tocTokens.length - 1
      }">${text}</h${level}>`;
    };
    marked.setOptions({
      renderer: renderer,
    });

    // 获取评论列表
    const comments = await this.commentService.getCommentList(pid);
    console.log(comments);
    return {
      article: article,
      articleHtml: marked.parse(article.content),
      tocHtml: tocTokens2HTML(tocTokens),
      comments: comments,
    };
  }
}
