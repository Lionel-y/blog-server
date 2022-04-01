import { randomUUID } from 'crypto';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Article } from './article.entity';

@Entity()
export class Category {
  // 分类id
  @PrimaryColumn()
  cid: string;

  @BeforeInsert()
  generateUUIDString() {
    this.cid = randomUUID().replace(/-/g, '');
  }

  // 分类名称
  @Column({
    nullable: false,
    unique: true,
  })
  category_name: string;

  // 创建日期
  @CreateDateColumn()
  createAt: Date;

  @OneToMany(() => Article, (article) => article.pid)
  articles: Article[];
}
