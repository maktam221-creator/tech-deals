import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import type { Coupon } from '../types';

interface CouponCardProps {
    coupon: Coupon;
}

export const CouponCard: React.FC<CouponCardProps> = ({ coupon }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useLocalization();

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-secondary p-6 rounded-xl shadow-lg flex flex-col sm:flex-row items-center gap-6 text-center sm:text-start">
      <img src={coupon.storeLogoUrl} alt={`${coupon.store} logo`} className="w-20 h-20 rounded-full object-cover border-4 border-accent" />
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-white">{t(`coupons.${coupon.id}.description`)}</h3>
        <p className="text-light mb-2">{t('coupons.expiresOn', { date: coupon.expiryDate })}</p>
        <div className="flex justify-center sm:justify-start items-center gap-2 mt-4">
          <span className="border-2 border-dashed border-accent text-brand font-mono text-lg py-2 px-4 rounded-md">
            {coupon.code}
          </span>
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-md font-bold transition-colors ${
              copied ? 'bg-green-500 text-white' : 'bg-brand text-primary hover:bg-sky-400'
            }`}
          >
            {copied ? t('coupons.copied') : t('coupons.copyCode')}
          </button>
        </div>
      </div>
    </div>
  );
};
