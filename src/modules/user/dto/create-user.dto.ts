import { RoleType } from "src/types";


export class CreateUserDto {
    readonly username: string;
    readonly password: string;
    readonly tel: string;
    readonly mail: string;
    readonly role?: RoleType;
}
