import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { formatCurrency } from '../../utils/currency';
import type { Product, SiteSettings } from '../../types';

interface EarningsDashboardProps {
    products: Product[];
    settings: SiteSettings;
}

export const EarningsDashboard: React.FC<EarningsDashboardProps> = ({ products, settings }) => {
    const { t, language, currency, convertPrice } = useLocalization();

    const totalProductValueSAR = products.reduce((sum, product) => sum + product.price, 0);
    const commissionRate = settings.affiliateCommissionRate || 0;
    const estimatedCommissionSAR = totalProductValueSAR * (commissionRate / 100);

    const displayTotalValue = convertPrice(totalProductValueSAR);
    const displayEstimatedCommission = convertPrice(estimatedCommissionSAR);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-accent p-6 rounded-lg">
                <h3 className="text-light font-semibold mb-2">{t('admin.totalValue')}</h3>
                <p className="text-3xl font-black text-white" lang="en" dir="ltr">
                    {formatCurrency(displayTotalValue, currency.code, language.code)}
                </p>
            </div>
            <div className="bg-accent p-6 rounded-lg">
                <h3 className="text-light font-semibold mb-2">{`${t('admin.estimatedEarnings')} (${commissionRate}%)`}</h3>
                <p className="text-3xl font-black text-white" lang="en" dir="ltr">
                    {formatCurrency(displayEstimatedCommission, currency.code, language.code)}
                </p>
            </div>
        </div>
    );
};
