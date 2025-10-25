import React, { useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { CloseIcon } from '../icons/CloseIcon';

interface AddProductByUrlModalProps {
    isOpen: boolean;
    isLoading: boolean;
    error: string;
    onGenerate: (url: string) => void;
    onClose: () => void;
}

export const AddProductByUrlModal: React.FC<AddProductByUrlModalProps> = ({ isOpen, isLoading, error, onGenerate, onClose }) => {
    const { t } = useLocalization();
    const [url, setUrl] = useState('');

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url) {
            onGenerate(url);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-secondary rounded-2xl p-6 md:p-8 w-full max-w-lg mx-auto shadow-2xl border border-accent/30"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">{t('admin.productUrlModal.title')}</h2>
                    <button onClick={onClose} className="text-light hover:text-white p-1 rounded-full hover:bg-accent transition-colors" disabled={isLoading}>
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="url"
                            name="productUrl"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder={t('admin.productUrlModal.placeholder')}
                            required
                            disabled={isLoading}
                            className="w-full bg-accent text-highlight rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-accent text-highlight font-bold py-2 px-6 rounded-lg hover:bg-light hover:text-primary transition-colors" disabled={isLoading}>{t('admin.productForm.cancel')}</button>
                        <button
                            type="submit"
                            className="bg-brand text-primary font-bold py-2 px-6 rounded-lg hover:bg-sky-400 transition-colors flex items-center justify-center disabled:bg-accent disabled:cursor-not-allowed"
                            disabled={isLoading || !url}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('admin.productUrlModal.generating')}
                                </>
                            ) : t('admin.productUrlModal.generate')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
