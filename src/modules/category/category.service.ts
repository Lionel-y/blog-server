import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/db/entities/article.entity';
import { Category } from 'src/db/entities/category.entity';
import { In, Not, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private CategoryRepo: Repository<Category>,
    @InjectRepository(Article)
    private ArticleRepo: Repository<Article>,
  ) {}

  async getAll() {
    const ret = await this.CategoryRepo.findAndCount({
      order: { createAt: 'ASC' },
    });
    return ret;
  }
  async getCategoryByName(name: string) {
    const category = await this.CategoryRepo.findOne({ category_name: name });
    return category;
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
    }
    this.ArticleRepo.save(articles);
    const ret = await this.CategoryRepo.remove(categories);
    return ret;
  }
}
