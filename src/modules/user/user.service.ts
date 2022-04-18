import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entities/User.entity';
import { ROLE } from 'src/db/types';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private UserRepo: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    const _user = new User();
    _user.username = user.username;
    _user.email = user.email;
    _user.password = user.password;
    // 这里测试环境
    _user.role = ROLE.ADMIN;
    return await this.UserRepo.save(_user);
  }

  async getAll() {
    const user = new User();
    return await this.UserRepo.findAndCount();
  }

  async getUser(uid: string) {
    const ret = await this.UserRepo.findOne(uid);
    return ret;
  }
}
