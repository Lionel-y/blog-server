import { ROLE as _ROLE } from 'src/db/types';

export enum RoleType {
    GUESTER = _ROLE.GUESTER,
    USER = _ROLE.USER,
    ADMIN = _ROLE.ADMIN,
}

export interface OptionResult {
    isFail: boolean;
    reason?: string;
}
