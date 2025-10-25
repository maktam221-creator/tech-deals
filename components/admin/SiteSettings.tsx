import React, { useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
// FIX: Alias the imported type to prevent name collision with the component.
import type { SiteSettings as SiteSettingsType } from '../../types';

interface SiteSettingsProps {
    settings: SiteSettingsType;
    onSave: (settings: SiteSettingsType) => void;
}

export const SiteSettings: React.FC<SiteSettingsProps> = ({ settings, onSave }) => {
    const { t } = useLocalization();
    const [formData, setFormData] = useState(settings);
    const [saveMessage, setSaveMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'copyrightYear' ? parseInt(value, 10) || new Date().getFullYear() : value }));
    };
    
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        setSaveMessage(t('admin.settingsSaved'));
        setTimeout(() => setSaveMessage(''), 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="aboutUs" className="block text-sm font-medium text-light mb-1">{t('admin.aboutUs')}</label>
                <textarea name="aboutUs" id="aboutUs" value={formData.aboutUs} onChange={handleChange} rows={5} className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <div>
                <label htmlFor="privacyPolicy" className="block text-sm font-medium text-light mb-1">{t('admin.privacyPolicy')}</label>
                <textarea name="privacyPolicy" id="privacyPolicy" value={formData.privacyPolicy} onChange={handleChange} rows={5} className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <div>
                <label htmlFor="copyrightYear" className="block text-sm font-medium text-light mb-1">{t('admin.copyrightYear')}</label>
                <input type="number" name="copyrightYear" id="copyrightYear" value={formData.copyrightYear} onChange={handleChange} className="w-full max-w-xs bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            
            <div className="mt-8 border-t border-accent/20 pt-6">
                <h3 className="text-xl font-bold text-white mb-2">{t('admin.siteVisibility')}</h3>
                <p className="text-light mb-4">{t('admin.siteVisibilityDesc')}</p>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <input type="checkbox" name="showBlogSection" id="showBlogSection" checked={formData.showBlogSection} onChange={handleCheckboxChange} className="w-5 h-5 rounded bg-accent border-accent text-brand focus:ring-brand" />
                        <label htmlFor="showBlogSection" className="mx-3 text-sm font-medium text-highlight">{t('admin.showBlogSection')}</label>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" name="showCouponsSection" id="showCouponsSection" checked={formData.showCouponsSection} onChange={handleCheckboxChange} className="w-5 h-5 rounded bg-accent border-accent text-brand focus:ring-brand" />
                        <label htmlFor="showCouponsSection" className="mx-3 text-sm font-medium text-highlight">{t('admin.showCouponsSection')}</label>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
                <button type="submit" className="bg-brand text-primary font-bold py-2 px-6 rounded-lg hover:bg-sky-400 transition-colors">
                    {t('admin.saveSettings')}
                </button>
                {saveMessage && <p className="text-green-400 animate-pulse">{saveMessage}</p>}
            </div>
        </form>
    );
};
