export class SaveArticleDto {
  pid?: string;
  readonly title: string;
  desc: string;
  readonly content: string;
  readonly author: string;
  tags: string[];
  category: string;
}
