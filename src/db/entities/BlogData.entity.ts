import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BlogData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'date',
    unique: true,
  })
  record_date: Date;

  @Column({
    type: 'int',
    default: 0,
  })
  views_count: number;

  @Column({
    type: 'int',
    default: 0,
  })
  likes_count: number;

  @Column({
    type: 'int',
    default: 0,
  })
  articles_count: number;

  @Column({
    type: 'int',
    default: 0,
  })
  comments_count: number;
}
