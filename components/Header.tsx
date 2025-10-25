import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Dropdown } from './Dropdown';
import { HeartIcon } from './icons/HeartIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { LANGUAGES, CURRENCIES, COUNTRIES } from '../constants';
import { SiteSettings } from '../types';

interface HeaderProps {
    wishlistCount: number;
    onNavigate: (view: 'home' | 'deals' | 'wishlist') => void;
    onGoToCategories: () => void;
    onGoToBlog: () => void;
    siteSettings: SiteSettings;
}

export const Header: React.FC<HeaderProps> = ({ wishlistCount, onNavigate, onGoToCategories, onGoToBlog, siteSettings }) => {
  const { t, language, setLanguage, country, setCountry } = useLocalization();

  const countryOptions = COUNTRIES.map(c => {
    const currency = CURRENCIES.find(curr => curr.code === c.currencyCode);
    return { value: c.code, label: `${c.flag} ${c.name} ${currency ? `(${currency.symbol})` : ''}` };
  });

  return (
    <header className="bg-secondary/50 backdrop-blur-lg sticky top-0 z-50 shadow-md">
      <nav className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div
          className="text-2xl font-black text-brand cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          {t('header.brand')}
        </div>
        <div className="hidden md:flex items-center space-x-8 space-x-reverse text-lg font-semibold">
          <a onClick={() => onNavigate('home')} className="text-highlight hover:text-brand transition-colors cursor-pointer">{t('header.home')}</a>
          <a onClick={() => onNavigate('deals')} className="text-highlight hover:text-brand transition-colors cursor-pointer">{t('header.deals')}</a>
          <a onClick={onGoToCategories} className="text-highlight hover:text-brand transition-colors cursor-pointer">{t('header.categories')}</a>
          {siteSettings.showBlogSection && (
            <a onClick={onGoToBlog} className="text-highlight hover:text-brand transition-colors cursor-pointer">{t('header.blog')}</a>
          )}
        </div>
        <div className="flex items-center gap-2">
            <Dropdown
            value={language.code}
            onChange={(value) => setLanguage(LANGUAGES.find(l => l.code === value)!)}
            options={LANGUAGES.map(lang => ({ value: lang.code, label: lang.name }))}
            renderButton={(selectedOption) => (
                <div className="flex items-center gap-1 p-2 rounded-full hover:bg-accent transition-colors">
                    <GlobeIcon className="w-5 h-5 text-highlight" />
                    <span className="text-sm font-semibold text-highlight">{selectedOption?.value.toUpperCase()}</span>
                </div>
            )}
            />
             <Dropdown
                value={country.code}
                onChange={(value) => setCountry(COUNTRIES.find(c => c.code === value)!)}
                options={countryOptions}
                renderButton={(selectedOption) => (
                    <div className="flex items-center gap-1 p-2 rounded-full hover:bg-accent transition-colors">
                        <span className="text-lg">{COUNTRIES.find(c => c.code === selectedOption?.value)?.flag}</span>
                    </div>
                )}
            />
          <div className="relative">
            <button
              onClick={() => onNavigate('wishlist')}
              className="flex items-center space-x-2 space-x-reverse p-2 rounded-full hover:bg-accent transition-colors"
              aria-label={`${t('header.wishlistAriaLabel')}, ${wishlistCount} ${t('header.products')}`}
            >
              <HeartIcon className="w-6 h-6 text-highlight" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
