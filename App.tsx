import React, { useState, useRef, useEffect } from 'react';
import { initialProducts, initialCoupons, initialSiteSettings, potentialNewDeals } from './constants';
import { useAuth } from './context/AuthContext';
import { useLocalization } from './hooks/useLocalization';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { LoginPage } from './pages/LoginPage';
import { AdminPanel } from './components/admin/AdminPanel';
import { InfoModal } from './components/InfoModal';
import { BlogPostModal } from './components/BlogPostModal';
import { InstallPWAButton } from './components/InstallPWAButton';
import type { Product, Coupon, SiteSettings, BlogPost } from './types';

// FIX: Removed 'about' and 'privacy' from View as they are handled by a modal, not as a separate page view. This resolves a type mismatch when passing the `view` prop to HomePage.
type View = 'home' | 'deals' | 'wishlist' | 'login' | 'admin';

const getStoredData = (key: string, fallback: any) => {
  try {
    const stored = localStorage.getItem(key);
    return stored && stored !== 'undefined' ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error(`Error reading localStorage key “${key}”:`, error);
    return fallback;
  }
};

const App: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useLocalization();
  const [allProducts, setAllProducts] = useState<Product[]>(() => getStoredData('allProducts', initialProducts));
  const [allCoupons, setAllCoupons] = useState<Coupon[]>(() => getStoredData('allCoupons', initialCoupons));
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => getStoredData('siteSettings', initialSiteSettings));
  const [view, setView] = useState<View>('home');
  const [wishlist, setWishlist] = useState<number[]>(() => getStoredData('wishlist', []));
  const categoriesRef = useRef<HTMLElement>(null);
  const blogRef = useRef<HTMLElement>(null);
  const [infoModalView, setInfoModalView] = useState<'about' | 'privacy' | null>(null);
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const autoAddIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('allProducts', JSON.stringify(allProducts));
  }, [allProducts]);

  useEffect(() => {
    localStorage.setItem('allCoupons', JSON.stringify(allCoupons));
  }, [allCoupons]);

  useEffect(() => {
    localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (siteSettings.enableAutoAdd) {
        autoAddIntervalRef.current = window.setInterval(() => {
            if (potentialNewDeals.length > 0) {
                const randomDeal = potentialNewDeals[Math.floor(Math.random() * potentialNewDeals.length)];
                const newProduct = { ...randomDeal, id: Date.now() };
                setAllProducts(prevProducts => {
                    if (prevProducts.some(p => p.name === newProduct.name)) {
                        return prevProducts; 
                    }
                    return [...prevProducts, newProduct];
                });
            }
        }, 30000); 
    } else {
        if (autoAddIntervalRef.current) {
            clearInterval(autoAddIntervalRef.current);
            autoAddIntervalRef.current = null;
        }
    }
    return () => {
        if (autoAddIntervalRef.current) {
            clearInterval(autoAddIntervalRef.current);
            autoAddIntervalRef.current = null;
        }
    };
  }, [siteSettings.enableAutoAdd]);

  useEffect(() => {
    document.getElementById('adsense-script')?.remove();
    document.getElementById('facebook-pixel-script-1')?.remove();
    document.getElementById('facebook-pixel-script-2')?.remove();
    if (siteSettings.showAds && siteSettings.googleAdSenseId && siteSettings.googleAdSenseId !== 'ca-pub-XXXXXXXXXXXXXXXX') {
      const script = document.createElement('script');
      script.id = 'adsense-script';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteSettings.googleAdSenseId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
    if (siteSettings.showAds && siteSettings.facebookPixelId && siteSettings.facebookPixelId !== 'XXXXXXXXXXXXXXXX') {
      const script1 = document.createElement('script');
      script1.id = 'facebook-pixel-script-1';
      script1.innerHTML = `!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${siteSettings.facebookPixelId}');
      fbq('track', 'PageView');`;
      document.head.appendChild(script1);
      const noscript = document.createElement('noscript');
      noscript.id = 'facebook-pixel-script-2';
      noscript.innerHTML = `<img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=${siteSettings.facebookPixelId}&ev=PageView&noscript=1"
      />`;
      document.head.appendChild(noscript);
    }
  }, [siteSettings.showAds, siteSettings.googleAdSenseId, siteSettings.facebookPixelId]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPromptEvent) {
      return;
    }
    installPromptEvent.prompt();
    installPromptEvent.userChoice.then((choiceResult: { outcome: 'accepted' | 'dismissed' }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      setInstallPromptEvent(null);
    });
  };

  const handleSaveProduct = (productToSave: Product | Partial<Product>) => {
    setAllProducts(prev => {
      const exists = 'id' in productToSave && prev.some(p => p.id === productToSave.id);
      if (exists) {
        return prev.map(p => p.id === productToSave.id ? (productToSave as Product) : p);
      }
      const newProduct = { ...productToSave, id: Date.now() } as Product;
      return [...prev, newProduct];
    });
  };

  const handleDeleteProduct = (productId: number) => {
    setAllProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleSaveCoupon = (couponToSave: Coupon) => {
    setAllCoupons(prev => {
      const exists = prev.some(c => c.id === couponToSave.id);
      if (exists) {
        return prev.map(c => c.id === couponToSave.id ? couponToSave : c);
      }
      const newCoupon = { ...couponToSave, id: Date.now() };
      return [...prev, newCoupon];
    });
  };

  const handleDeleteCoupon = (couponId: number) => {
    setAllCoupons(prev => prev.filter(c => c.id !== couponId));
  };

  const handleSaveSiteSettings = (settings: SiteSettings) => {
    setSiteSettings(settings);
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleNavigate = (newView: View | 'about' | 'privacy') => {
    if (newView === 'admin' && !currentUser) {
      setView('login');
      window.scrollTo(0, 0);
    } else if (newView === 'about' || newView === 'privacy') {
        setInfoModalView(newView);
    } else {
      setView(newView);
      setInfoModalView(null);
      window.scrollTo(0, 0);
    }
  };

  const handleGoToCategories = () => {
    if (view !== 'home') {
      setView('home');
      setTimeout(() => {
        categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGoToBlog = () => {
    if (view !== 'home') {
      setView('home');
      setTimeout(() => {
        blogRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      blogRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderContent = () => {
    if (view === 'login') {
      return <LoginPage onLoginSuccess={() => setView('admin')} />;
    }

    if (view === 'admin' && currentUser) {
      return <AdminPanel
        products={allProducts}
        coupons={allCoupons}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onSaveCoupon={handleSaveCoupon}
        onDeleteCoupon={handleDeleteCoupon}
        siteSettings={siteSettings}
        onSaveSiteSettings={handleSaveSiteSettings}
        onLogout={() => setView('home')}
      />;
    }

    return <HomePage
      view={view}
      products={allProducts}
      coupons={allCoupons}
      wishlist={wishlist}
      toggleWishlist={toggleWishlist}
      setView={setView}
      categoriesRef={categoriesRef}
      blogRef={blogRef}
      siteSettings={siteSettings}
      onViewPost={setViewingPost}
    />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <Header
        wishlistCount={wishlist.length}
        onNavigate={handleNavigate}
        onGoToCategories={handleGoToCategories}
        onGoToBlog={handleGoToBlog}
        siteSettings={siteSettings}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <Footer onNavigate={handleNavigate} siteSettings={siteSettings} />
      
      {infoModalView && <InfoModal
        title={t(`footer.${infoModalView}`)}
        content={infoModalView === 'about' ? siteSettings.aboutUs : siteSettings.privacyPolicy}
        onClose={() => setInfoModalView(null)}
      />}

      {viewingPost && <BlogPostModal
        post={viewingPost}
        onClose={() => setViewingPost(null)}
      />}
      
      {installPromptEvent && <InstallPWAButton onInstall={handleInstallClick} />}
    </div>
  );
};

export default App;
