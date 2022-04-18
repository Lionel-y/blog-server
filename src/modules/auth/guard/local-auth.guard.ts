import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalUserAuthGuard extends AuthGuard('user-local') {}

@Injectable()
export class LocalAdminAuthGuard extends AuthGuard('admin-local') {}
