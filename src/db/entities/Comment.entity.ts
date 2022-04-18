import { randomUUID } from 'crypto';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Article } from './Article.entity';
import { User } from './User.entity';

@Entity()
export class Comment {
  // 分类id
  @PrimaryColumn()
  commentId: string;

  @BeforeInsert()
  generateUUIDString() {
    this.commentId = randomUUID().replace(/-/g, '');
  }

  @Column({ nullable: true })
  from: string;

  @Column()
  pid: string;

  @Column({
    length: 200,
  })
  content: string;

  @CreateDateColumn()
  create_at: Date;

  @ManyToOne(() => Article, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pid' })
  article: Article;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'from', referencedColumnName: 'username' })
  user: User;
}
