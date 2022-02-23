import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { UserService } from 'src/modules/user/user.service';

@Controller({
  path: 'api/user',
})
export class ApiUserController {
  constructor(private readonly userService: UserService) {}

  // 获取所有用户列表
  @Get()
  getAll() {
    return this.userService.getAll();
  }

  //
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':uid')
  getUser(@Param('uid') uid: string) {
    return this.userService.getUser(uid);
  }

  @Get('/isinuse/:username')
  isInUse(@Param('username') username: string) {
    return this.userService.isInUse(username);
  }

  @Get('getDelUser/:uid')
  getDelUser(@Param('uid') uid: string) {
    return this.userService.getUser(uid);
  }

  @Get('getDelUser')
  getAllDelUser() {
    return this.userService.getAll();
  }

  @Delete(':uid')
  delUser(@Param('uid') uid: string) {
    return this.userService.delUser(uid);
  }

  @Patch(':uid')
  updateUser(@Param('uid') uid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(uid, updateUserDto);
  }
}
