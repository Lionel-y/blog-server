import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Article } from './article.entity';
import Tag from './tag.entity';

@Entity()
export default class TagMap {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  pid: string;

  @Column()
  tid: string;

  @ManyToOne(() => Article, (article) => article.pid)
  @JoinColumn({ name: 'pid' })
  article: Article;

  @ManyToOne(() => Tag, (tag) => tag.tid)
  @JoinColumn({ name: 'tid' })
  tag: Tag;
}
