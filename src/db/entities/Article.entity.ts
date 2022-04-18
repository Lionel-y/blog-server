import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';
import { User } from './User.entity';
import { Category } from './Category.entity';
import TagMap from './TagMap.entity';

@Entity()
export class Article {
  // 文章标识id
  @PrimaryColumn()
  pid: string;

  @BeforeInsert()
  generateUUIDString() {
    this.pid = randomUUID().replace(/-/g, '');
  }

  // 文章标题
  @Column({
    nullable: false,
    unique: true,
  })
  title: string;

  // 文章摘要
  @Column({
    nullable: false,
    length: 200,
    default: '',
  })
  desc: string;

  // 文章内容
  @Column({
    nullable: false,
    default: '',
    type: 'longtext',
  })
  content: string;

  // 文章浏览数
  @Column({
    default: 0,
  })
  views: number;

  // 文章点赞数
  @Column({
    default: 0,
  })
  likes: number;

  // 文章创建日期
  @CreateDateColumn()
  create_at: Date;

  // 文章更新日期
  @UpdateDateColumn()
  update_at: Date;

  @Column()
  author: string;

  @Column({
    type: 'bool',
    select: false,
    default: true,
  })
  is_draft: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author', referencedColumnName: 'username' })
  user: User;

  @Column({ name: 'category' })
  @ManyToOne(() => Category, (category) => category.articles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category', referencedColumnName: 'category_name' })
  category: Category;

  @OneToMany(() => TagMap, (tagMap) => tagMap.id)
  tagMap: TagMap[];
}
