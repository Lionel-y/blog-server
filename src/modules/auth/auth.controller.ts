import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { User } from 'src/db/entities/User.entity';
import { AuthService } from './auth.service';
import { JwtGuard } from './guard/jwt.guard';
import { LocalAdminAuthGuard } from './guard/local-auth.guard';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 登录接口对于未注册的用户会自动注册 因此这部分逻辑不使用认证守卫 采用自用的逻辑
  @Post('/user/login')
  async UserLogin(@Body() user: User) {
    return this.authService.userLogin(user);
  }

  // admin登录接口
  @UseGuards(LocalAdminAuthGuard)
  @Post('/admin/login')
  async AdminLogin(@Request() req) {
    return this.authService.adminLogin(req.user);
  }
  @UseGuards(JwtGuard)
  @Get('/profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
