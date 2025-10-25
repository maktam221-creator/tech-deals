import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import type { BlogPost } from '../types';

interface BlogCardProps {
    post: BlogPost;
    onReadMore: (post: BlogPost) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, onReadMore }) => {
  const { t } = useLocalization();
  return (
    <div className="bg-secondary rounded-xl overflow-hidden shadow-lg flex flex-col h-full group">
      <div className="overflow-hidden">
        <img 
            className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500" 
            src={post.imageUrl} 
            alt={t(`blog.${post.id}.title`)} 
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-xl text-white mt-1 mb-3 flex-grow group-hover:text-brand transition-colors">
            {t(`blog.${post.id}.title`)}
        </h3>
        <p className="text-sm text-light mb-4">
            {t('blog.publishedOn', { date: post.date, author: post.author })}
        </p>
        <button 
          onClick={() => onReadMore(post)}
          className="mt-auto w-full text-center bg-accent text-highlight font-bold py-3 rounded-lg hover:bg-brand hover:text-primary transition-colors duration-300"
        >
          {t('blog.readMore')}
        </button>
      </div>
    </div>
  );
};
