import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { ApiUserController } from './api.user.controller';

@Module({
    imports: [UserModule],
    controllers: [ApiUserController],
})
export class ApiModule {}
