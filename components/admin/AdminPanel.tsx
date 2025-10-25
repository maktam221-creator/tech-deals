import React, { useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { useAuth } from '../../context/AuthContext';
import { UserManagement } from './UserManagement';
import { SiteSettings as SiteSettingsComponent } from './SiteSettings';
import { CollapsibleSection } from './CollapsibleSection';
import { MonetizationSettings } from './MonetizationSettings';
import { EarningsDashboard } from './EarningsDashboard';
import { ProductFormModal } from './ProductFormModal';
import { CouponFormModal } from './CouponFormModal';
import { BlogFormModal } from './BlogFormModal';
import { AddProductByUrlModal } from './AddProductByUrlModal';
import { formatCurrency } from '../../utils/currency';
import { generateProductFromUrl } from '../../services/geminiService';
import type { Product, Coupon, SiteSettings, BlogPost } from '../../types';

interface AdminPanelProps {
    products: Product[];
    coupons: Coupon[];
    siteSettings: SiteSettings;
    onSaveProduct: (product: Product | Partial<Product>) => void;
    onDeleteProduct: (productId: number) => void;
    onSaveCoupon: (coupon: Coupon) => void;
    onDeleteCoupon: (couponId: number) => void;
    onSaveSiteSettings: (settings: SiteSettings) => void;
    onLogout: () => void; 
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
    products, coupons, siteSettings, 
    onSaveProduct, onDeleteProduct, onSaveCoupon, onDeleteCoupon, onSaveSiteSettings,
    onLogout 
}) => {
  const { t, language } = useLocalization();
  const { currentUser, logout } = useAuth();
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | Partial<Product> | undefined>(undefined);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | undefined>(undefined);
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>(undefined);
  const [openAdminSection, setOpenAdminSection] = useState<string | null>(null);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');

  const toggleAdminSection = (sectionName: string) => {
    setOpenAdminSection(prev => (prev === sectionName ? null : sectionName));
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handleAddNewProduct = () => {
    setEditingProduct(undefined);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };
  
  const handleProductModalClose = () => {
    setIsProductModalOpen(false);
    setEditingProduct(undefined);
  };

  const handleProductSave = (product: Product | Partial<Product>) => {
    onSaveProduct(product);
    handleProductModalClose();
  };

  const handleAddNewCoupon = () => {
    setEditingCoupon(undefined);
    setIsCouponModalOpen(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsCouponModalOpen(true);
  };

  const handleCouponModalClose = () => {
    setIsCouponModalOpen(false);
    setEditingCoupon(undefined);
  };
  
  const handleCouponSave = (coupon: Coupon) => {
    onSaveCoupon(coupon);
    handleCouponModalClose();
  };

  const handleAddNewPost = () => {
    setEditingPost(undefined);
    setIsBlogModalOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsBlogModalOpen(true);
  };

  const handleBlogModalClose = () => {
    setIsBlogModalOpen(false);
    setEditingPost(undefined);
  };

  const handleBlogSave = (postToSave: BlogPost) => {
    const currentPosts = siteSettings.blogPosts || [];
    let updatedPosts: BlogPost[];
    if ('id' in postToSave && currentPosts.some(p => p.id === postToSave.id)) {
      updatedPosts = currentPosts.map(p => p.id === postToSave.id ? postToSave : p);
    } else {
      const newPost = { ...postToSave, id: Date.now() };
      updatedPosts = [...currentPosts, newPost];
    }
    onSaveSiteSettings({ ...siteSettings, blogPosts: updatedPosts });
    handleBlogModalClose();
  };

  const handleDeletePost = (postId: number) => {
    const updatedPosts = siteSettings.blogPosts.filter(p => p.id !== postId);
    onSaveSiteSettings({ ...siteSettings, blogPosts: updatedPosts });
  };
  
  const handleGenerateFromUrl = async (url: string) => {
    setIsGenerating(true);
    setGenerationError('');
    try {
        const productData = await generateProductFromUrl(url, language.code);
        setEditingProduct(productData);
        setIsUrlModalOpen(false);
        setIsProductModalOpen(true);
    } catch (error) {
        console.error(error);
        setGenerationError(t('admin.productUrlModal.error'));
    } finally {
        setIsGenerating(false);
    }
  };

  const handleAutomationToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    onSaveSiteSettings({ ...siteSettings, enableAutoAdd: checked });
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">{t('admin.panelTitle')}</h1>
        <button onClick={handleLogout} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
          {t('admin.logout')}
        </button>
      </div>

      {currentUser?.role === 'ADMIN' && (
        <div className="space-y-6">
          <CollapsibleSection
            title={t('admin.manageUsers')}
            isOpen={openAdminSection === 'users'}
            onToggle={() => toggleAdminSection('users')}
          >
              <UserManagement />
          </CollapsibleSection>
          
          <CollapsibleSection
            title={t('admin.manageSite')}
            description={t('admin.manageSiteDesc')}
            isOpen={openAdminSection === 'site'}
            onToggle={() => toggleAdminSection('site')}
          >
              <SiteSettingsComponent settings={siteSettings} onSave={onSaveSiteSettings} />
          </CollapsibleSection>
          
          <CollapsibleSection
              title={t('admin.automationSettings')}
              description={t('admin.automationSettingsDesc')}
              isOpen={openAdminSection === 'automation'}
              onToggle={() => toggleAdminSection('automation')}
            > 
            <div className="bg-primary p-4 rounded-xl shadow-inner space-y-4">
                <label htmlFor="enableAutoAdd" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            type="checkbox"
                            id="enableAutoAdd"
                            className="sr-only"
                            checked={siteSettings.enableAutoAdd || false}
                            onChange={handleAutomationToggle}
                        />
                        <div className="block bg-accent w-14 h-8 rounded-full"></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${siteSettings.enableAutoAdd ? 'translate-x-6 bg-brand' : ''}`}></div>
                    </div>
                    <div className="mx-3 text-highlight">
                        <p className="font-bold">{t('admin.enableAutoAdd')}</p>
                        <p className="text-sm text-light">{t('admin.enableAutoAddDesc')}</p>
                    </div>
                </label>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title={t('admin.earningsDashboard')}
            description={t('admin.earningsDesc')}
            isOpen={openAdminSection === 'earnings'}
            onToggle={() => toggleAdminSection('earnings')}
          >
            <EarningsDashboard products={products} settings={siteSettings} />
          </CollapsibleSection>
          
          <CollapsibleSection
            title={t('admin.monetization')}
            description={t('admin.monetizationDesc')}
            isOpen={openAdminSection === 'monetization'}
            onToggle={() => toggleAdminSection('monetization')}
          >
            <MonetizationSettings settings={siteSettings} onSave={onSaveSiteSettings} />
          </CollapsibleSection>
        </div>
      )}

      {/* Blog Management */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-3xl font-bold text-white border-brand ${language.dir === 'rtl' ? 'border-r-4 pr-4' : 'border-l-4 pl-4'}`}>
            {t('admin.manageBlog')}
          </h2>
          <button onClick={handleAddNewPost} className="bg-brand text-primary font-bold py-2 px-4 rounded-lg hover:bg-sky-400 transition-colors">
            {t('admin.addNewPost')}
          </button>
        </div>
        <div className="bg-secondary p-4 rounded-xl shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-light">
              <thead className="text-xs text-highlight uppercase bg-accent">
                <tr>
                  <th scope="col" className="px-6 py-3">{t('admin.postTitle')}</th>
                  <th scope="col" className="px-6 py-3">{t('admin.author')}</th>
                  <th scope="col" className="px-6 py-3">{t('admin.date')}</th>
                  <th scope="col" className="px-6 py-3">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {siteSettings.blogPosts.map(post => (
                  <tr key={post.id} className="border-b border-accent">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{t(`blog.${post.id}.title`, {})}</td>
                    <td className="px-6 py-4">{post.author}</td>
                    <td className="px-6 py-4">{post.date}</td>
                    <td className="px-6 py-4 flex gap-4">
                      <button onClick={() => handleEditPost(post)} className="font-medium text-brand hover:underline">{t('admin.edit')}</button>
                      <button onClick={() => handleDeletePost(post.id)} className="font-medium text-red-500 hover:underline">{t('admin.delete')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Product Management */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`text-3xl font-bold text-white border-brand ${language.dir === 'rtl' ? 'border-r-4 pr-4' : 'border-l-4 pl-4'}`}>
              {t('admin.manageProducts')}
            </h2>
             <span className="text-sm text-light mt-1 block">{t('admin.productCount', { count: products.length })}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setGenerationError(''); setIsUrlModalOpen(true); }} className="bg-accent text-highlight font-bold py-2 px-4 rounded-lg hover:bg-light hover:text-primary transition-colors">
                {t('admin.addProductByUrl')}
            </button>
            <button onClick={handleAddNewProduct} className="bg-brand text-primary font-bold py-2 px-4 rounded-lg hover:bg-sky-400 transition-colors">
              {t('admin.addNewProduct')}
            </button>
          </div>
        </div>
        <div className="bg-secondary p-4 rounded-xl shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-light">
              <thead className="text-xs text-highlight uppercase bg-accent">
                <tr>
                  <th scope="col" className="px-6 py-3">{t('admin.productName')}</th>
                  <th scope="col" className="px-6 py-3">{t('admin.category')}</th>
                  <th scope="col" className="px-6 py-3">{t('admin.price')}</th>
                  <th scope="col" className="px-6 py-3">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-accent">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{product.name || t(`products.${product.id}.name`, {})}</td>
                    <td className="px-6 py-4">{t(`categories.${product.category}`)}</td>
                    <td className="px-6 py-4">{formatCurrency(product.price, 'SAR', language.code)}</td>
                    <td className="px-6 py-4 flex gap-4">
                      <button onClick={() => handleEditProduct(product)} className="font-medium text-brand hover:underline">{t('admin.edit')}</button>
                      <button onClick={() => onDeleteProduct(product.id)} className="font-medium text-red-500 hover:underline">{t('admin.delete')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Coupon Management */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-3xl font-bold text-white border-brand ${language.dir === 'rtl' ? 'border-r-4 pr-4' : 'border-l-4 pl-4'}`}>
            {t('admin.manageCoupons')}
          </h2>
          <button onClick={handleAddNewCoupon} className="bg-brand text-primary font-bold py-2 px-4 rounded-lg hover:bg-sky-400 transition-colors">
            {t('admin.addNewCoupon')}
          </button>
        </div>
        <div className="bg-secondary p-4 rounded-xl shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-light">
              <thead className="text-xs text-highlight uppercase bg-accent">
                <tr>
                  <th scope="col" className="px-6 py-3">{t('admin.store')}</th>
                  <th scope="col" className="px-6 py-3">{t('admin.code')}</th>
                  <th scope="col" className="px-6 py-3">{t('admin.description')}</th>
                  <th scope="col" className="px-6 py-3">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(coupon => (
                  <tr key={coupon.id} className="border-b border-accent">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{t(`stores.${coupon.store}`)}</td>
                    <td className="px-6 py-4 font-mono text-brand">{coupon.code}</td>
                    <td className="px-6 py-4">{t(`coupons.${coupon.id}.description`)}</td>
                    <td className="px-6 py-4 flex gap-4">
                      <button onClick={() => handleEditCoupon(coupon)} className="font-medium text-brand hover:underline">{t('admin.edit')}</button>
                      <button onClick={() => onDeleteCoupon(coupon.id)} className="font-medium text-red-500 hover:underline">{t('admin.delete')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      {isProductModalOpen && <ProductFormModal
        product={editingProduct}
        onSave={handleProductSave}
        onClose={handleProductModalClose}
      />}

      {isCouponModalOpen && <CouponFormModal
        coupon={editingCoupon}
        onSave={handleCouponSave}
        onClose={handleCouponModalClose}
      />}

      {isBlogModalOpen && <BlogFormModal
        post={editingPost}
        onSave={handleBlogSave}
        onClose={handleBlogModalClose}
      />}

       <AddProductByUrlModal
        isOpen={isUrlModalOpen}
        isLoading={isGenerating}
        error={generationError}
        onGenerate={handleGenerateFromUrl}
        onClose={() => setIsUrlModalOpen(false)}
      />
    </div>
  );
};
