import { useEffect, useMemo, useState } from 'react';
import AppLayout from '../components/shared/AppLayout';
import TopNav from '../components/shared/TopNav';
import PageLoadingOverlay from '../components/shared/PageLoadingOverlay';
import userProfileService from '../service/UserProfileService';
import type { UserProfile } from '../models/UserProfile';
import type { UserPermission } from '../models/UserPermission';

export const AdminUsersPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Loading users...');
    const [isForbidden, setIsForbidden] = useState(false);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState('');
    const [permissionEdits, setPermissionEdits] = useState<Record<string, UserPermission>>({});

    const sortedUsers = useMemo(
        () => [...users].sort((a, b) => a.uid.localeCompare(b.uid)),
        [users]
    );

    const fetchUsers = async () => {
        setIsLoading(true);
        setLoadingMessage('Loading users...');
        setSaveError('');

        try {
            const isAdmin = await userProfileService.isCurrentUserAdmin();

            if (!isAdmin) {
                setIsForbidden(true);
                setUsers([]);
                return;
            }

            setIsForbidden(false);
            const allUsers = await userProfileService.getAllUsersWithPermissions();
            setUsers(allUsers);

            const edits: Record<string, UserPermission> = {};
            allUsers.forEach((user) => {
                edits[user.uid] = user.permission;
            });
            setPermissionEdits(edits);
        } catch (error) {
            setSaveError('Failed to load users.');
            console.error('Error loading users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchUsers();
    }, []);

    const handlePermissionChange = (uid: string, permission: UserPermission) => {
        setPermissionEdits((previous) => ({
            ...previous,
            [uid]: permission,
        }));
    };

    const handlePermissionSave = async (uid: string) => {
        const nextPermission = permissionEdits[uid] ?? 'User';
        setIsLoading(true);
        setLoadingMessage('Updating permission...');
        setSaveError('');
        setSaveSuccess('');

        try {
            await userProfileService.updateUserPermission(uid, nextPermission);
            setUsers((previous) =>
                previous.map((user) =>
                    user.uid === uid ? { ...user, permission: nextPermission } : user
                )
            );
            setSaveSuccess('Permission updated successfully.');
        } catch (error) {
            setSaveError('Failed to update permission.');
            console.error('Error updating permission:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <TopNav title="Admin Users" />
            <main className="relative flex flex-1 flex-col px-4 py-5 md:px-6 md:py-6 lg:px-8">
                <PageLoadingOverlay
                    visible={isLoading}
                    withinParent={true}
                    message={loadingMessage}
                />

                <div className="w-full rounded-2xl border border-[#c6c6cd] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.05)] md:p-6">
                    <div className="mb-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2170e4]">Administration</p>
                        <h2 className="mt-1 text-xl font-semibold text-[#161c22]">User Permissions</h2>
                        <p className="text-sm text-[#45464d]">Manage each user permission level: Admin or User.</p>
                    </div>

                    {saveSuccess && !isLoading && (
                        <div className="mb-4 rounded-xl border border-[#b7e1c2] bg-[#edf9f1] px-4 py-3 text-sm text-[#225b34]" role="status">
                            {saveSuccess}
                        </div>
                    )}

                    {saveError && !isLoading && (
                        <div className="mb-4 rounded-xl border border-[#f3c3c3] bg-[#fff1f1] px-4 py-3 text-sm text-[#7a1f1f]" role="alert">
                            {saveError}
                        </div>
                    )}

                    {isForbidden ? (
                        <div className="rounded-xl border border-[#f3c3c3] bg-[#fff1f1] px-4 py-3 text-sm text-[#7a1f1f]" role="alert">
                            Only users with Admin permission can access this page.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-[#eaeaf0] text-left text-sm text-[#45464d]">
                                        <th className="px-3 py-3 font-semibold">First name</th>
                                        <th className="px-3 py-3 font-semibold">Last name</th>
                                        <th className="px-3 py-3 font-semibold">User ID</th>
                                        <th className="px-3 py-3 font-semibold">Permission</th>
                                        <th className="px-3 py-3 font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedUsers.map((user) => (
                                        <tr key={user.uid} className="border-b border-[#f1f2f6] text-sm text-[#161c22]">
                                            <td className="px-3 py-3">{user.firstName || '-'}</td>
                                            <td className="px-3 py-3">{user.lastName || '-'}</td>
                                            <td className="px-3 py-3 font-mono text-xs text-[#45464d]">{user.uid}</td>
                                            <td className="px-3 py-3">
                                                <select
                                                    value={permissionEdits[user.uid] ?? user.permission}
                                                    onChange={(event) => handlePermissionChange(user.uid, event.target.value as UserPermission)}
                                                    className="rounded-lg border border-[#c6c6cd] bg-[#f6f9ff] px-3 py-2 text-sm text-[#161c22] outline-none"
                                                >
                                                    <option value="Admin">Admin</option>
                                                    <option value="User">User</option>
                                                </select>
                                            </td>
                                            <td className="px-3 py-3">
                                                <button
                                                    type="button"
                                                    disabled={isLoading}
                                                    onClick={() => handlePermissionSave(user.uid)}
                                                    className="rounded-lg bg-[#2170e4] px-3 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#0058be] disabled:cursor-not-allowed disabled:bg-[#9ab9ee]"
                                                >
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {sortedUsers.length === 0 && !isLoading && (
                                <p className="px-1 py-4 text-sm text-[#45464d]">No user profiles found.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </AppLayout>
    );
};
