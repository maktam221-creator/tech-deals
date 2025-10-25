export const formatCurrency = (
    price: number, 
    targetCurrency: string,
    locale: string
) => {
    // Use a specific locale for Arabic to ensure correct formatting
    const displayLocale = locale === 'ar' ? 'ar-SA' : 'en-US';

    try {
        return new Intl.NumberFormat(displayLocale, {
            style: 'currency',
            currency: targetCurrency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price);
    } catch (error) {
        console.warn("Currency formatting error:", error);
        // Fallback for unsupported currencies/locales in some environments
        return `${targetCurrency} ${price.toFixed(2)}`;
    }
};
