import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalUserAuthGuard } from '../auth/guard/local-auth.guard';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { FetchInfoResponseInterceptor } from 'src/interceptor/fetchInfoResponse.interceptor';

@Controller({
  path: 'api/user',
})
export class ApiUserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create/admin')
  createAdmin(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(FetchInfoResponseInterceptor)
  @Get('/profile')
  getProfile(@Request() req) {
    console.log(req.user);
    return req.user;
  }

  // 测试接口
  @UseGuards(LocalUserAuthGuard)
  @Post('/test')
  async get(@Request() req) {
    console.log('12');
    return req.user;
  }
}
