import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Article } from './Article.entity';
import Tag from './Tag.entity';

@Entity()
export default class TagMap {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  pid: string;

  @Column()
  tid: string;

  @ManyToOne(() => Article, (article) => article.pid, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pid' })
  article: Article;

  @ManyToOne(() => Tag, (tag) => tag.tid, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tid' })
  tag: Tag;
}
