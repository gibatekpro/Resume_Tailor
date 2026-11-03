import type { UserPermission } from './UserPermission';

export interface UserProfile {
    uid: string;
    firstName: string;
    lastName: string;
    permission: UserPermission;
    aiAccess: boolean;          // may use AI tailoring; only an admin can set it. Admins always may.
    email?: string;
    updatedAt?: string;
}
