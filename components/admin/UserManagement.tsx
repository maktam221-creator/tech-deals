import React, { useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { useAuth } from '../../context/AuthContext';
import { UserFormModal } from './UserFormModal';
import type { User, UserWithPassword } from '../../types';

export const UserManagement: React.FC = () => {
    const { t } = useLocalization();
    const { users, addUser, updateUser, deleteUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | undefined>(undefined);

    const handleAddNew = () => {
        setEditingUser(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = (userId: number) => {
        if (window.confirm(t('admin.deleteConfirm'))) {
            deleteUser(userId);
        }
    };

    const handleSave = (user: UserWithPassword) => {
        if ('id' in user) {
            updateUser(user);
        } else {
            addUser(user);
        }
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="flex justify-end items-center mb-6">
                <button onClick={handleAddNew} className="bg-brand text-primary font-bold py-2 px-4 rounded-lg hover:bg-sky-400 transition-colors">
                    {t('admin.addNewUser')}
                </button>
            </div>
            <div className="bg-primary p-4 rounded-xl shadow-inner">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-light">
                        <thead className="text-xs text-highlight uppercase bg-accent">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('admin.username')}</th>
                                <th scope="col" className="px-6 py-3">{t('admin.role')}</th>
                                <th scope="col" className="px-6 py-3">{t('admin.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b border-accent">
                                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{user.username}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-sky-500 text-sky-100' : 'bg-green-500 text-green-100'}`}>
                                            {t(`admin.roles.${user.role}`)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-4">
                                        <button onClick={() => handleEdit(user)} className="font-medium text-brand hover:underline">{t('admin.edit')}</button>
                                        <button onClick={() => handleDelete(user.id)} className="font-medium text-red-500 hover:underline">{t('admin.delete')}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <UserFormModal 
                    user={editingUser as UserWithPassword | undefined}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};
