
import React from 'react';
// FIX: Changed import from Deal to Product as Deal type does not exist
// and Product has the necessary data.
import type { Product } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { formatCurrency } from '../utils/currency';

interface DealCardProps {
  // FIX: Changed deal type from Deal to Product
  deal: Product;
}

export const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  // FIX: Added localization to format currency correctly
  const { currency, language, convertPrice } = useLocalization();
  const displayPrice = convertPrice(deal.price);
  const formattedPrice = formatCurrency(displayPrice, currency.code, language.code);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-cyan-400/10 transition-shadow duration-300 p-6 flex flex-col h-full border border-slate-700">
      <div className="flex-grow">
        <span className="inline-block bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
          {/* FIX: Changed from deal.retailer to deal.store */}
          {deal.store}
        </span>
        {/* FIX: Changed from deal.productName to deal.name */}
        <h3 className="text-xl font-bold text-slate-100 mb-2">{deal.name}</h3>
        {/* FIX: Changed from deal.price to formattedPrice to ensure consistent currency display */}
        <p className="text-2xl font-extrabold text-cyan-400 mb-3">{formattedPrice}</p>
        <p className="text-slate-400 text-sm">{deal.description}</p>
      </div>
      <div className="mt-6">
        <a
          // FIX: Changed from deal.url to deal.affiliateLink
          href={deal.affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-block text-center bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-500 transition-colors duration-300"
        >
          View Deal
        </a>
      </div>
    </div>
  );
};
