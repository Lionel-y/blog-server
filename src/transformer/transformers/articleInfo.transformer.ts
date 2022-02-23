import { Article } from 'src/db/entities/article.entity';
import { ArticleInfo, Transformer } from '../types';

export const ArticleInfoTransformer: Transformer<Article, ArticleInfo> = (
  article: Article,
) => {
  const username = article.user.username;
  delete article.user;
  return {
    ...article,
    author: username,
  };
};
