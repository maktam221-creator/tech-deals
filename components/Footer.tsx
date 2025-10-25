import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import type { SiteSettings } from '../types';

interface FooterProps {
  onNavigate: (view: 'about' | 'privacy' | 'admin') => void;
  siteSettings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, siteSettings }) => {
  const { t } = useLocalization();

  return (
    <footer className="bg-secondary mt-12">
      <div className="container mx-auto px-4 py-8 text-center text-light">
        <div className="text-xl font-bold text-brand mb-2">
          {t('footer.brand')}
        </div>
        <p className="mb-4">
          {t('footer.copyright', { year: siteSettings.copyrightYear })}
        </p>
        <div className="flex justify-center space-x-6 space-x-reverse">
          <a onClick={() => onNavigate('about')} className="hover:text-brand transition-colors cursor-pointer">{t('footer.about')}</a>
          <a onClick={() => onNavigate('privacy')} className="hover:text-brand transition-colors cursor-pointer">{t('footer.privacy')}</a>
        </div>
        <div className="mt-6 border-t border-accent/20 pt-4">
           <a onClick={() => onNavigate('admin')} className="text-sm text-accent hover:text-brand transition-colors cursor-pointer">Admin Panel</a>
        </div>
      </div>
    </footer>
  );
};
