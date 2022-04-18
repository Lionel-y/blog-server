import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/db/entities/Article.entity';
import { Category } from 'src/db/entities/Category.entity';
import { In, Not, Repository } from 'typeorm';
import { ArticleService } from '../article/article.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private CategoryRepo: Repository<Category>,
    @InjectRepository(Article)
    private ArticleRepo: Repository<Article>,
    @Inject(ArticleService)
    private articleService: ArticleService,
  ) {}

  private async getCategoryDetailInfo(category: Category) {
    const articles = await this.articleService.getArticlesByCategory(category);
    return {
      ...category,
      articles: articles || [],
    };
  }

  async getCategoryByName(name: string, isBrief) {
    const category = await this.CategoryRepo.findOne({ category_name: name });
    if (isBrief) {
      return category;
    }
    return category !== null
      ? await this.getCategoryDetailInfo(category)
      : category;
  }

  async getCategoryByCid(cid: string, isBrief = false) {
    const category = await this.CategoryRepo.findOne({ cid });
    if (isBrief) {
      return category;
    }
    return await this.getCategoryDetailInfo(category);
  }

  async getAll() {
    const ret = await this.CategoryRepo.findAndCount();
    return ret;
  }

  async create(CreateCategoryDto: CreateCategoryDto) {
    const category = new Category();
    category.category_name = CreateCategoryDto.category_name;
    const ret = await this.CategoryRepo.save(category);
    console.log(ret);
    return ret;
  }

  private async getDefaultCategory() {
    return await this.CategoryRepo.findOne({ category_name: '默认分类' });
  }

  async batchDelete(cids: string[], allDel) {
    console.log(cids);
    // 防止删除默认分类
    const categories = await this.CategoryRepo.find({
      cid: In(cids),
      category_name: Not('默认分类'),
    });
    const defaultCategory = await this.getDefaultCategory();
    const delCategory = categories.map(({ category_name }) => category_name);
    const articles = await this.ArticleRepo.find({
      where: { category: In(delCategory) },
    });
    if (allDel) {
      await this.ArticleRepo.remove(articles);
    } else {
      articles.map((article) => {
        article.category = defaultCategory;
      });
      await this.ArticleRepo.save(articles);
    }
    const ret = await this.CategoryRepo.remove(categories);
    return ret;
  }
}
