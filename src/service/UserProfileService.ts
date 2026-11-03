import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../Firebase';
import type { UserPermission } from '../models/UserPermission';
import type { UserProfile } from '../models/UserProfile';

class UserProfileService {
    private getProfileDocPath(uid: string): string {
        return `users/${uid}`;
    }

    private async getAuthenticatedUser(): Promise<User> {
        if (auth.currentUser) {
            return auth.currentUser;
        }

        return new Promise<User>((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(
                auth,
                (user) => {
                    unsubscribe();
                    if (user) {
                        resolve(user);
                    } else {
                        reject(new Error('User is not authenticated.'));
                    }
                },
                (error) => {
                    unsubscribe();
                    reject(error);
                }
            );
        });
    }

    private normalizePermission(permission: unknown): UserPermission {
        return permission === 'Admin' ? 'Admin' : 'User';
    }

    async getMyProfile(): Promise<UserProfile | null> {
        const db = getFirestore();
        const user = await this.getAuthenticatedUser();
        const profileRef = doc(db, this.getProfileDocPath(user.uid));
        const profileSnapshot = await getDoc(profileRef);

        if (!profileSnapshot.exists()) {
            return null;
        }

        const data = profileSnapshot.data() as Partial<UserProfile>;

        return {
            uid: user.uid,
            firstName: data.firstName ?? '',
            lastName: data.lastName ?? '',
            permission: this.normalizePermission(data.permission),
            aiAccess: data.aiAccess === true,
            email: data.email,
            updatedAt: data.updatedAt,
        };
    }

    async saveMyProfile(firstName: string, lastName: string): Promise<void> {
        const db = getFirestore();
        const user = await this.getAuthenticatedUser();
        const profileRef = doc(db, this.getProfileDocPath(user.uid));
        const profileSnapshot = await getDoc(profileRef);

        const existingData = profileSnapshot.exists() ? (profileSnapshot.data() as Partial<UserProfile>) : {};

        await setDoc(profileRef, {
            uid: user.uid,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            permission: this.normalizePermission(existingData.permission),
            email: user.email ?? existingData.email ?? '',
            updatedAt: new Date().toISOString(),
        }, { merge: true });
    }

    async isCurrentUserAdmin(): Promise<boolean> {
        const profile = await this.getMyProfile();
        return profile?.permission === 'Admin';
    }

    async getAllUsersWithPermissions(): Promise<UserProfile[]> {
        const db = getFirestore();
        const profilesRef = collection(db, 'users');
        const querySnapshot = await getDocs(profilesRef);

        return querySnapshot.docs
            .map((profileDoc) => {
            const uid = profileDoc.id;
            const data = profileDoc.data() as Partial<UserProfile>;

            return {
                uid,
                firstName: data.firstName ?? '',
                lastName: data.lastName ?? '',
                permission: this.normalizePermission(data.permission),
                aiAccess: data.aiAccess === true,
                email: data.email,
                updatedAt: data.updatedAt,
            };
        });
    }

    // Admin only (enforced by the Firestore security rules): sets a user's role and AI access.
    async updateUserAccess(uid: string, permission: UserPermission, aiAccess: boolean): Promise<void> {
        if (!uid) {
            throw new Error('User ID (uid) is required.');
        }

        const db = getFirestore();
        const targetProfileRef = doc(db, this.getProfileDocPath(uid));

        await setDoc(targetProfileRef, {
            uid,
            permission,
            aiAccess,
            updatedAt: new Date().toISOString(),
        }, { merge: true });
    }
}

const userProfileService = new UserProfileService();

export default userProfileService;
