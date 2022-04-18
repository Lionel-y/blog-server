import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import {
  LocalAdminStrategy,
  LocalUserStrategy,
} from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { User } from 'src/db/entities/User.entity';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './const';
import { AdminJwtStrategy, UserJwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({ secret: JWT_SECRET }),
  ],
  providers: [
    AuthService,
    LocalUserStrategy,
    LocalAdminStrategy,
    UserJwtStrategy,
    AdminJwtStrategy,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
