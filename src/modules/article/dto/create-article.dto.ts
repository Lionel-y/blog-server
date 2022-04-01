export class CreateArticleDto {
  readonly title: string;
  desc: string;
  readonly content: string;
  readonly author: string;
  tags: string[];
  category: string;
}
