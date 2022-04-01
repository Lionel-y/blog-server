import { randomUUID } from 'crypto';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { ROLE } from '../types';
import { Article } from './article.entity';

@Entity()
export class User {
  // 用户唯一id
  @PrimaryColumn()
  uid: string;

  @BeforeInsert()
  generateUUIDString() {
    this.uid = randomUUID().replace(/-/g, '');
  }

  // 用户名
  @Column({
    nullable: false,
  })
  username: string;

  // 用户密码
  @Column({
    nullable: false,
    select: false,
  })
  password: string;

  // 创建日期
  @CreateDateColumn()
  createAt: Date;

  // 用户角色
  @Column({
    type: 'tinyint',
    nullable: false,
    default: ROLE.USER,
  })
  role: number;

  @OneToMany(() => Article, (article) => article.user)
  pid: Article[];
}
