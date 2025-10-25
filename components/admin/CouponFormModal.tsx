import React, { useState, useEffect } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { CloseIcon } from '../icons/CloseIcon';
import type { Coupon } from '../../types';

const emptyCoupon: Omit<Coupon, 'id'> = {
  store: '',
  storeLogoUrl: '',
  code: '',
  description: '',
  expiryDate: '',
};

interface CouponFormModalProps {
    coupon?: Coupon;
    onSave: (coupon: Coupon) => void;
    onClose: () => void;
}

export const CouponFormModal: React.FC<CouponFormModalProps> = ({ coupon, onSave, onClose }) => {
  const { t } = useLocalization();
  const [formData, setFormData] = useState<Coupon | Omit<Coupon, 'id'>>(coupon || emptyCoupon);

  useEffect(() => {
    setFormData(coupon || emptyCoupon);
  }, [coupon]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Coupon);
  };

  const title = 'id' in formData ? t('admin.couponForm.editCouponTitle') : t('admin.couponForm.addCouponTitle');
  
  const expiryDateInputProps = {
    type: "date",
    name: "expiryDate",
    id: "expiryDate",
    value: formData.expiryDate,
    onChange: handleChange,
    required: true,
    className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand"
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
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-light hover:text-white p-1 rounded-full hover:bg-accent transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="store" className="block text-sm font-medium text-light mb-1">{t('admin.couponForm.store')}</label>
            <input type="text" name="store" id="store" value={formData.store} onChange={handleChange} required className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-light mb-1">{t('admin.couponForm.code')}</label>
            <input type="text" name="code" id="code" value={formData.code} onChange={handleChange} required className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-light mb-1">{t('admin.couponForm.description')}</label>
            <input type="text" name="description" id="description" value={formData.description} onChange={handleChange} required className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-light mb-1">{t('admin.couponForm.expiryDate')}</label>
            <input {...expiryDateInputProps} />
          </div>
          <div>
            <label htmlFor="storeLogoUrl" className="block text-sm font-medium text-light mb-1">{t('admin.couponForm.storeLogoUrl')}</label>
            <input type="url" name="storeLogoUrl" id="storeLogoUrl" value={formData.storeLogoUrl} onChange={handleChange} required className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-accent text-highlight font-bold py-2 px-6 rounded-lg hover:bg-light hover:text-primary transition-colors">{t('admin.couponForm.cancel')}</button>
            <button type="submit" className="bg-brand text-primary font-bold py-2 px-6 rounded-lg hover:bg-sky-400 transition-colors">{t('admin.couponForm.save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
