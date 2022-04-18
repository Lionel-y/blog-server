import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entities/User.entity';
import { ROLE } from 'src/db/types';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private UserRepo: Repository<User>,
    private readonly jwtServicer: JwtService,
  ) {}

  async validateUser(username: string, email: string) {
    const user = await this.UserRepo.findOne({ where: { username, email } });
    return user;
  }

  async validateAdmin(username: string, password: string) {
    const admin = await this.UserRepo.findOne({
      where: { username, password, role: ROLE.ADMIN },
    });
    return admin;
  }

  async adminLogin(user: User) {
    const payload = { username: user.username, sub: user.uid };
    return {
      access_token: this.jwtServicer.sign(payload),
    };
  }

  async userLogin(user: User) {
    console.log(user);
    const _u1 = await this.UserRepo.findOne({ email: user.email });
    if (_u1) {
      if (user.username === _u1.username) {
        const payload = { username: _u1.username, sub: _u1.uid };
        return {
          success: true,
          access_token: this.jwtServicer.sign(payload),
        };
      } else {
        return { success: false, msg: '用户名错误' };
      }
    } else {
      const _u2 = await this.UserRepo.findOne({ username: user.username });
      if (_u2) {
        return { success: false, msg: '创建账号失败!用户名已存在' };
      } else {
        const newUser = new User();
        newUser.username = user.username;
        newUser.email = user.email;
        const ret = await this.UserRepo.save(newUser);
        const payload = { username: ret.username, sub: ret.uid };
        return {
          access_token: this.jwtServicer.sign(payload),
        };
      }
    }
  }
}
