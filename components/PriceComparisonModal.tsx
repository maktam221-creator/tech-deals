import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { formatCurrency } from '../utils/currency';
import { CloseIcon } from './icons/CloseIcon';
import type { Product } from '../types';

interface PriceComparisonModalProps {
    product: Product;
    onClose: () => void;
}

export const PriceComparisonModal: React.FC<PriceComparisonModalProps> = ({ product, onClose }) => {
  const { t, currency, language, convertPrice } = useLocalization();

  if (!product.priceComparison) {
    return null;
  }

  const convertedPriceComparison = product.priceComparison.map(record => ({
    ...record,
    price: convertPrice(record.price)
  }));
  
  const bestPrice = Math.min(...convertedPriceComparison.map(p => p.price));
  const productName = product.name || t(`products.${product.id}.name`);

  const modalContentProps = {
    className: "bg-secondary rounded-2xl p-6 md:p-8 w-full max-w-lg mx-auto shadow-2xl border border-accent/30 transform animate-scale-in",
    onClick: (e: React.MouseEvent) => e.stopPropagation()
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="price-comparison-title"
    >
      <div {...modalContentProps}>
        <div className="flex justify-between items-start mb-4">
          <div className={language.dir === 'rtl' ? 'text-right' : 'text-left'}>
            <p className="text-sm text-brand font-semibold">{t(`categories.${product.category}`)}</p>
            <h2 id="price-comparison-title" className="text-2xl font-bold text-white">{productName}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-light hover:text-white p-1 rounded-full hover:bg-accent transition-colors"
            aria-label={t('modal.close')}
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <img src={product.imageUrl} alt={productName} className="w-full h-56 object-cover rounded-lg mb-6" />
        
        <ul className="space-y-3">
          {convertedPriceComparison
            .sort((a,b) => a.price - b.price)
            .map((record, index) => (
            <li 
              key={index} 
              className={`flex justify-between items-center bg-accent p-4 rounded-lg transition-all duration-300 ${record.price === bestPrice ? 'border-2 border-brand shadow-lg' : 'border-2 border-transparent'}`}
            >
              <span className="font-semibold text-lg text-highlight">{t(`stores.${record.store}`)}</span>
              <div className="flex items-center gap-4">
                 <div className={language.dir === 'rtl' ? 'text-left' : 'text-right'}>
                    <span className="font-black text-xl text-white" lang="en" dir="ltr">{formatCurrency(record.price, currency.code, language.code)}</span>
                    {record.price === bestPrice && <p className="text-xs text-brand font-bold">{t('modal.bestPrice')}</p>}
                 </div>
                 <a 
                    href={record.affiliateLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-brand text-primary font-bold px-4 py-2 rounded-lg hover:bg-sky-400 transition-colors duration-300 text-sm whitespace-nowrap"
                  >
                    {t('modal.goToStore')}
                 </a>
              </div>
            </li>
          ))}
        </ul>
      </div>

       <style>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }
          @keyframes scale-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-scale-in {
            animation: scale-in 0.3s ease-out forwards;
          }
        `}</style>
    </div>
  );
};
