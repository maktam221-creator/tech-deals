import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { ProductCard } from './ProductCard';
import { AIGuideGenerator } from './AIGuideGenerator';
import { CouponCard } from './CouponCard';
import { BlogCard } from './BlogCard';
import { PriceComparisonModal } from './PriceComparisonModal';
import { SearchIcon } from './icons/SearchIcon';
import { categories } from '../constants';
import type { Product, Coupon, SiteSettings, BlogPost } from '../types';

interface HomePageProps {
    view: 'home' | 'deals' | 'wishlist';
    products: Product[];
    coupons: Coupon[];
    wishlist: number[];
    toggleWishlist: (productId: number) => void;
    setView: (view: 'home' | 'deals' | 'wishlist') => void;
    categoriesRef: React.RefObject<HTMLElement>;
    blogRef: React.RefObject<HTMLElement>;
    siteSettings: SiteSettings;
    onViewPost: (post: BlogPost) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  view,
  products,
  coupons,
  wishlist,
  toggleWishlist,
  setView,
  categoriesRef,
  blogRef,
  siteSettings,
  onViewPost,
}) => {
  const { t, language } = useLocalization();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    let sourceProducts: Product[];
    if (view === 'deals') {
      sourceProducts = products
        .filter(p => p.originalPrice && p.originalPrice > p.price)
        .sort((a, b) => {
            const discountA = ((a.originalPrice! - a.price) / a.originalPrice!);
            const discountB = ((b.originalPrice! - b.price) / b.originalPrice!);
            return discountB - discountA;
        });
    } else if (view === 'wishlist') {
      sourceProducts = products.filter(p => wishlist.includes(p.id));
    } else { // home
      sourceProducts = products;
    }

    let results = sourceProducts;
    if (activeCategory !== 'all') {
      results = results.filter(p => p.category === activeCategory);
    }
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
       results = results.filter((product) => {
        const productName = (product.name || t(`products.${product.id}.name`)).toLowerCase();
        const productDescription = (product.description || t(`products.${product.id}.description`)).toLowerCase();
        return productName.includes(lowercasedTerm) || productDescription.includes(lowercasedTerm);
       });
    }
    setFilteredProducts(results);
  }, [searchTerm, activeCategory, view, wishlist, t, language, products]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleCategorySelect = (categoryKey: string) => {
    setActiveCategory(categoryKey);
    if(view === 'wishlist' || view === 'deals') {
        setView('home');
    }
  };

  const getPageTitle = () => {
      if (view === 'wishlist') return t('pageTitles.wishlist');
      if (view === 'deals') return t('pageTitles.deals');
      return activeCategory === 'all' ? t('pageTitles.featuredProducts') : t(`categories.${activeCategory}`);
  }

  return (
    <>
      {view === 'home' && (
          <>
          <section className="text-center bg-secondary p-8 md:p-12 rounded-2xl mb-12 shadow-lg">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 animate-fade-in-down" style={{animation: 'fade-in-down 0.5s ease-out forwards'}}>
                {t('hero.title')}
              </h1>
              <p className="text-lg md:text-xl text-light max-w-3xl mx-auto mb-8 animate-fade-in-up" style={{animation: 'fade-in-up 0.5s ease-out 0.2s forwards', opacity: 0}}>
                {t('hero.subtitle')}
              </p>
              <div className="relative max-w-2xl mx-auto">
                <input
                    type="text"
                    placeholder={t('hero.searchPlaceholder')}
                    className={`w-full py-4 ${language.dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} bg-accent text-highlight rounded-full focus:outline-none focus:ring-4 focus:ring-brand/50 transition-all duration-300 shadow-inner`}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <div className={`absolute top-1/2 ${language.dir === 'rtl' ? 'right-4' : 'left-4'} -translate-y-1/2 text-light`}>
                    <SearchIcon />
                </div>
              </div>
          </section>

          <section ref={categoriesRef} className="mb-8">
            <h2 className={`text-3xl font-bold text-white mb-6 border-brand ${language.dir === 'rtl' ? 'border-r-4 pr-4' : 'border-l-4 pl-4'}`}>
                {t('categories.title')}
            </h2>
            <div className="flex flex-wrap gap-4">
              <button
                  onClick={() => handleCategorySelect('all')}
                  className={`px-6 py-2 rounded-full transition-colors duration-300 font-semibold shadow-md ${
                      activeCategory === 'all' 
                      ? 'bg-brand text-primary' 
                      : 'bg-accent text-highlight hover:bg-light hover:text-primary'
                  }`}
              >
                  {t('categories.all')}
              </button>
              {categories.map((category) => (
              <button
                  key={category.key}
                  onClick={() => handleCategorySelect(category.key)}
                  className={`px-6 py-2 rounded-full transition-colors duration-300 font-semibold shadow-md ${
                      activeCategory === category.key 
                      ? 'bg-brand text-primary' 
                      : 'bg-accent text-highlight hover:bg-light hover:text-primary'
                  }`}
              >
                  {t(`categories.${category.key}`)}
              </button>
              ))}
            </div>
          </section>
          </>
      )}
      
      <section className="mb-12">
        <h2 className={`text-3xl font-bold text-white mb-6 border-brand ${language.dir === 'rtl' ? 'border-r-4 pr-4' : 'border-l-4 pl-4'}`}>
            {getPageTitle()}
        </h2>
        {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    onToggleWishlist={toggleWishlist}
                    isInWishlist={wishlist.includes(product.id)}
                    onComparePrices={setSelectedProduct}
                />
                ))}
            </div>
        ) : (
            <div className="text-center py-16 bg-secondary rounded-xl">
                <p className="text-2xl text-light">
                  {t('products.noResults')}
                </p>
                <p className="text-light mt-2">
                    {t('products.noResultsSubtitle')}
                </p>
            </div>
        )}
      </section>

      {view === 'home' && (
          <>
              <AIGuideGenerator />
              {siteSettings.showBlogSection && (
                <section ref={blogRef} className="my-12">
                    <h2 className={`text-3xl font-bold text-white mb-6 border-brand ${language.dir === 'rtl' ? 'border-r-4 pr-4' : 'border-l-4 pl-4'}`}>
                        {t('blog.title')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {siteSettings.blogPosts.map((post) => (
                            <BlogCard key={post.id} post={post} onReadMore={onViewPost} />
                        ))}
                    </div>
                </section>
              )}
              {siteSettings.showCouponsSection && (
                <section className="mb-12">
                    <h2 className={`text-3xl font-bold text-white mb-6 border-brand ${language.dir === 'rtl' ? 'border-r-4 pr-4' : 'border-l-4 pl-4'}`}>
                        {t('coupons.title')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coupons.map((coupon) => (
                          <CouponCard key={coupon.id} coupon={coupon} />
                        ))}
                    </div>
                </section>
              )}
          </>
      )}
      
      {selectedProduct && (
        <PriceComparisonModal 
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
        />
      )}

      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};
