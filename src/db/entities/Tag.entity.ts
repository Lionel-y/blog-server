import { randomUUID } from 'crypto';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import TagMap from './TagMap.entity';

@Entity()
export default class Tag {
  // 标签id
  @PrimaryColumn()
  tid: string;

  @BeforeInsert()
  generateUUIDString() {
    this.tid = randomUUID().replace(/-/g, '');
  }

  // 标签名称
  @Column({
    unique: true,
    nullable: true,
  })
  tag_name: string;

  // 创建日期
  @CreateDateColumn()
  createAt: Date;

  @OneToMany(() => TagMap, (tagMap) => tagMap.id)
  tagMap: TagMap[];
}
