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
import { User } from './user.entity';
import { Category } from './category.entity';
import TagMap from './tagMap.entity';

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

  // @Column({
  //   type: 'boolean',
  //   default: false,
  // })
  // isDel: boolean;

  @Column()
  author: string;

  @ManyToOne(() => User, (user) => user.pid)
  @JoinColumn({ name: 'author' })
  user: User;

  @Column({ name: 'category' })
  @ManyToOne(() => Category, (category) => category.articles)
  @JoinColumn({ name: 'category', referencedColumnName: 'category_name' })
  category: Category;

  @OneToMany(() => TagMap, (tagMap) => tagMap.id, { onDelete: 'CASCADE' })
  tagMap: TagMap[];
}
