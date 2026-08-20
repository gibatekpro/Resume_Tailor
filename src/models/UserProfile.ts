import type { UserPermission } from './UserPermission';

export interface UserProfile {
    uid: string;
    firstName: string;
    lastName: string;
    permission: UserPermission;
    email?: string;
    updatedAt?: string;
}
