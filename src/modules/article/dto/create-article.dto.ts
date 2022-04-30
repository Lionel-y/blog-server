export class CreateArticleDto {
  readonly title: string;
  desc: string;
  readonly content: string;
  author: string;
  tags: string[];
  category: string;
  is_draft?: boolean;
}
