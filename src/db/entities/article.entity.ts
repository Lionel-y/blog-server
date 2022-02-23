import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';
import { User } from './user.entity';

@Entity()
export class Article {
  @PrimaryColumn()
  pid: string;

  @BeforeInsert()
  generateUUIDString() {
    this.pid = randomUUID().replace(/-/g, '');
  }

  @Column({
    nullable: false,
    unique: true,
  })
  title: string;

  @Column({
    nullable: false,
    length: 200,
    default: '',
  })
  desc: string;

  @Column({
    nullable: false,
    default: '',
  })
  content: string;

  @Column({
    default: 0,
  })
  views: number;

  @Column({
    default: 0,
  })
  likes: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDel: boolean;

  @ManyToOne(() => User, (user) => user.pid)
  user: User;
}
