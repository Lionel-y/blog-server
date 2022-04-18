import { randomUUID } from 'crypto';
import {
  AfterLoad,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';
import { ROLE } from '../types';

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
    unique: true,
  })
  username: string;

  // 用户密码
  @Column({
    nullable: true,
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

  // 用户邮箱
  @Column({
    unique: true,
    nullable: true,
  })
  email: string;
}
