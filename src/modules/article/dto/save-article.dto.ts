export class SaveArticleDto {
  pid?: string;
  readonly title: string;
  desc: string;
  readonly content: string;
  author: string;
  tags: string[];
  category: string;
}
