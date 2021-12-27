import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entities/user.entity';
import { OptionResult } from 'src/types';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private UserRepo: Repository<User>,
    ) {}

    async isExist(identity: { username?: string; uid?: string }) {
        const ret = await this.UserRepo.findOne(identity);
        return ret ? true : false;
    }
    async create(createUserDto: CreateUserDto) {
        const res: OptionResult = {
            isFail: true,
            reason: 'unknown error',
        };
        const user = new User();
        user.username = createUserDto.username;
        user.password = createUserDto.password;
        user.tel = createUserDto.tel;
        user.mail = createUserDto.mail;
        createUserDto.role && (user.role = createUserDto.role);
        const isExist = await this.isExist({ username: user.username });
        if (isExist) {
            res.isFail = true;
            res.reason = `username '${user.username}' is already exist`;
            return res;
        }
        try {
            const ret = await this.UserRepo.insert(user);
            if (ret) {
                res.isFail = false;
                res.reason = undefined;
            }
        } catch (e) {
            res.reason = 'insert user failed';
        }
        return res;
    }

    async getUser(uid: string, isDel = false) {
        const ret = await this.UserRepo.find({ uid, isDel });
        return ret;
    }

    async getAll(isDel = false) {
        return await this.UserRepo.findAndCount({ isDel });
    }

    async delUser(uid: string) {
        const res: OptionResult = {
            isFail: true,
            reason: 'unknown error',
        };
        const user = await this.UserRepo.findOne(uid);
        if (user) {
            if (user.isDel) {
                res.isFail = false;
                res.reason = 'user has already delete';
                return res;
            }
            try {
                user.isDel = true;
                const ret = await this.UserRepo.save(user);
                if (ret) {
                    res.isFail = false;
                    res.reason = undefined;
                }
            } catch (e) {
                console.log(e);
                res.isFail = true;
                res.reason = 'delete user failed';
            }
        } else {
            res.isFail = true;
            res.reason = 'user is not exist';
        }
        return res;
    }

    findAll() {
        return `This action returns all user`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    async update(uid: string, updateUserDto: UpdateUserDto) {
        const res: OptionResult = {
            isFail: true,
            reason: 'unknown error',
        };

        const user = await this.UserRepo.findOne(uid);
        if (user) {
            if (this.isExist({ username: updateUserDto.username })) {
                res.reason = `the username '${updateUserDto.username}' is already in use`;
                return res;
            }
            user.username = updateUserDto.username && user.username;
            user.password = updateUserDto.password && user.password;
            user.mail = updateUserDto.mail && user.mail;
            user.tel = updateUserDto.tel && user.tel;
            user.role = updateUserDto.role && user.role;

            try {
                const ret = await this.UserRepo.save(user);
                if (ret) {
                    res.isFail = false;
                    res.reason = undefined;
                } else {
                    res.reason = 'update user info failed';
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            res.reason = `the user with id ${uid} does not exist`;
        }
        return res;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
