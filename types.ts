export interface PriceRecord {
    store: string;
    price: number;
    affiliateLink: string;
}

export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    rating: number;
    reviewCount: number;
    description: string;
    store: string;
    affiliateLink: string;
    priceComparison?: PriceRecord[];
}

export interface Coupon {
    id: number;
    store: string;
    storeLogoUrl: string;
    code: string;
    description: string;
    expiryDate: string;
}

export interface BlogPost {
    id: number;
    title: string;
    author: string;
    date: string;
    imageUrl: string;
    content: string;
}

export interface User {
    id: number;
    username: string;
    role: 'ADMIN' | 'EDITOR';
}

export interface UserWithPassword extends User {
    password?: string;
}


export interface SiteSettings {
    aboutUs: string;
    privacyPolicy: string;
    copyrightYear: number;
    googleAdSenseId: string;
    facebookPixelId: string;
    affiliateCommissionRate: number;
    blogPosts: BlogPost[];
    showBlogSection: boolean;
    showCouponsSection: boolean;
    showAds: boolean;
    enableAutoAdd: boolean;
}
