import React, { useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import type { SiteSettings } from '../../types';

interface MonetizationSettingsProps {
    settings: SiteSettings;
    onSave: (settings: SiteSettings) => void;
}

export const MonetizationSettings: React.FC<MonetizationSettingsProps> = ({ settings, onSave }) => {
    const { t } = useLocalization();
    const [formData, setFormData] = useState<SiteSettings>(settings);
    const [saveMessage, setSaveMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'number' ? parseFloat(value) || 0 : value 
        }));
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
            <div className="flex items-center">
                <input type="checkbox" name="showAds" id="showAds" checked={formData.showAds} onChange={handleCheckboxChange} className="w-5 h-5 rounded bg-accent border-accent text-brand focus:ring-brand" />
                <label htmlFor="showAds" className="mx-3 text-sm font-medium text-highlight">{t('admin.showAds')}</label>
            </div>
            <div>
                <label htmlFor="googleAdSenseId" className="block text-sm font-medium text-light mb-1">{t('admin.adsenseId')}</label>
                <input type="text" name="googleAdSenseId" id="googleAdSenseId" value={formData.googleAdSenseId || ''} onChange={handleChange} className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" placeholder="ca-pub-..." />
            </div>
            <div>
                <label htmlFor="facebookPixelId" className="block text-sm font-medium text-light mb-1">{t('admin.pixelId')}</label>
                <input type="text" name="facebookPixelId" id="facebookPixelId" value={formData.facebookPixelId || ''} onChange={handleChange} className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" placeholder="Your Pixel ID" />
            </div>
            <div>
                <label htmlFor="affiliateCommissionRate" className="block text-sm font-medium text-light mb-1">{t('admin.commissionRate')}</label>
                <input type="number" name="affiliateCommissionRate" id="affiliateCommissionRate" value={formData.affiliateCommissionRate || 0} onChange={handleChange} step="0.1" min="0" max="100" className="w-full max-w-xs bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <div className="flex items-center gap-4">
                <button type="submit" className="bg-brand text-primary font-bold py-2 px-6 rounded-lg hover:bg-sky-400 transition-colors">
                    {t('admin.saveSettings')}
                </button>
                {saveMessage && <p className="text-green-400 animate-pulse">{saveMessage}</p>}
            </div>
        </form>
    );
};
