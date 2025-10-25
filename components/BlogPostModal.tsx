import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { CloseIcon } from './icons/CloseIcon';
import type { BlogPost } from '../types';

interface BlogPostModalProps {
    post: BlogPost;
    onClose: () => void;
}

export const BlogPostModal: React.FC<BlogPostModalProps> = ({ post, onClose }) => {
    const { t } = useLocalization();

    const modalContentProps = {
      className: "bg-secondary rounded-2xl w-full max-w-4xl mx-auto shadow-2xl border border-accent/30 max-h-[90vh] flex flex-col transform animate-scale-in",
      onClick: (e: React.MouseEvent) => e.stopPropagation()
    };

    return (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="blog-post-title"
        >
          <div {...modalContentProps}>
            <div className="relative">
                <img src={post.imageUrl} alt={t(`blog.${post.id}.title`)} className="w-full h-64 object-cover rounded-t-2xl" />
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-white bg-black/40 p-2 rounded-full hover:bg-black/60 transition-colors" 
                    aria-label={t('modal.close')}
                >
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto">
                <h2 id="blog-post-title" className="text-3xl font-bold text-white mb-2">{t(`blog.${post.id}.title`)}</h2>
                <p className="text-sm text-light mb-6">
                    {t('blog.publishedOn', { date: post.date, author: post.author })}
                </p>
                <div className="prose prose-invert max-w-none text-highlight prose-p:text-light prose-headings:text-white prose-strong:text-white">
                    <p className="whitespace-pre-wrap leading-relaxed">{post.content}</p>
                </div>
            </div>
          </div>

           <style>{`
              @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
              .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
              @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
              .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};
