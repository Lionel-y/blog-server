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
import { OPResultTransform } from './utils';

@Controller({
    path: 'api/user',
})
export class ApiUserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getAll() {
        return this.userService.getAll();
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        const opr = this.userService.create(createUserDto);
        return OPResultTransform(opr);
    }

    @Get(':uid')
    getUser(@Param('uid') uid: string) {
        return this.userService.getUser(uid);
    }

    @Get('getDelUser/:uid')
    getDelUser(@Param('uid') uid: string) {
        return this.userService.getUser(uid, true);
    }

    @Get('getDelUser')
    getAllDelUser() {
        return this.userService.getAll(true);
    }

    @Delete(':uid')
    delUser(@Param('uid') uid: string) {
        const opr = this.userService.delUser(uid);
        return OPResultTransform(opr);
    }

    @Patch(':uid')
    updateUser(
        @Param('uid') uid: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        const opr = this.userService.update(uid, updateUserDto);
        return OPResultTransform(opr);
    }
}
