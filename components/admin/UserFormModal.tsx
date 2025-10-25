import React, { useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { CloseIcon } from '../icons/CloseIcon';
import type { UserWithPassword } from '../../types';

const emptyUser: Omit<UserWithPassword, 'id'> = {
  username: '',
  password: '',
  role: 'EDITOR',
};

interface UserFormModalProps {
    user?: UserWithPassword;
    onSave: (user: UserWithPassword) => void;
    onClose: () => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({ user, onSave, onClose }) => {
  const { t } = useLocalization();
  const [formData, setFormData] = useState<UserWithPassword | Omit<UserWithPassword, 'id'>>(user ? { ...user, password: '' } : emptyUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as UserWithPassword);
  };

  const isEditing = 'id' in formData;
  const title = isEditing ? t('admin.userForm.editUserTitle') : t('admin.userForm.addUserTitle');
  
  const passwordInputProps = {
    type: "password",
    name: "password",
    id: "password",
    value: formData.password || '',
    onChange: handleChange,
    placeholder: isEditing ? t('admin.userForm.passwordHint') : '',
    required: !isEditing,
    className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand"
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-secondary rounded-2xl p-6 md:p-8 w-full max-w-md mx-auto shadow-2xl border border-accent/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-light hover:text-white p-1 rounded-full hover:bg-accent transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-light mb-1">{t('admin.username')}</label>
            <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} required className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-light mb-1">{t('admin.userForm.password')}</label>
            <input {...passwordInputProps} />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-light mb-1">{t('admin.userForm.role')}</label>
            <select name="role" id="role" value={formData.role} onChange={handleChange} required className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand">
              <option value="ADMIN">{t('admin.roles.ADMIN')}</option>
              <option value="EDITOR">{t('admin.roles.EDITOR')}</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-accent text-highlight font-bold py-2 px-6 rounded-lg hover:bg-light hover:text-primary transition-colors">{t('admin.userForm.cancel')}</button>
            <button type="submit" className="bg-brand text-primary font-bold py-2 px-6 rounded-lg hover:bg-sky-400 transition-colors">{t('admin.userForm.save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
