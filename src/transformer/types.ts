import { Article } from 'src/db/entities/article.entity';

export interface Transformer<I, O> {
  (value: I): O;
}

export type ListValue = [[], number];
export interface List {
  data: [];
  total: number;
}

export type ArticleInfo = Omit<Article, 'user' | 'generateUUIDString'> & {
  author: string;
};
