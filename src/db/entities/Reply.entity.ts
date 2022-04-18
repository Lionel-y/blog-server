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
import { Comment } from './Comment.entity';
import { User } from './User.entity';

@Entity()
export class Reply {
  // 分类id
  @PrimaryColumn()
  rid: string;

  @BeforeInsert()
  generateUUIDString() {
    this.rid = randomUUID().replace(/-/g, '');
  }

  @Column()
  commentId: string;

  @Column({
    nullable: true,
  })
  to_user: string;
  @Column({
    nullable: true,
  })
  from_user: string;

  @Column({ length: 200 })
  content: string;

  @CreateDateColumn()
  create_at: string;

  @ManyToOne(() => Comment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commentId', referencedColumnName: 'commentId' })
  comment: Comment;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'to_user', referencedColumnName: 'username' })
  toUser: User;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'from_user', referencedColumnName: 'username' })
  fromUser: User;
}
