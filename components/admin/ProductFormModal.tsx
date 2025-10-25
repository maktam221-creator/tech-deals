import React, { useState, useEffect } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { CloseIcon } from '../icons/CloseIcon';
import { categories } from '../../constants';
import type { Product } from '../../types';

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  description: '',
  category: categories[0]?.key || '',
  price: 0,
  originalPrice: undefined,
  imageUrl: '',
  rating: 0,
  reviewCount: 0,
  store: '',
  affiliateLink: '',
  priceComparison: []
};

interface ProductFormModalProps {
    product?: Product | Partial<Product>;
    onSave: (product: Product | Partial<Product>) => void;
    onClose: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onSave, onClose }) => {
  const { t } = useLocalization();
  const [formData, setFormData] = useState<Product | Partial<Product>>(product || emptyProduct);

  useEffect(() => {
    setFormData(product || emptyProduct);
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | undefined = value;
    if (type === 'number') {
      processedValue = value === '' ? undefined : parseFloat(value);
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const title = 'id' in formData && formData.id ? t('admin.productForm.editProductTitle') : t('admin.productForm.addProductTitle');
  
  const imageUrlInputProps = {
    type: "url",
    name: "imageUrl",
    id: "imageUrl",
    value: formData.imageUrl || '',
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
        className="bg-secondary rounded-2xl p-6 md:p-8 w-full max-w-2xl mx-auto shadow-2xl border border-accent/30 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-light hover:text-white p-1 rounded-full hover:bg-accent transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-light mb-1">{t('admin.productForm.name')}</label>
              <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-light mb-1">{t('admin.productForm.category')}</label>
              <select name="category" id="category" value={formData.category || ''} onChange={handleChange} required className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand">
                {categories.map(cat => <option key={cat.key} value={cat.key}>{t(`categories.${cat.key}`)}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-light mb-1">{t('admin.productForm.price')}</label>
              <input type="number" name="price" id="price" value={formData.price || ''} onChange={handleChange} required className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <div>
              <label htmlFor="originalPrice" className="block text-sm font-medium text-light mb-1">{t('admin.productForm.originalPrice')}</label>
              <input type="number" name="originalPrice" id="originalPrice" value={formData.originalPrice || ''} onChange={handleChange} className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <div>
              <label htmlFor="store" className="block text-sm font-medium text-light mb-1">{t('admin.productForm.store')}</label>
              <input type="text" name="store" id="store" value={formData.store || ''} onChange={handleChange} required className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <div>
              <label htmlFor="affiliateLink" className="block text-sm font-medium text-light mb-1">{t('admin.productForm.affiliateLink')}</label>
              <input type="url" name="affiliateLink" id="affiliateLink" value={formData.affiliateLink || ''} onChange={handleChange} required className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-light mb-1">{t('admin.productForm.imageUrl')}</label>
              <input {...imageUrlInputProps} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-light mb-1">{t('admin.productForm.description')}</label>
              <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} required rows={3} className="w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-accent text-highlight font-bold py-2 px-6 rounded-lg hover:bg-light hover:text-primary transition-colors">{t('admin.productForm.cancel')}</button>
            <button type="submit" className="bg-brand text-primary font-bold py-2 px-6 rounded-lg hover:bg-sky-400 transition-colors">{t('admin.productForm.save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
