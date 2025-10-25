import React, { useState, useEffect } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { CloseIcon } from '../icons/CloseIcon';
import type { BlogPost } from '../../types';

const emptyPost: Omit<BlogPost, 'id'> = {
  title: '',
  author: '',
  date: new Date().toISOString().split('T')[0], // Today's date
  imageUrl: '',
  content: '',
};

interface BlogFormModalProps {
    post?: BlogPost;
    onSave: (post: BlogPost) => void;
    onClose: () => void;
}

export const BlogFormModal: React.FC<BlogFormModalProps> = ({ post, onSave, onClose }) => {
  const { t } = useLocalization();
  const [formData, setFormData] = useState<BlogPost | Omit<BlogPost, 'id'>>(post || emptyPost);
  
  useEffect(() => {
    setFormData(post || emptyPost);
  }, [post]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as BlogPost);
  };
  
  const title = 'id' in formData ? t('admin.blogForm.editPostTitle') : t('admin.blogForm.addPostTitle');

  const dateInputProps = {
    type: "date",
    name: "date",
    id: "date",
    value: formData.date,
    onChange: handleChange,
    required: true,
    className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand"
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-secondary rounded-2xl p-6 md:p-8 w-full max-w-3xl mx-auto shadow-2xl border border-accent/30 max-h-[90vh] overflow-y-auto"
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
                <label htmlFor="title" className="block text-sm font-medium text-light mb-1">{t('admin.blogForm.title')}</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-light mb-1">{t('admin.blogForm.author')}</label>
              <input type="text" name="author" id="author" value={formData.author} onChange={handleChange} required className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-light mb-1">{t('admin.blogForm.date')}</label>
              <input {...dateInputProps} />
            </div>
          </div>
            <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-light mb-1">{t('admin.blogForm.imageUrl')}</label>
                <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-light mb-1">{t('admin.blogForm.content')}</label>
              <textarea name="content" id="content" value={formData.content} onChange={handleChange} required rows={10} className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-accent text-highlight font-bold py-2 px-6 rounded-lg hover:bg-light hover:text-primary transition-colors">{t('admin.blogForm.cancel')}</button>
            <button type="submit" className="bg-brand text-primary font-bold py-2 px-6 rounded-lg hover:bg-sky-400 transition-colors">{t('admin.blogForm.save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
