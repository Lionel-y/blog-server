import { RoleType } from 'src/types';

export class CreateUserDto {
  readonly username: string;
  readonly password: string;
  readonly role?: RoleType;
}
