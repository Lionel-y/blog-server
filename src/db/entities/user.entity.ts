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
    @PrimaryColumn()
    uid: string;

    @BeforeInsert()
    generateUUIDString() {
        this.uid = randomUUID().replace(/-/g, '');
    }

    @Column({
        nullable: false,
        unique: true,
    })
    username: string;

    @Column({
        nullable: false,
        select: false,
    })
    password: string;

    @Column()
    tel: string;

    @Column()
    mail: string;

    @CreateDateColumn()
    createAt: Date;

    @Column({
        type: 'tinyint',
        nullable: false,
        default: ROLE.USER,
    })
    role: number;

    @Column({
        default: false,
    })
    isDel: boolean;

    @OneToMany(() => Article, (article) => article.user)
    pid: Article[];
}
