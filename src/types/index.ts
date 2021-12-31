import { ROLE as _ROLE } from 'src/db/types';
export interface OptionResult {
    isFail: boolean;
    reason?: string;
}

export enum RoleType {
    GUESTER = _ROLE.GUESTER,
    USER = _ROLE.USER,
    ADMIN = _ROLE.ADMIN,
}
