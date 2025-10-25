import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { formatCurrency } from '../utils/currency';
import { StarIcon } from './icons/StarIcon';
import { HeartIcon } from './icons/HeartIcon';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onToggleWishlist: (productId: number) => void;
    isInWishlist: boolean;
    onComparePrices: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onToggleWishlist, isInWishlist, onComparePrices }) => {
  const { t, currency, language, convertPrice } = useLocalization();
  
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
    
  const displayPrice = convertPrice(product.price);
  const displayOriginalPrice = product.originalPrice ? convertPrice(product.originalPrice) : undefined;
  
  const productName = product.name || t(`products.${product.id}.name`);

  return (
    <div className="bg-secondary rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full">
      <div className="relative">
        <img className="w-full h-56 object-cover" src={product.imageUrl} alt={productName} />
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
            -{discount}%
          </div>
        )}
        <button 
          onClick={() => onToggleWishlist(product.id)}
          className="absolute top-3 right-3 bg-black/30 p-2 rounded-full backdrop-blur-sm"
          aria-label={isInWishlist ? t('productCard.removeFromWishlist') : t('productCard.addToWishlist')}
        >
          <HeartIcon className={`w-6 h-6 transition-colors ${isInWishlist ? 'text-red-500 fill-current' : 'text-white'}`} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <p className="text-sm text-brand font-semibold">{t(`categories.${product.category}`)}</p>
        <h3 className="font-bold text-lg text-white mt-1 mb-2 flex-grow">{productName}</h3>
        
        <div className="flex items-center text-light text-sm mb-4">
          <StarIcon className="w-5 h-5 text-yellow-400" />
          <span className="mx-1 text-white font-bold">{product.rating}</span>
          <span className="mx-2">({product.reviewCount} {t('productCard.reviews')})</span>
        </div>
        
        <div className="flex items-baseline justify-between mb-4">
          <div className="text-2xl font-black text-white" lang="en" dir="ltr">
            {formatCurrency(displayPrice, currency.code, language.code)}
          </div>
          {displayOriginalPrice && (
            <div className="text-md text-light line-through" lang="en" dir="ltr">
              {formatCurrency(displayOriginalPrice, currency.code, language.code)}
            </div>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-accent/20">
            {product.priceComparison && product.priceComparison.length > 1 && (
                 <button
                 onClick={() => onComparePrices(product)}
                 className="w-full text-center bg-accent text-highlight font-bold py-3 rounded-lg hover:bg-light hover:text-primary transition-colors duration-300"
               >
                 {t('productCard.comparePrices')}
               </button>
            )}
            <a 
            href={product.affiliateLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full text-center bg-brand text-primary font-bold py-3 rounded-lg hover:bg-sky-400 transition-colors duration-300"
            >
            {t('productCard.viewDeal', { store: t(`stores.${product.store}`) })}
            </a>
        </div>
      </div>
    </div>
  );
};
