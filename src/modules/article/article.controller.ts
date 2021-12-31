import { Controller, Inject } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ArticleService } from "./article.service";

@Controller('article')
export class ArticleController {
    constructor(private readonly articleService: ArticleService){}
}