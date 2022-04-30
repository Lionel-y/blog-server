import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/db/entities/Article.entity';
import { BlogData } from 'src/db/entities/BlogData.entity';
import { Comment } from 'src/db/entities/Comment.entity';
import { excludeColumns, format2Day, getNdayBefore } from 'src/utils';
import { Between, Repository } from 'typeorm';
type RecordDate = {
  record_date?: Date | string;
  views_count: number;
  likes_count: number;
  articles_count: number;
  comments_count: number;
};
@Injectable()
export class BlogDataService {
  constructor(
    @InjectRepository(BlogData)
    private BlogDataRepo: Repository<BlogData>,
    @InjectRepository(Article)
    private ArticleRepo: Repository<Article>,
    @InjectRepository(Comment)
    private CommentRepo: Repository<Comment>,
  ) {}

  async recordViews(date = new Date()) {
    const d = format2Day(date);
    let record = await this.BlogDataRepo.findOne({ record_date: d });
    if (!!!record) {
      record = new BlogData();
      record.record_date = d;
    }
    record.views_count = (record.views_count ?? 0) + 1;
    return await this.BlogDataRepo.save(record);
  }

  async recordLikes(date = new Date()) {
    const d = format2Day(date);
    let record = await this.BlogDataRepo.findOne({ record_date: d });
    if (!!!record) {
      record = new BlogData();
      record.record_date = d;
    }
    record.likes_count = (record.likes_count ?? 0) + 1;
    return await this.BlogDataRepo.save(record);
  }

  async recordComments(date = new Date()) {
    const d = format2Day(date);
    let record = await this.BlogDataRepo.findOne({ record_date: d });
    if (!!!record) {
      record = new BlogData();
      record.record_date = d;
    }
    record.comments_count = (record.comments_count ?? 0) + 1;
    return await this.BlogDataRepo.save(record);
  }

  async recordArticles(date = new Date()) {
    const d = format2Day(date);
    let record = await this.BlogDataRepo.findOne({ record_date: d });
    if (!!!record) {
      record = new BlogData();
      record.record_date = d;
    }
    record.articles_count = (record.articles_count ?? 0) + 1;
    return await this.BlogDataRepo.save(record);
  }

  async createRecord(
    date: Date = new Date(),
    data: RecordDate = {
      views_count: 0,
      likes_count: 0,
      articles_count: 0,
      comments_count: 0,
    },
  ) {
    const record = new BlogData();
    record.record_date = date;
    record.articles_count = data.articles_count;
    record.views_count = data.views_count;
    record.comments_count = data.comments_count;
    record.likes_count = data.likes_count;
    return await this.BlogDataRepo.save(record);
  }

  async getDailyData(date: Date) {
    const d = format2Day(date);
    const ret = await this.BlogDataRepo.findOne({ record_date: d });
    return ret;
  }

  async getCardData() {
    const today = new Date();
    const d = format2Day(today);
    const ret = await this.ArticleRepo.createQueryBuilder('article')
      .select('SUM(article.views)', 'total_views')
      .addSelect('SUM(article.likes)', 'total_likes')
      .addSelect('COUNT(article.pid)', 'total_articles')
      .getRawOne();

    const comemnts = await this.CommentRepo.createQueryBuilder('comment')
      .select('COUNT(comment.commentId)', 'total_comments')
      .getRawOne();
    const total = { ...ret, ...comemnts };

    let today_ret = await this.BlogDataRepo.findOne({
      where: { record_date: d },
      select: excludeColumns(BlogData, ['id', 'record_date']),
    });

    if (!!!today_ret) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore

      today_ret = {
        views_count: 0,
        likes_count: 0,
        comments_count: 0,
        articles_count: 0,
      };
    }
    return Object.assign(today_ret, total);
  }

  async getChartData() {
    const d = format2Day(new Date());
    const startDay = getNdayBefore(d, -6);
    const ret = await this.BlogDataRepo.find({
      select: excludeColumns(BlogData, ['id']),
      where: {
        record_date: Between(startDay, d),
      },
    });

    if (ret.length === 7) {
      return ret;
    }
    const newRet: RecordDate[] = [];
    const curDay = new Date(startDay);
    for (let i = 0; i < 7; i++) {
      const retData = ret.find(({ record_date }) => {
        return (
          new Date(record_date).toLocaleDateString() ===
          curDay.toLocaleDateString()
        );
      });
      if (!!retData) {
        newRet.push(retData);
      } else {
        newRet.push({
          record_date: new Date(curDay)
            .toLocaleDateString('zh-CN')
            .replace(/\//g, '-'),
          views_count: 0,
          likes_count: 0,
          comments_count: 0,
          articles_count: 0,
        });
      }
      curDay.setDate(curDay.getDate() + 1);
    }
    console.log(newRet);
    return newRet;
  }

  async getContributeData() {
    const d = format2Day(new Date());
    const from = new Date(d);
    from.setFullYear(from.getFullYear() - 1);
    const ret = await this.BlogDataRepo.find({
      select: ['record_date', 'articles_count'],
      where: {
        record_date: Between(from, d),
      },
    });
    return ret.map(({ record_date, articles_count }) => {
      return {
        date: record_date,
        count: articles_count,
      };
    });
  }
}
