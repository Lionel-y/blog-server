import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('user-jwt') {}
@Injectable()
export class AdminJwtGuard extends AuthGuard('admin-jwt') {}
