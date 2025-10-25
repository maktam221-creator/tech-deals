
import React, { useState, useRef, useEffect, createContext, useContext, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// === INLINED DATA AND UTILS ===

const arTranslations = {
  "header": { "brand": "صفقات تك", "home": "الرئيسية", "deals": "أفضل العروض", "categories": "الفئات", "blog": "المدونة", "wishlistAriaLabel": "قائمة الأمنيات", "products": "منتجات" },
  "hero": { "title": "أفضل الصفقات التقنية في مكان واحد", "subtitle": "نحن نبحث لك عن أفضل العروض والكوبونات للمنتجات التقنية لمساعدتك على التوفير.", "searchPlaceholder": "ابحث عن لابتوب, هاتف ذكي, سماعات..." },
  "categories": { "title": "تصفح حسب الفئة", "all": "الكل", "laptops": "لابتوبات", "smartphones": "هواتف ذكية", "headphones": "سماعات", "monitors": "شاشات", "tablets": "أجهزة لوحية", "cameras": "كاميرات", "accessories": "ملحقات" },
  "pageTitles": { "wishlist": "قائمة الأمنيات", "deals": "أفضل العروض", "featuredProducts": "المنتجات المميزة" },
  "products": { "noResults": "لا توجد منتجات تطابق بحثك.", "noResultsSubtitle": "حاول تغيير كلمات البحث أو الفلترة.", "1": { "name": "لابتوب Dell XPS 15", "description": "لابتوب قوي بشاشة OLED مذهلة، مثالي للمصممين والمطورين." }, "2": { "name": "هاتف Samsung Galaxy S23 Ultra", "description": "كاميرا استثنائية وأداء فائق مع قلم S Pen لتجربة لا مثيل لها." }, "3": { "name": "سماعات Sony WH-1000XM5", "description": "أفضل تقنية لعزل الضوضاء في فئتها مع جودة صوت لا تضاهى." }, "4": { "name": "شاشة ألعاب LG UltraGear 27\"", "description": "شاشة 4K بمعدل تحديث 144Hz لتجربة ألعاب سلسة وممتعة." }, "5": { "name": "Apple iPad Air", "description": "تصميم أنيق وأداء قوي مع شريحة M1." }, "6": { "name": "كاميرا Canon EOS R6", "description": "كاميرا احترافية لتصوير الفيديو والصور بجودة عالية." }, "7": { "name": "ماوس لوجيتك MX Master 3S", "description": "أفضل ماوس للإنتاجية بتصميم مريح وميزات متقدمة." }, "8": { "name": "هاتف Google Pixel 8 Pro", "description": "تجربة أندرويد خام مع كاميرا ذكية وميزات حصرية." }, "9": { "name": "ماوس الألعاب Razer Viper Mini", "description": "خفيف الوزن وسريع الاستجابة، مثالي للألعاب التنافسية." }, "10": { "name": "ساعة Apple Watch SE (الجيل الثاني)", "description": "ميزات أساسية لمساعدتك على البقاء متصلاً ونشطاً وبصحة جيدة وآمناً." }, "11": { "name": "لوحة مفاتيح Keychron K2 الميكانيكية اللاسلكية", "description": "لوحة مفاتيح ميكانيكية لاسلكية مدمجة بتصميم 75% مع مفاتيح Gateron لنظامي Mac و Windows." }, "12": { "name": "سماعات Anker Soundcore Life Q30", "description": "سماعات رأس بإلغاء ضوضاء نشط هجين مع أوضاع متعددة وصوت عالي الدقة." } },
  "productCard": { "reviews": "مراجعة", "comparePrices": "مقارنة الأسعار", "viewDeal": "عرض الصفقة من {{store}}", "addToWishlist": "إضافة إلى قائمة الأمنيات", "removeFromWishlist": "إزالة من قائمة الأمنيات" },
  "coupons": { "title": "كوبونات حصرية", "expiresOn": "ينتهي في: {{date}}", "copyCode": "انسخ الكود", "copied": "تم النسخ!", "1": { "description": "خصم 15% على الإلكترونيات" }, "2": { "description": "خصم 10% على اللابتوبات" }, "3": { "description": "خصم 20% على اكسسوارات الجوال" } },
  "aiGuide": { "title": "دليلك الذكي للشراء", "subtitle": "غير متأكد ماذا تشتري؟ اطلب من الذكاء الاصطناعي إنشاء دليل شراء مخصص لك.", "placeholder": "مثال: أفضل لابتوب للمونتاج بسعر أقل من 5000 ريال", "buttonText": "إنشاء الدليل", "loading": "جاري الإنشاء...", "guideTitle": "دليلك المخصص: {{topic}}", "error": { "topicRequired": "الرجاء إدخال موضوع لإنشاء الدليل.", "generationFailed": "حدث خطأ أثناء إنشاء الدليل. الرجاء المحاولة مرة أخرى." } },
  "blog": { "title": "من المدونة", "readMore": "اقرأ المزيد", "publishedOn": "نشر في {{date}} بواسطة {{author}}", "1": { "title": "كيف تختار اللابتوب المثالي لاحتياجاتك؟" }, "2": { "title": "أهم 5 ملحقات يجب أن تقتنيها لهاتفك الذكي" } },
  "modal": { "close": "إغلاق", "bestPrice": "الأفضل سعراً", "goToStore": "اذهب للمتجر" },
  "pwa": { "installButton": "تثبيت التطبيق" },
  "footer": { "brand": "صفقات تك", "copyright": "كل الحقوق محفوظة © {{year}}", "about": "من نحن", "privacy": "سياسة الخصوصية" },
  "stores": { "amazon": "أمازون", "jarir": "جرير", "noon": "نون", "extra": "إكسترا", "shein": "شي إن" },
  "login": { "title": "تسجيل الدخول للوحة التحكم", "username": "اسم المستخدم", "password": "كلمة المرور", "loginButton": "تسجيل الدخول", "error": "اسم المستخدم أو كلمة المرور غير صحيحة." },
  "admin": { "panelTitle": "لوحة التحكم", "logout": "تسجيل الخروج", "manageUsers": "إدارة المستخدمين", "addNewUser": "إضافة مستخدم جديد", "username": "اسم المستخدم", "role": "الصلاحية", "actions": "الإجراءات", "edit": "تعديل", "delete": "حذف", "deleteConfirm": "هل أنت متأكد من أنك تريد حذف هذا المستخدم؟", "manageProducts": "إدارة المنتجات", "addNewProduct": "إضافة منتج جديد", "productName": "اسم المنتج", "category": "الفئة", "price": "السعر (ر.س)", "manageCoupons": "إدارة الكوبونات", "addNewCoupon": "إضافة كوبون جديد", "store": "المتجر", "code": "الكود", "description": "الوصف", "manageBlog": "إدارة المدونة", "addNewPost": "إضافة تدوينة جديدة", "postTitle": "عنوان التدوينة", "author": "الكاتب", "date": "التاريخ", "blogForm": { "addPostTitle": "إضافة تدوينة جديدة", "editPostTitle": "تعديل التدوينة", "title": "العنوان", "author": "الكاتب", "date": "تاريخ النشر", "imageUrl": "رابط الصورة", "content": "المحتوى", "cancel": "إلغاء", "save": "حفظ" }, "userForm": { "addUserTitle": "إضافة مستخدم جديد", "editUserTitle": "تعديل المستخدم", "password": "كلمة المرور", "passwordHint": "اتركه فارغًا لعدم التغيير", "role": "الصلاحية", "cancel": "إلغاء", "save": "حفظ" }, "productForm": { "addProductTitle": "إضافة منتج جديد", "editProductTitle": "تعديل المنتج", "name": "الاسم", "category": "الفئة", "price": "السعر (ر.س)", "originalPrice": "السعر الأصلي (اختياري)", "store": "المتجر", "affiliateLink": "رابط التسويق", "imageUrl": "رابط الصورة", "description": "الوصف", "cancel": "إلغاء", "save": "حفظ" }, "couponForm": { "addCouponTitle": "إضافة كوبون جديد", "editCouponTitle": "تعديل الكوبون", "store": "المتجر", "code": "الكود", "description": "الوصف", "expiryDate": "تاريخ الانتهاء", "storeLogoUrl": "رابط شعار المتجر", "cancel": "إلغاء", "save": "حفظ" }, "roles": { "ADMIN": "مدير", "EDITOR": "محرر" }, "manageSite": "إعدادات الموقع", "manageSiteDesc": "إدارة المحتوى العام للموقع مثل صفحة 'من نحن' و 'سياسة الخصوصية'.", "aboutUs": "من نحن", "privacyPolicy": "سياسة الخصوصية", "copyrightYear": "سنة حقوق النشر", "saveSettings": "حفظ الإعدادات", "settingsSaved": "تم حفظ الإعدادات بنجاح!", "siteVisibility": "إعدادات الظهور", "siteVisibilityDesc": "التحكم في الأقسام التي تظهر في الصفحة الرئيسية.", "showBlogSection": "إظهار قسم المدونة", "showCouponsSection": "إظهار قسم الكوبونات", "monetization": "تحقيق الدخل", "monetizationDesc": "إدارة إعدادات الإعلانات والعمولة.", "adsenseId": "معرف Google AdSense Publisher", "pixelId": "معرف Facebook Pixel", "commissionRate": "نسبة العمولة الافتراضية (%)", "showAds": "إظهار الإعلانات على الموقع", "earningsDashboard": "لوحة الأرباح", "earningsDesc": "نظرة عامة على الأرباح المحتملة من التسويق بالعمولة.", "totalValue": "إجمالي قيمة المنتجات", "estimatedEarnings": "الأرباح التقديرية للعمولة", "productCount": "إجمالي المنتجات: {{count}}", "addProductByUrl": "إضافة عبر الرابط", "productUrlModal": { "title": "إنشاء منتج من رابط", "placeholder": "https://example.com/product-page", "generate": "إنشاء المنتج", "generating": "جاري الإنشاء...", "error": "تعذر استخراج تفاصيل المنتج. يرجى التحقق من الرابط أو تجربة صفحة أخرى." }, "automationSettings": "إعدادات الأتمتة", "automationSettingsDesc": "إدارة الإنشاء والتحديثات التلقائية للمحتوى.", "enableAutoAdd": "تفعيل إضافة المنتجات التلقائي", "enableAutoAddDesc": "عند التفعيل، سيقوم النظام بإضافة صفقات جديدة بشكل دوري." },
  "notifications": { "newProductAdded": "تمت إضافة منتج جديد: {{productName}}" }
};
const enTranslations = {
  "header": { "brand": "Tech Deals", "home": "Home", "deals": "Best Deals", "categories": "Categories", "blog": "Blog", "wishlistAriaLabel": "Wishlist", "products": "products" },
  "hero": { "title": "The Best Tech Deals in One Place", "subtitle": "We find the best deals and coupons for tech products to help you save.", "searchPlaceholder": "Search for a laptop, smartphone, headphones..." },
  "categories": { "title": "Browse by Category", "all": "All", "laptops": "Laptops", "smartphones": "Smartphones", "headphones": "Headphones", "monitors": "Monitors", "tablets": "Tablets", "cameras": "Cameras", "accessories": "Accessories" },
  "pageTitles": { "wishlist": "My Wishlist", "deals": "Best Deals", "featuredProducts": "Featured Products" },
  "products": { "noResults": "No products match your search.", "noResultsSubtitle": "Try changing your search terms or filters.", "1": { "name": "Dell XPS 15 Laptop", "description": "A powerful laptop with a stunning OLED screen, perfect for designers and developers." }, "2": { "name": "Samsung Galaxy S23 Ultra", "description": "Exceptional camera and top-tier performance with the S Pen for an unparalleled experience." }, "3": { "name": "Sony WH-1000XM5 Headphones", "description": "Best-in-class noise-canceling technology with unmatched sound quality." }, "4": { "name": "LG UltraGear 27\" Gaming Monitor", "description": "A 4K monitor with a 144Hz refresh rate for a smooth and enjoyable gaming experience." }, "5": { "name": "Apple iPad Air", "description": "Sleek design and powerful performance with the M1 chip." }, "6": { "name": "Canon EOS R6 Camera", "description": "A professional camera for high-quality video and photography." }, "7": { "name": "Logitech MX Master 3S Mouse", "description": "The best productivity mouse with an ergonomic design and advanced features." }, "8": { "name": "Google Pixel 8 Pro", "description": "A pure Android experience with a smart camera and exclusive features." }, "9": { "name": "Razer Viper Mini Gaming Mouse", "description": "Lightweight and responsive, perfect for competitive gaming." }, "10": { "name": "Apple Watch SE (2nd Gen)", "description": "Essential features to help you stay connected, active, healthy, and safe." }, "11": { "name": "Keychron K2 Wireless Mechanical Keyboard", "description": "A compact 75% layout wireless mechanical keyboard with Gateron switches for Mac and Windows." }, "12": { "name": "Anker Soundcore Life Q30 Headphones", "description": "Hybrid Active Noise Cancelling Headphones with Multiple Modes and Hi-Res Audio." } },
  "productCard": { "reviews": "reviews", "comparePrices": "Compare Prices", "viewDeal": "View Deal from {{store}}", "addToWishlist": "Add to wishlist", "removeFromWishlist": "Remove from wishlist" },
  "coupons": { "title": "Exclusive Coupons", "expiresOn": "Expires on: {{date}}", "copyCode": "Copy Code", "copied": "Copied!", "1": { "description": "15% off on electronics" }, "2": { "description": "10% off on laptops" }, "3": { "description": "20% off on mobile accessories" } },
  "aiGuide": { "title": "Your AI Buying Guide", "subtitle": "Not sure what to buy? Ask our AI to generate a custom buying guide for you.", "placeholder": "e.g., Best video editing laptop under $1500", "buttonText": "Generate Guide", "loading": "Generating...", "guideTitle": "Your Custom Guide: {{topic}}", "error": { "topicRequired": "Please enter a topic to generate the guide.", "generationFailed": "An error occurred while generating the guide. Please try again." } },
  "blog": { "title": "From the Blog", "readMore": "Read More", "publishedOn": "Published on {{date}} by {{author}}", "1": { "title": "How to Choose the Perfect Laptop for Your Needs?" }, "2": { "title": "Top 5 Must-Have Accessories for Your Smartphone" } },
  "modal": { "close": "Close", "bestPrice": "Best Price", "goToStore": "Go to Store" },
  "pwa": { "installButton": "Install App" },
  "footer": { "brand": "Tech Deals", "copyright": "All rights reserved © {{year}}", "about": "About Us", "privacy": "Privacy Policy" },
  "stores": { "amazon": "Amazon", "jarir": "Jarir", "noon": "Noon", "extra": "Extra", "shein": "SHEIN" },
  "login": { "title": "Admin Panel Login", "username": "Username", "password": "Password", "loginButton": "Login", "error": "Invalid username or password." },
  "admin": { "panelTitle": "Admin Panel", "logout": "Logout", "manageUsers": "Manage Users", "addNewUser": "Add New User", "username": "Username", "role": "Role", "actions": "Actions", "edit": "Edit", "delete": "Delete", "deleteConfirm": "Are you sure you want to delete this user?", "manageProducts": "Manage Products", "addNewProduct": "Add New Product", "productName": "Product Name", "category": "Category", "price": "Price (SAR)", "manageCoupons": "Manage Coupons", "addNewCoupon": "Add New Coupon", "store": "Store", "code": "Code", "description": "Description", "manageBlog": "Manage Blog", "addNewPost": "Add New Post", "postTitle": "Post Title", "author": "Author", "date": "Date", "blogForm": { "addPostTitle": "Add New Post", "editPostTitle": "Edit Post", "title": "Title", "author": "Author", "date": "Publish Date", "imageUrl": "Image URL", "content": "Content", "cancel": "Cancel", "save": "Save" }, "userForm": { "addUserTitle": "Add New User", "editUserTitle": "Edit User", "password": "Password", "passwordHint": "Leave blank to keep unchanged", "role": "Role", "cancel": "Cancel", "save": "Save" }, "productForm": { "addProductTitle": "Add New Product", "editProductTitle": "Edit Product", "name": "Name", "category": "Category", "price": "Price (SAR)", "originalPrice": "Original Price (Optional)", "store": "Store", "affiliateLink": "Affiliate Link", "imageUrl": "Image URL", "description": "Description", "cancel": "Cancel", "save": "Save" }, "couponForm": { "addCouponTitle": "Add New Coupon", "editCouponTitle": "Edit Coupon", "store": "Store", "code": "Code", "description": "Description", "expiryDate": "Expiry Date", "storeLogoUrl": "Store Logo URL", "cancel": "Cancel", "save": "Save" }, "roles": { "ADMIN": "Admin", "EDITOR": "Editor" }, "manageSite": "Site Settings", "manageSiteDesc": "Manage general site content like About Us and Privacy Policy.", "aboutUs": "About Us", "privacyPolicy": "Privacy Policy", "copyrightYear": "Copyright Year", "saveSettings": "Save Settings", "settingsSaved": "Settings saved successfully!", "siteVisibility": "Visibility Settings", "siteVisibilityDesc": "Control which sections are visible on the homepage.", "showBlogSection": "Show Blog Section", "showCouponsSection": "Show Coupons Section", "monetization": "Monetization", "monetizationDesc": "Manage advertising and commission settings.", "adsenseId": "Google AdSense Publisher ID", "pixelId": "Facebook Pixel ID", "commissionRate": "Default Affiliate Commission Rate (%)", "showAds": "Show Advertisements on Site", "earningsDashboard": "Earnings Dashboard", "earningsDesc": "An overview of potential affiliate commission earnings.", "productCount": "Total Products: {{count}}", "addProductByUrl": "Add via Link", "productUrlModal": { "title": "Generate Product from URL", "placeholder": "https://example.com/product-page", "generate": "Generate Product", "generating": "Generating...", "error": "Could not extract product details. Please check the URL or try another page." }, "automationSettings": { "title": "Automation Settings", "desc": "Manage automatic content generation and updates.", "enableAutoAdd": "Enable Automatic Product Addition", "enableAutoAddDesc": "When enabled, the system will automatically add new deals periodically." } },
  "notifications": { "newProductAdded": "New product added: {{productName}}" }
};
const translations = { ar: arTranslations, en: enTranslations };

const formatCurrency = (price, targetCurrency, locale) => {
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
        return `${targetCurrency} ${price.toFixed(2)}`;
    }
};

const initialProducts = [
  { id: 1, category: 'laptops', price: 6500, originalPrice: 7200, imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/touch-silver/notebook-xps-15-9530-t-sl-gallery-4.psd?fmt=pjpg&pscan=auto&scl=1&hei=402&wid=573&qlt=100,1&resMode=sharp2&size=573,402&chrss=full', rating: 4.8, reviewCount: 250, store: 'amazon', affiliateLink: 'https://www.amazon.sa', priceComparison: [ { store: 'amazon', price: 6500, affiliateLink: 'https://www.amazon.sa' }, { store: 'jarir', price: 6550, affiliateLink: 'https://www.jarir.com' }, { store: 'noon', price: 6600, affiliateLink: 'https://www.noon.com/saudi-en/' }, ] },
  { id: 2, category: 'smartphones', price: 4300, imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/sa_en/2302/gallery/sa_en-galaxy-s23-ultra-s918-sm-s918bzgkmea-534862319?$650_519_PNG$', rating: 4.9, reviewCount: 890, store: 'noon', affiliateLink: 'https://www.noon.com/saudi-en/', },
  { id: 3, category: 'headphones', price: 1450, originalPrice: 1600, imageUrl: 'https://www.sony.com/image/5d02da5df55283f2a24d732e9bdb272a?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF', rating: 4.7, reviewCount: 1200, store: 'jarir', affiliateLink: 'https://www.jarir.com', priceComparison: [ { store: 'jarir', price: 1450, affiliateLink: 'https://www.jarir.com' }, { store: 'amazon', price: 1475, affiliateLink: 'https://www.amazon.sa' }, ] },
  { id: 4, category: 'monitors', price: 1800, imageUrl: 'https://www.lg.com/us/images/monitors/md08003291/gallery/Desktop-01.jpg', rating: 4.6, reviewCount: 450, store: 'amazon', affiliateLink: 'https://www.amazon.sa', },
  { id: 5, category: 'tablets', price: 2400, imageUrl: 'https://www.apple.com/v/ipad-air/t/images/overview/design/design_hero_1_xlarge.jpg', rating: 4.9, reviewCount: 1500, store: 'extra', affiliateLink: 'https://www.extra.com', },
  { id: 6, category: 'cameras', price: 9800, originalPrice: 10500, imageUrl: 'https://pcfactory.com.bd/wp-content/uploads/2021/10/Canon-EOS-R6-Mirrorless-Digital-Camera-with-24-105mm-f4-7.1-Lens.jpg', rating: 4.8, reviewCount: 320, store: 'jarir', affiliateLink: 'https://www.jarir.com', },
  { id: 7, category: 'accessories', price: 450, imageUrl: 'https://resource.logitech.com/w_386,ar_1.0,c_limit,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-mouse-gallery-graphite-1.png?v=1', rating: 4.9, reviewCount: 2100, store: 'amazon', affiliateLink: 'https://www.amazon.sa', priceComparison: [ { store: 'amazon', price: 450, affiliateLink: 'https://www.amazon.sa' }, { store: 'jarir', price: 449, affiliateLink: 'https://www.jarir.com' }, ] },
  { id: 8, category: 'smartphones', price: 3800, imageUrl: 'https://lh3.googleusercontent.com/f2-Duw_GPQ2i3TjVs7J1dG-o62b2-5s_hba58-B0T-t6iJdIo2hQ2I327f2-sAn0j4jOfi-12s-g_3QyD-34t_84_o0-O414r0c=rw-e365-w1000', rating: 4.7, reviewCount: 650, store: 'amazon', affiliateLink: 'https://www.amazon.sa', },
  { id: 9, category: 'accessories', price: 150, originalPrice: 180, imageUrl: 'https://assets3.razerzone.com/i94g4Yp_m562V3HZ-1oF436y2-s=/1500x1000/media/catalog/product/1/6/16022022-viper-mini-1500x1000-1.jpg', rating: 4.6, reviewCount: 3200, store: 'amazon', affiliateLink: 'https://www.amazon.sa', priceComparison: [ { store: 'amazon', price: 150, affiliateLink: 'https://www.amazon.sa' }, { store: 'jarir', price: 155, affiliateLink: 'https://www.jarir.com' }, ] },
  { id: 10, category: 'accessories', price: 999, originalPrice: 1150, imageUrl: 'https://www.apple.com/v/apple-watch-se/n/images/overview/reasons/why_se_hero__b1lsc1rttrsm_large.jpg', rating: 4.8, reviewCount: 1800, store: 'extra', affiliateLink: 'https://www.extra.com', priceComparison: [ { store: 'extra', price: 999, affiliateLink: 'https://www.extra.com' }, { store: 'jarir', price: 1049, affiliateLink: 'https://www.jarir.com' }, ] },
  { id: 11, category: 'accessories', price: 350, imageUrl: 'https://m.media-amazon.com/images/I/61-r8n13SPL._AC_SL1500_.jpg', rating: 4.7, reviewCount: 2500, store: 'amazon', affiliateLink: 'https://www.amazon.sa' },
  { id: 12, category: 'headphones', price: 300, originalPrice: 380, imageUrl: 'https://m.media-amazon.com/images/I/61+j-vM6cQL._AC_SL1500_.jpg', rating: 4.6, reviewCount: 50000, store: 'noon', affiliateLink: 'https://www.noon.com/saudi-en/' }
];
const initialCoupons = [
  { id: 1, store: 'noon', storeLogoUrl: 'https://picsum.photos/seed/noonlogo/100/100', code: 'SAVE15', description: 'خصم 15% على الإلكترونيات', expiryDate: '2024-12-31', },
  { id: 2, store: 'amazon', storeLogoUrl: 'https://picsum.photos/seed/amazonlogo/100/100', code: 'TECHY10', description: 'خصم 10% على اللابتوبات', expiryDate: '2024-11-30', },
  { id: 3, store: 'shein', storeLogoUrl: 'https://picsum.photos/seed/sheinlogo/100/100', code: 'STYLE20', description: 'خصم 20% على اكسسوارات الجوال', expiryDate: '2025-01-15', },
];
const categories = [ { key: 'laptops', name: 'لابتوبات' }, { key: 'smartphones', name: 'هواتف ذكية' }, { key: 'headphones', name: 'سماعات' }, { key: 'monitors', name: 'شاشات' }, { key: 'tablets', name: 'أجهزة لوحية' }, { key: 'cameras', name: 'كاميرات' }, { key: 'accessories', name: 'ملحقات' }, ];
const initialBlogPosts = [
    { id: 1, title: 'كيف تختار اللابتوب المثالي لاحتياجاتك؟', author: 'فريق صفقات تك', date: '2024-07-15', imageUrl: 'https://picsum.photos/seed/blog1/800/400', content: `
عندما يتعلق الأمر بشراء لابتوب جديد، قد تكون الخيارات المتاحة مربكة. إليك دليل سريع لمساعدتك:

**1. حدد ميزانيتك:** تتراوح الأسعار بشكل كبير. معرفة ميزانيتك ستساعدك على تضييق الخيارات.

**2. نظام التشغيل:** هل تفضل Windows، macOS، أم ChromeOS؟ كل نظام له مميزاته وعيوبه.

**3. الأداء:**
   - **المعالج (CPU):** Intel Core i5 أو AMD Ryzen 5 كافٍ لمعظم المهام. للمهام الثقيلة (مونتاج، ألعاب)، ابحث عن Core i7/i9 أو Ryzen 7/9.
   - **الذاكرة (RAM):** 8GB هي الحد الأدنى. 16GB مثالية لمعظم المستخدمين. 32GB للمحترفين.
   - **التخزين (SSD):** اختر SSD بدلاً من HDD لسرعة فائقة. 256GB كافية للاستخدام الخفيف، لكن 512GB أو أكثر هي الأفضل.

**4. الشاشة:** الحجم والدقة والجودة مهمة. شاشات OLED تقدم أفضل الألوان، ومعدل التحديث العالي (120Hz+) مهم للألعاب.

نصيحة أخيرة: اقرأ المراجعات وشاهد الفيديوهات قبل اتخاذ قرارك النهائي!
        `, },
    { id: 2, title: 'أهم 5 ملحقات يجب أن تقتنيها لهاتفك الذكي', author: 'فريق صفقات تك', date: '2024-07-10', imageUrl: 'https://picsum.photos/seed/blog2/800/400', content: `
هاتفك الذكي هو أكثر من مجرد جهاز اتصال. إليك 5 ملحقات تعزز تجربتك:

1.  **شاحن محمول (Power Bank):** لا غنى عنه للبقاء على اتصال طوال اليوم، خاصة أثناء التنقل.
2.  **سماعات لاسلكية:** سواء كانت للاستماع للموسيقى أو إجراء المكالمات، السماعات اللاسلكية توفر حرية وراحة.
3.  **واقي شاشة عالي الجودة:** استثمار بسيط لحماية شاشة هاتفك من الخدوش والكسر.
4.  **شاحن لاسلكي:** لسهولة الشحن في المنزل أو المكتب دون الحاجة للكابلات.
5.  **حامل هاتف للسيارة:** للقيادة الآمنة واستخدام الخرائط بسهولة.

هذه الملحقات لا تحسن من وظائف هاتفك فحسب، بل تحافظ عليه أيضًا.
        `, }
];
const initialSiteSettings = { aboutUs: "Welcome to Tech Deals! We are dedicated to finding you the best prices and offers on the latest technology. Our mission is to make tech accessible and affordable for everyone.", privacyPolicy: "Your privacy is important to us. At Tech Deals, we are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website. We do not sell your personal information to third parties.", copyrightYear: new Date().getFullYear(), googleAdSenseId: 'ca-pub-XXXXXXXXXXXXXXXX', facebookPixelId: 'XXXXXXXXXXXXXXXX', affiliateCommissionRate: 5, blogPosts: initialBlogPosts, showBlogSection: true, showCouponsSection: true, showAds: true, enableAutoAdd: true, };
const EXCHANGE_RATES = { SAR: 1, USD: 0.27, EUR: 0.25, AED: 0.98, EGP: 12.7, KWD: 0.082, LBP: 24000, RUB: 23, CNY: 1.93, KRW: 370, KPW: 370, INR: 22.3, PKR: 74, };
const LANGUAGES = [ { code: 'ar', name: 'العربية', dir: 'rtl' }, { code: 'en', name: 'English', dir: 'ltr' }, ];
const CURRENCIES = [ { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س' }, { code: 'USD', name: 'US Dollar', symbol: '$' }, { code: 'EUR', name: 'Euro', symbol: '€' }, { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' }, { code: 'EGP', name: 'Egyptian Pound', symbol: 'ج.م' }, { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك' }, { code: 'LBP', name: 'Lebanese Pound', symbol: 'L£' }, { code: 'RUB', name: 'Russian Ruble', symbol: '₽' }, { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' }, { code: 'KRW', name: 'South Korean Won', symbol: '₩' }, { code: 'KPW', name: 'North Korean Won', symbol: '₩' }, { code: 'INR', name: 'Indian Rupee', symbol: '₹' }, { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' }, ];
const COUNTRIES = [ { code: 'CN', name: 'China', flag: '🇨🇳', currencyCode: 'CNY', languageCode: 'en' }, { code: 'EG', name: 'Egypt', flag: '🇪🇬', currencyCode: 'EGP', languageCode: 'ar' }, { code: 'IN', name: 'India', flag: '🇮🇳', currencyCode: 'INR', languageCode: 'en' }, { code: 'KW', name: 'Kuwait', flag: '🇰🇼', currencyCode: 'KWD', languageCode: 'ar' }, { code: 'LB', name: 'Lebanon', flag: '🇱🇧', currencyCode: 'LBP', languageCode: 'ar' }, { code: 'KP', name: 'North Korea', flag: '🇰🇵', currencyCode: 'KPW', languageCode: 'en' }, { code: 'PK', name: 'Pakistan', flag: '🇵🇰', currencyCode: 'PKR', languageCode: 'en' }, { code: 'RU', name: 'Russia', flag: '🇷🇺', currencyCode: 'RUB', languageCode: 'en' }, { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', currencyCode: 'SAR', languageCode: 'ar' }, { code: 'KR', name: 'South Korea', flag: '🇰🇷', currencyCode: 'KRW', languageCode: 'en' }, { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', currencyCode: 'AED', languageCode: 'ar' }, { code: 'US', name: 'United States', flag: '🇺🇸', currencyCode: 'USD', languageCode: 'en' }, ];

// === GEMINI SERVICE ===
async function generateBuyingGuide(topic, languageCode) {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    console.warn("Gemini API key not found. Using fallback response.");
    return Promise.resolve(languageCode === 'ar' 
        ? "خدمة الذكاء الاصطناعي غير متاحة حاليًا. يرجى التأكد من تكوين مفتاح API."
        : "AI service is currently unavailable. Please ensure the API key is configured."
    );
  }
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const languageName = languageCode === 'ar' ? 'العربية' : 'English';
  try {
    const prompt = `
      As a tech expert, write a concise and helpful buying guide in ${languageName} about the following topic: "${topic}".
      The guide should include:
      1. A short introduction.
      2. The most important 3-4 points to consider when buying.
      3. A recommendation of 1-2 products as examples, if possible.
      4. A concluding tip.
      Keep the text easy to read and well-structured.
      The entire response must be in ${languageName}.
    `;
    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini API:", error);
    throw new Error("Failed to generate buying guide.");
  }
}
async function generateProductFromUrl(url, languageCode) {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        console.warn("Gemini API key not found. URL generation disabled.");
        throw new Error("API key not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const languageName = languageCode === 'ar' ? 'Arabic' : 'English';
    const schema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "The full name of the product." },
            description: { type: Type.STRING, description: `A concise, compelling description of the product in one or two sentences, written in ${languageName}.` },
            price: { type: Type.NUMBER, description: "The main price of the product as a number, without currency symbols." },
            originalPrice: { type: Type.NUMBER, description: "The original price if a discount is shown, otherwise null." },
            category: { type: Type.STRING, description: "The most relevant category from this list: laptops, smartphones, headphones, monitors, tablets, cameras, accessories." },
            imageUrl: { type: Type.STRING, description: "A direct, publicly accessible URL to the main product image." },
            store: { type: Type.STRING, description: "The name of the store (e.g., Amazon, Jarir, Noon)." }
        },
        required: ["name", "description", "price", "category", "imageUrl", "store"]
    };
    try {
        const prompt = `
            Analyze the content of this product page URL: ${url}
            Extract the product information according to the provided JSON schema.
            The 'description' field must be in ${languageName}.
            Ensure the 'category' is one of the allowed values.
            If you cannot find a specific field, use a sensible default or null where appropriate (like for originalPrice).
        `;
        const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: "application/json", responseSchema: schema } });
        const jsonText = response.text.trim();
        const productData = JSON.parse(jsonText);
        return { ...productData, rating: 0, reviewCount: 0, affiliateLink: url, priceComparison: [] };
    } catch (error) {
        console.error("Error generating product from URL with Gemini API:", error);
        throw new Error("Failed to extract product data from the URL.");
    }
}
async function generateNewDeal(languageCode, existingProductNames = []) {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        console.warn("Gemini API key not found. Auto-generation of deals is disabled.");
        return null;
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const languageName = languageCode === 'ar' ? 'Arabic' : 'English';
    const schema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: `The full name of the product, in ${languageName}.` },
            description: { type: Type.STRING, description: `A concise, compelling description of the product in one or two sentences, in ${languageName}.` },
            price: { type: Type.NUMBER, description: "The discounted price of the product as a number, in Saudi Riyals (SAR)." },
            originalPrice: { type: Type.NUMBER, description: "The original price before the discount, which must be higher than the 'price'." },
            category: { type: Type.STRING, description: "The most relevant category from this list: laptops, smartphones, headphones, monitors, tablets, cameras, accessories." },
            imageUrl: { type: Type.STRING, description: "A publicly accessible URL to a realistic product image. Use a service like picsum.photos." },
            store: { type: Type.STRING, description: "The name of a popular online store in the Middle East (e.g., amazon, jarir, noon, extra)." }
        },
        required: ["name", "description", "price", "originalPrice", "category", "imageUrl", "store"]
    };
    try {
        const prompt = `
            Generate a single, realistic, and appealing tech product deal for a specific, real-world tech product model (e.g., 'Samsung Galaxy Watch 6', 'Dell Alienware m16 R2 Gaming Laptop') that is currently available for purchase. The deal must be for a product that is not in the following list of existing product names: [${existingProductNames.join(', ')}].
            - The product's name and description must be in ${languageName}.
            - The product category must be one of: laptops, smartphones, headphones, monitors, tablets, cameras, accessories.
            - The store must be one of: amazon, jarir, noon, extra.
            - The 'originalPrice' must be greater than the 'price' to show a clear discount.
            - The prices should be realistic for the Saudi Arabian market in SAR.
            - For the imageUrl, provide a random but plausible image URL from picsum.photos, like 'https://picsum.photos/seed/newproduct${Date.now()}/400/300'.
            - Provide the response in JSON format according to the schema.
        `;
        const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: "application/json", responseSchema: schema } });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating new deal with Gemini API:", error);
        throw new Error("Failed to generate new deal.");
    }
}


// === CONTEXTS AND HOOKS ===
const AuthContext = createContext(undefined);
const initialUsers = [ { id: 1, username: 'admin', password: 'makram', role: 'ADMIN' }, { id: 2, username: 'editor', password: 'editor', role: 'EDITOR' } ];
const getStoredData = (key, defaultValue) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue && storedValue !== 'undefined' ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key “${key}”:`, error);
    return defaultValue;
  }
};
const getStoredUsers = () => {
  try {
    const stored = localStorage.getItem('usersWithPasswords');
    if (stored) {
      return JSON.parse(stored).map(({ password, ...user }) => user);
    }
    localStorage.setItem('usersWithPasswords', JSON.stringify(initialUsers));
    return initialUsers.map(({ password, ...user }) => user);
  } catch (error) {
    console.error("Error accessing stored users:", error);
    return [];
  }
};
const getStoredSession = () => {
    try {
        const stored = sessionStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error("Error accessing stored session:", error);
        return null;
    }
};
const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(getStoredUsers);
  const [currentUser, setCurrentUser] = useState(getStoredSession);
  const login = (username, password) => {
    const storedUsersWithPasswords = JSON.parse(localStorage.getItem('usersWithPasswords') || '[]');
    const userToLogin = storedUsersWithPasswords.find( (u) => u.username === username && u.password === password );
    if (userToLogin) {
      const { password, ...userWithoutPassword } = userToLogin;
      setCurrentUser(userWithoutPassword);
      sessionStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };
  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  };
  const syncUsersToStorage = (updatedUsersWithPasswords) => {
      localStorage.setItem('usersWithPasswords', JSON.stringify(updatedUsersWithPasswords));
      setUsers(updatedUsersWithPasswords.map(({ password, ...user }) => user));
  }
  const addUser = (user) => {
    const storedUsersWithPasswords = JSON.parse(localStorage.getItem('usersWithPasswords') || '[]');
    const newUser = { ...user, id: Date.now() };
    syncUsersToStorage([...storedUsersWithPasswords, newUser]);
  };
  const updateUser = (userToUpdate) => {
      const storedUsersWithPasswords = JSON.parse(localStorage.getItem('usersWithPasswords') || '[]');
      const updatedList = storedUsersWithPasswords.map((u) => {
          if (u.id === userToUpdate.id) {
              const updatedUser = { ...u, username: userToUpdate.username, role: userToUpdate.role };
              if (userToUpdate.password) {
                  updatedUser.password = userToUpdate.password;
              }
              return updatedUser;
          }
          return u;
      });
      syncUsersToStorage(updatedList);
  };
  const deleteUser = (userId) => {
      const storedUsersWithPasswords = JSON.parse(localStorage.getItem('usersWithPasswords') || '[]');
      const updatedList = storedUsersWithPasswords.filter((u) => u.id !== userId);
      syncUsersToStorage(updatedList);
  };
  return (
    React.createElement(AuthContext.Provider, { value: { currentUser, users, login, logout, addUser, updateUser, deleteUser } }, children)
  );
};
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const LocalizationContext = createContext(undefined);
const getInitialState = () => {
    let country;
    let language;
    const storedCountry = getStoredData('country', null);
    if (storedCountry) {
        country = storedCountry;
    } else {
        const userLang = navigator.language;
        const regionCode = userLang.split('-')[1];
        let detectedCountry;
        if (regionCode) {
            detectedCountry = COUNTRIES.find(c => c.code.toUpperCase() === regionCode.toUpperCase());
        }
        const defaultCountry = COUNTRIES.find(c => c.code === 'SA') || COUNTRIES[0];
        country = detectedCountry || defaultCountry; 
    }
    const currency = CURRENCIES.find(c => c.code === country.currencyCode) || CURRENCIES[0];
    language = LANGUAGES.find(l => l.code === country.languageCode) || LANGUAGES[0];
    const storedLanguage = getStoredData('language', null);
    if (storedLanguage) {
        language = storedLanguage;
    }
    return { country, currency, language };
};
const LocalizationProvider = ({ children }) => {
  const [initialState] = useState(getInitialState);
  const [language, setLanguageState] = useState(initialState.language);
  const [currency, setCurrencyState] = useState(initialState.currency);
  const [country, setCountryState] = useState(initialState.country);
  
  useEffect(() => {
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.dir;
    localStorage.setItem('language', JSON.stringify(language));
  }, [language]);
  
  useEffect(() => {
    localStorage.setItem('currency', JSON.stringify(currency));
  }, [currency]);
  
  useEffect(() => {
    localStorage.setItem('country', JSON.stringify(country));
  }, [country]);
  const setCountry = useCallback((newCountry) => {
    setCountryState(newCountry);
    const newCurrency = CURRENCIES.find(c => c.code === newCountry.currencyCode);
    if (newCurrency) {
        setCurrencyState(newCurrency);
    } else {
        console.warn(`Currency for country ${newCountry.code} not found. Defaulting to SAR.`);
        setCurrencyState(CURRENCIES.find(c => c.code === 'SAR') || CURRENCIES[0]);
    }
    const newLanguage = LANGUAGES.find(l => l.code === newCountry.languageCode);
    if (newLanguage) {
      setLanguageState(newLanguage);
    }
  }, []);
  const convertPrice = useCallback((priceInSar) => {
    const rate = EXCHANGE_RATES[currency.code];
    if (rate !== undefined) {
        return priceInSar * rate;
    }
    return priceInSar;
  }, [currency]);
  const t = useCallback((key, replacements) => {
    const langFile = translations[language.code];
     if (!langFile) {
        console.warn(`No translations found for language: ${language.code}`);
        return key;
    }
    let translation = key.split('.').reduce((obj, k) => (obj)?.[k], langFile) || key;
    if (replacements) {
        Object.entries(replacements).forEach(([k, v]) => {
            translation = translation.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
        });
    }
    return translation;
  }, [language.code]);
  const contextValue = useMemo(() => ({
    language, setLanguage: setLanguageState, currency, setCurrency: setCurrencyState,
    country, setCountry, t, convertPrice,
  }), [language, currency, country, setCountry, convertPrice, t]);
  
  return (
    React.createElement(LocalizationContext.Provider, { value: contextValue }, children)
  );
};
const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

const useModalAccessibility = (modalRef, isOpen, onClose) => {
    const lastFocusedElement = useRef(null);

    useEffect(() => {
        if (isOpen) {
            lastFocusedElement.current = document.activeElement;
            
            const timer = setTimeout(() => {
                const focusableElements = modalRef.current?.querySelectorAll(
                    'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
                );
                const firstElement = focusableElements?.[0];
                firstElement?.focus();
            }, 100);

            const handleKeyDown = (event) => {
                if (event.key === 'Escape') {
                    onClose();
                }
                if (event.key === 'Tab' && modalRef.current) {
                    const focusableElements = modalRef.current.querySelectorAll(
                        'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
                    );
                    if (focusableElements.length === 0) return;
                    
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (event.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            event.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            event.preventDefault();
                        }
                    }
                }
            };
            
            document.addEventListener('keydown', handleKeyDown);

            return () => {
                clearTimeout(timer);
                document.removeEventListener('keydown', handleKeyDown);
                lastFocusedElement.current?.focus();
            };
        }
    }, [isOpen, onClose, modalRef]);
};

// === NOTIFICATION SYSTEM ===
const NotificationContext = createContext(undefined);

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const value = useMemo(() => ({ addNotification }), [addNotification]);

    return (
        React.createElement(NotificationContext.Provider, { value: value },
            children,
            React.createElement("div", { "aria-live": "assertive", className: "fixed inset-0 flex items-start px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[100]" },
                React.createElement("div", { className: "w-full flex flex-col items-center space-y-4 sm:items-end" },
                    notifications.map(notification => 
                        React.createElement(Notification, { 
                            key: notification.id, 
                            notification: notification, 
                            onClose: () => removeNotification(notification.id) 
                        })
                    )
                )
            )
        )
    );
};

const Notification = ({ notification, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);
    
    const bgColor = notification.type === 'success' ? 'bg-green-500' : 'bg-brand';

    return (
        React.createElement("div", { 
            className: `max-w-sm w-full ${bgColor} shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden animate-slide-in-right`
        },
            React.createElement("div", { className: "p-4" },
                React.createElement("div", { className: "flex items-start" },
                    React.createElement("div", { className: "flex-shrink-0" },
                        React.createElement("svg", { className: "h-6 w-6 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true" },
                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" })
                        )
                    ),
                    React.createElement("div", { className: "ml-3 w-0 flex-1 pt-0.5" },
                        React.createElement("p", { className: "text-sm font-medium text-white" }, notification.message)
                    ),
                    React.createElement("div", { className: "ml-4 flex-shrink-0 flex" },
                        React.createElement("button", { type: "button", onClick: onClose, className: "bg-transparent rounded-md inline-flex text-white hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white" },
                            React.createElement("span", { className: "sr-only" }, "Close"),
                            React.createElement(CloseIcon, { className: "h-5 w-5", "aria-hidden": "true" })
                        )
                    )
                )
            ),
             React.createElement("style", null, `@keyframes slide-in-right { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .animate-slide-in-right { animation: slide-in-right 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }`)
        )
    );
};

const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

// === ICONS ===
const SearchIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, ...props }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" })));
const HeartIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-6 h-6", ...props }, React.createElement("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })));
const GlobeIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, ...props }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.704 4.135a9 9 0 0110.592 0M7.704 4.135L4.45 2.136a1 1 0 00-1.45.894l.5 3.512M16.296 4.135l3.254-1.999a1 1 0 011.45.894l-.5 3.512M12 21a9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9 9 9 0 01-9 9z" })));
const StarIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "w-6 h-6", ...props }, React.createElement("path", { fillRule: "evenodd", d: "M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z", clipRule: "evenodd" })));
const CloseIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, ...props }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" })));
const ChevronDownIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", ...props }, React.createElement("path", { fillRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", clipRule: "evenodd" })));
const DownloadIcon = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, ...props }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" })));

// === UI COMPONENTS ===
const Dropdown = ({ options, value, onChange, renderButton }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { language } = useLocalization();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };
  const selectedOption = options.find(opt => opt.value === value);
  return (
    React.createElement("div", { className: "relative", ref: dropdownRef },
      React.createElement("button", { type: "button", onClick: () => setIsOpen(!isOpen), className: "flex items-center", "aria-haspopup": "true", "aria-expanded": isOpen },
        renderButton(selectedOption),
        React.createElement(ChevronDownIcon, { className: `w-4 h-4 text-light transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}` })
      ),
      isOpen && (
        React.createElement("div", { className: `absolute top-full mt-2 w-48 bg-secondary border border-accent/50 rounded-lg shadow-xl z-50 overflow-hidden ${language.dir === 'rtl' ? 'left-0' : 'right-0'}` },
          React.createElement("ul", { className: "py-1" },
            options.map((option) => (
              React.createElement("li", { key: option.value },
                React.createElement("button", { type: "button", onClick: (e) => { e.preventDefault(); handleSelect(option.value); }, className: `block w-full text-left px-4 py-2 text-sm transition-colors ${ value === option.value ? 'bg-brand text-primary font-semibold' : 'text-highlight hover:bg-accent' }` },
                  option.label
                )
              )
            ))
          )
        )
      )
    )
  );
};
const Header = ({ wishlistCount, onNavigate, onGoToCategories, onGoToBlog, siteSettings }) => {
  const { t, language, setLanguage, country, setCountry } = useLocalization();
  const countryOptions = COUNTRIES.map(c => {
    const currency = CURRENCIES.find(curr => curr.code === c.currencyCode);
    return { value: c.code, label: `${c.flag} ${c.name} ${currency ? `(${currency.symbol})` : ''}` };
  });
  return (
    React.createElement("header", { className: "bg-secondary/50 backdrop-blur-lg sticky top-0 z-50 shadow-md" },
      React.createElement("nav", { className: "container mx-auto px-4 py-2 flex justify-between items-center" },
        React.createElement("div", { className: "text-2xl font-black text-brand cursor-pointer", onClick: () => onNavigate('home') }, t('header.brand')),
        React.createElement("div", { className: "hidden md:flex items-center space-x-8 space-x-reverse text-lg font-semibold" },
          React.createElement("button", { type: "button", onClick: () => onNavigate('home'), className: "text-highlight hover:text-brand transition-colors cursor-pointer" }, t('header.home')),
          React.createElement("button", { type: "button", onClick: () => onNavigate('deals'), className: "text-highlight hover:text-brand transition-colors cursor-pointer" }, t('header.deals')),
          React.createElement("button", { type: "button", onClick: onGoToCategories, className: "text-highlight hover:text-brand transition-colors cursor-pointer" }, t('header.categories')),
          siteSettings.showBlogSection && (
            React.createElement("button", { type: "button", onClick: onGoToBlog, className: "text-highlight hover:text-brand transition-colors cursor-pointer" }, t('header.blog'))
          )
        ),
        React.createElement("div", { className: "flex items-center gap-2" },
            React.createElement(Dropdown, { value: language.code, onChange: (value) => setLanguage(LANGUAGES.find(l => l.code === value)), options: LANGUAGES.map(lang => ({ value: lang.code, label: lang.name })),
                renderButton: (selectedOption) => ( React.createElement("div", { className: "flex items-center gap-1 p-2 rounded-full hover:bg-accent transition-colors" }, React.createElement(GlobeIcon, { className: "w-5 h-5 text-highlight" }), React.createElement("span", { className: "text-sm font-semibold text-highlight" }, selectedOption?.value.toUpperCase())) )
            }),
             React.createElement(Dropdown, { value: country.code, onChange: (value) => setCountry(COUNTRIES.find(c => c.code === value)), options: countryOptions,
                renderButton: (selectedOption) => ( React.createElement("div", { className: "flex items-center gap-1 p-2 rounded-full hover:bg-accent transition-colors" }, React.createElement("span", { className: "text-lg" }, COUNTRIES.find(c => c.code === selectedOption?.value)?.flag)) )
            }),
          React.createElement("div", { className: "relative" },
            React.createElement("button", { type: "button", onClick: () => onNavigate('wishlist'), className: "flex items-center space-x-2 space-x-reverse p-2 rounded-full hover:bg-accent transition-colors", "aria-label": `${t('header.wishlistAriaLabel')}, ${wishlistCount} ${t('header.products')}` },
              React.createElement(HeartIcon, { className: "w-6 h-6 text-highlight" }),
              wishlistCount > 0 && ( React.createElement("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center" }, wishlistCount) )
            )
          )
        )
      )
    )
  );
};
const Footer = ({ onNavigate, siteSettings }) => {
  const { t } = useLocalization();
  return (
    React.createElement("footer", { className: "bg-secondary mt-12" },
      React.createElement("div", { className: "container mx-auto px-4 py-8 text-center text-light" },
        React.createElement("div", { className: "text-xl font-bold text-brand mb-2" }, t('footer.brand')),
        React.createElement("p", { className: "mb-4" }, t('footer.copyright', { year: siteSettings.copyrightYear })),
        React.createElement("div", { className: "flex justify-center space-x-6 space-x-reverse" },
          React.createElement("button", { type: "button", onClick: () => onNavigate('about'), className: "hover:text-brand transition-colors cursor-pointer" }, t('footer.about')),
          React.createElement("button", { type: "button", onClick: () => onNavigate('privacy'), className: "hover:text-brand transition-colors cursor-pointer" }, t('footer.privacy'))
        ),
        React.createElement("div", { className: "mt-6 border-t border-accent/20 pt-4" },
           React.createElement("button", { type: "button", onClick: () => onNavigate('admin'), className: "text-sm text-accent hover:text-brand transition-colors cursor-pointer" }, "Admin Panel")
        )
      )
    )
  );
};
const ProductCard = ({ product, onToggleWishlist, isInWishlist, onComparePrices }) => {
  const { t, currency, language, convertPrice } = useLocalization();
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const displayPrice = convertPrice(product.price);
  const displayOriginalPrice = product.originalPrice ? convertPrice(product.originalPrice) : undefined;
  const productName = product.name || t(`products.${product.id}.name`);
  return (
    React.createElement("div", { className: "bg-secondary rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full" },
      React.createElement("div", { className: "relative" },
        React.createElement("img", { className: "w-full h-56 object-cover", src: product.imageUrl, alt: productName }),
        discount > 0 && ( React.createElement("div", { className: "absolute top-3 left-3 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg" }, `-${discount}%`) ),
        React.createElement("button", { type: "button", onClick: () => onToggleWishlist(product.id), className: "absolute top-3 right-3 bg-black/30 p-2 rounded-full backdrop-blur-sm", "aria-label": isInWishlist ? t('productCard.removeFromWishlist') : t('productCard.addToWishlist') },
          React.createElement(HeartIcon, { className: `w-6 h-6 transition-colors ${isInWishlist ? 'text-red-500 fill-current' : 'text-white'}` })
        )
      ),
      React.createElement("div", { className: "p-4 flex flex-col flex-grow" },
        React.createElement("p", { className: "text-sm text-brand font-semibold" }, t(`categories.${product.category}`)),
        React.createElement("h3", { className: "font-bold text-lg text-white mt-1 mb-2 flex-grow" }, productName),
        React.createElement("div", { className: "flex items-center text-light text-sm mb-4" },
          React.createElement(StarIcon, { className: "w-5 h-5 text-yellow-400" }),
          React.createElement("span", { className: "mx-1 text-white font-bold" }, product.rating),
          React.createElement("span", { className: "mx-2" }, `(${product.reviewCount} ${t('productCard.reviews')})`)
        ),
        React.createElement("div", { className: "flex items-baseline justify-between mb-4" },
          React.createElement("div", { className: "text-2xl font-black text-white", lang: "en", dir: "ltr" }, formatCurrency(displayPrice, currency.code, language.code)),
          displayOriginalPrice && ( React.createElement("div", { className: "text-md text-light line-through", lang: "en", dir: "ltr" }, formatCurrency(displayOriginalPrice, currency.code, language.code)) )
        ),
        React.createElement("div", { className: "mt-auto flex flex-col gap-2 pt-4 border-t border-accent/20" },
            product.priceComparison && product.priceComparison.length > 1 && (
                 React.createElement("button", { type: "button", onClick: () => onComparePrices(product), className: "w-full text-center bg-accent text-highlight font-bold py-3 rounded-lg hover:bg-light hover:text-primary transition-colors duration-300" },
                 t('productCard.comparePrices'))
            ),
            React.createElement("a", { href: product.affiliateLink, target: "_blank", rel: "noopener noreferrer", className: "w-full text-center bg-brand text-primary font-bold py-3 rounded-lg hover:bg-sky-400 transition-colors duration-300" },
            t('productCard.viewDeal', { store: t(`stores.${product.store}`) }))
        )
      )
    )
  );
};
const PriceComparisonModal = ({ product, onClose }) => {
  const { t, currency, language, convertPrice } = useLocalization();
  const modalRef = useRef(null);
  useModalAccessibility(modalRef, !!product, onClose);

  if (!product || !product.priceComparison) { return null; }

  const convertedPriceComparison = product.priceComparison.map(record => ({ ...record, price: convertPrice(record.price) }));
  const bestPrice = Math.min(...convertedPriceComparison.map(p => p.price));
  const productName = product.name || t(`products.${product.id}.name`);
  const modalContentProps = { ref: modalRef, className: "bg-secondary rounded-2xl p-6 md:p-8 w-full max-w-lg mx-auto shadow-2xl border border-accent/30 transform animate-scale-in", onClick: (e) => e.stopPropagation() };
  return (
    React.createElement("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in", onClick: onClose, role: "dialog", "aria-modal": "true", "aria-labelledby": "price-comparison-title" },
      React.createElement("div", { ...modalContentProps },
        React.createElement("div", { className: "flex justify-between items-start mb-4" },
          React.createElement("div", { className: language.dir === 'rtl' ? 'text-right' : 'text-left' },
            React.createElement("p", { className: "text-sm text-brand font-semibold" }, t(`categories.${product.category}`)),
            React.createElement("h2", { id: "price-comparison-title", className: "text-2xl font-bold text-white" }, productName)
          ),
          React.createElement("button", { type: "button", onClick: onClose, className: "text-light hover:text-white p-1 rounded-full hover:bg-accent transition-colors", "aria-label": t('modal.close') },
            React.createElement(CloseIcon, { className: "w-6 h-6" }))
        ),
        React.createElement("img", { src: product.imageUrl, alt: productName, className: "w-full h-56 object-cover rounded-lg mb-6" }),
        React.createElement("ul", { className: "space-y-3" },
          convertedPriceComparison.sort((a,b) => a.price - b.price).map((record, index) => (
            React.createElement("li", { key: index, className: `flex justify-between items-center bg-accent p-4 rounded-lg transition-all duration-300 ${record.price === bestPrice ? 'border-2 border-brand shadow-lg' : 'border-2 border-transparent'}` },
              React.createElement("span", { className: "font-semibold text-lg text-highlight" }, t(`stores.${record.store}`)),
              React.createElement("div", { className: "flex items-center gap-4" },
                 React.createElement("div", { className: language.dir === 'rtl' ? 'text-left' : 'text-right' },
                    React.createElement("span", { className: "font-black text-xl text-white", lang: "en", dir: "ltr" }, formatCurrency(record.price, currency.code, language.code)),
                    record.price === bestPrice && React.createElement("p", { className: "text-xs text-brand font-bold" }, t('modal.bestPrice'))
                 ),
                 React.createElement("a", { href: record.affiliateLink, target: "_blank", rel: "noopener noreferrer", className: "bg-brand text-primary font-bold px-4 py-2 rounded-lg hover:bg-sky-400 transition-colors duration-300 text-sm whitespace-nowrap" },
                    t('modal.goToStore'))
              )
            )
          ))
        )
      ),
       React.createElement("style", null, `
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
          @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } } .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
        `)
    )
  );
};
const InfoModal = ({ title, content, onClose }) => {
    const { t } = useLocalization();
    const modalRef = useRef(null);
    useModalAccessibility(modalRef, true, onClose);
    const modalContentProps = { ref: modalRef, className: "bg-secondary rounded-2xl p-6 md:p-8 w-full max-w-3xl mx-auto shadow-2xl border border-accent/30 max-h-[80vh] flex flex-col transform animate-scale-in", onClick: (e) => e.stopPropagation() };
    return (
        React.createElement("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in", onClick: onClose, role: "dialog", "aria-modal": "true", "aria-labelledby": "info-modal-title" },
          React.createElement("div", { ...modalContentProps },
            React.createElement("div", { className: "flex justify-between items-center mb-4 flex-shrink-0" },
              React.createElement("h2", { id: "info-modal-title", className: "text-2xl font-bold text-white" }, title),
              React.createElement("button", { type: "button", onClick: onClose, className: "text-light hover:text-white p-1 rounded-full hover:bg-accent transition-colors", "aria-label": t('modal.close') },
                React.createElement(CloseIcon, { className: "w-6 h-6" }))
            ),
            React.createElement("div", { className: "overflow-y-auto prose prose-invert max-w-none text-highlight prose-p:text-light prose-headings:text-white" },
                React.createElement("p", { className: "whitespace-pre-wrap leading-relaxed" }, content)
            )
          ),
           React.createElement("style", null, `
              @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
              @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } } .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
            `)
        )
    );
};
const BlogPostModal = ({ post, onClose }) => {
    const { t } = useLocalization();
    const modalRef = useRef(null);
    useModalAccessibility(modalRef, !!post, onClose);
    const modalContentProps = { ref: modalRef, className: "bg-secondary rounded-2xl w-full max-w-4xl mx-auto shadow-2xl border border-accent/30 max-h-[90vh] flex flex-col transform animate-scale-in", onClick: (e) => e.stopPropagation() };
    return (
        React.createElement("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in", onClick: onClose, role: "dialog", "aria-modal": "true", "aria-labelledby": "blog-post-title" },
          React.createElement("div", { ...modalContentProps },
            React.createElement("div", { className: "relative" },
                React.createElement("img", { src: post.imageUrl, alt: t(`blog.${post.id}.title`), className: "w-full h-64 object-cover rounded-t-2xl" }),
                React.createElement("button", { type: "button", onClick: onClose, className: "absolute top-4 right-4 text-white bg-black/40 p-2 rounded-full hover:bg-black/60 transition-colors", "aria-label": t('modal.close') },
                    React.createElement(CloseIcon, { className: "w-6 h-6" }))
            ),
            React.createElement("div", { className: "p-6 md:p-8 overflow-y-auto" },
                React.createElement("h2", { id: "blog-post-title", className: "text-3xl font-bold text-white mb-2" }, t(`blog.${post.id}.title`)),
                React.createElement("p", { className: "text-sm text-light mb-6" }, t('blog.publishedOn', { date: post.date, author: post.author })),
                React.createElement("div", { className: "prose prose-invert max-w-none text-highlight prose-p:text-light prose-headings:text-white prose-strong:text-white" },
                    React.createElement("p", { className: "whitespace-pre-wrap leading-relaxed" }, post.content)
                )
            )
          ),
           React.createElement("style", null, `
              @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
              @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } } .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
            `)
        )
    );
};
const InstallPWAButton = ({ onInstall }) => {
  const { t } = useLocalization();
  return (
    React.createElement("button", { type: "button", onClick: onInstall, className: "fixed bottom-4 right-4 bg-brand text-primary font-bold py-3 px-5 rounded-full shadow-lg flex items-center gap-3 hover:bg-sky-400 transition-all duration-300 transform hover:scale-105 z-50 animate-bounce", "aria-label": t('pwa.installButton') },
      React.createElement(DownloadIcon, { className: "w-6 h-6" }),
      React.createElement("span", null, t('pwa.installButton')),
       React.createElement("style", null, `
          @keyframes bounce { 0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); } 50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); } }
          .animate-bounce { animation: bounce 1.5s infinite; }
        `)
    )
  );
};
const CouponCard = ({ coupon }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useLocalization();
  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    React.createElement("div", { className: "bg-secondary p-6 rounded-xl shadow-lg flex flex-col sm:flex-row items-center gap-6 text-center sm:text-start" },
      React.createElement("img", { src: coupon.storeLogoUrl, alt: `${coupon.store} logo`, className: "w-20 h-20 rounded-full object-cover border-4 border-accent" }),
      React.createElement("div", { className: "flex-grow" },
        React.createElement("h3", { className: "text-xl font-bold text-white" }, t(`coupons.${coupon.id}.description`)),
        React.createElement("p", { className: "text-light mb-2" }, t('coupons.expiresOn', { date: coupon.expiryDate })),
        React.createElement("div", { className: "flex justify-center sm:justify-start items-center gap-2 mt-4" },
          React.createElement("span", { className: "border-2 border-dashed border-accent text-brand font-mono text-lg py-2 px-4 rounded-md" }, coupon.code),
          React.createElement("button", { type: "button", onClick: handleCopy, className: `px-4 py-2 rounded-md font-bold transition-colors ${ copied ? 'bg-green-500 text-white' : 'bg-brand text-primary hover:bg-sky-400' }` },
            copied ? t('coupons.copied') : t('coupons.copyCode')
          )
        )
      )
    )
  );
};
const AIGuideGenerator = () => {
  const { t, language } = useLocalization();
  const [topic, setTopic] = useState('');
  const [guide, setGuide] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError(t('aiGuide.error.topicRequired'));
      return;
    }
    setIsLoading(true);
    setError(null);
    setGuide('');
    try {
      const result = await generateBuyingGuide(topic, language.code);
      setGuide(result);
    } catch (err) {
      setError(t('aiGuide.error.generationFailed'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    React.createElement("section", { className: "my-12 bg-secondary p-8 rounded-2xl shadow-lg" },
      React.createElement("h2", { className: "text-3xl font-bold text-white mb-2 text-center" }, t('aiGuide.title'), " 🤖"),
      React.createElement("p", { className: "text-light text-center mb-6 max-w-2xl mx-auto" }, t('aiGuide.subtitle')),
      React.createElement("div", { className: "flex flex-col md:flex-row gap-4 max-w-3xl mx-auto" },
        React.createElement("input", { type: "text", value: topic, onChange: (e) => setTopic(e.target.value), placeholder: t('aiGuide.placeholder'), className: "flex-grow w-full py-3 px-4 bg-accent text-highlight rounded-lg focus:outline-none focus:ring-4 focus:ring-brand/50 transition-all duration-300", disabled: isLoading }),
        React.createElement("button", { type: "button", onClick: handleGenerate, disabled: isLoading, className: "bg-brand text-primary font-bold py-3 px-8 rounded-lg hover:bg-sky-400 transition-colors duration-300 disabled:bg-accent disabled:cursor-not-allowed" },
          isLoading ? ( React.createElement("div", { className: "flex items-center justify-center" }, React.createElement("svg", { className: "animate-spin h-5 w-5 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }, React.createElement("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), React.createElement("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })), React.createElement("span", { className: "mx-3" }, t('aiGuide.loading'))) ) : t('aiGuide.buttonText')
        )
      ),
      error && React.createElement("p", { className: "text-red-400 mt-4 text-center" }, error),
      guide && (
        React.createElement("div", { className: "mt-8 bg-primary p-6 rounded-lg prose prose-invert max-w-none text-highlight prose-p:text-light prose-headings:text-white" },
          React.createElement("h3", { className: "text-2xl font-bold text-white mb-4" }, t('aiGuide.guideTitle', { topic })),
          React.createElement("div", { className: "whitespace-pre-wrap leading-relaxed" }, guide)
        )
      )
    )
  );
};
const BlogCard = ({ post, onReadMore }) => {
  const { t } = useLocalization();
  return (
    React.createElement("div", { className: "bg-secondary rounded-xl overflow-hidden shadow-lg flex flex-col h-full group" },
      React.createElement("div", { className: "overflow-hidden" },
        React.createElement("img", { className: "w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500", src: post.imageUrl, alt: t(`blog.${post.id}.title`) })
      ),
      React.createElement("div", { className: "p-6 flex flex-col flex-grow" },
        React.createElement("h3", { className: "font-bold text-xl text-white mt-1 mb-3 flex-grow group-hover:text-brand transition-colors" }, t(`blog.${post.id}.title`)),
        React.createElement("p", { className: "text-sm text-light mb-4" }, t('blog.publishedOn', { date: post.date, author: post.author })),
        React.createElement("button", { type: "button", onClick: () => onReadMore(post), className: "mt-auto w-full text-center bg-accent text-highlight font-bold py-3 rounded-lg hover:bg-brand hover:text-primary transition-colors duration-300" },
          t('blog.readMore')
        )
      )
    )
  );
};

// === PAGE COMPONENTS ===
const HomePage = ({ view, products, coupons, wishlist, toggleWishlist, setView, categoriesRef, blogRef, siteSettings, onViewPost, }) => {
  const { t, language } = useLocalization();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedProduct, setSelectedProduct] = useState(null);
  useEffect(() => {
    let sourceProducts;
    if (view === 'deals') {
      sourceProducts = products.filter(p => p.originalPrice && p.originalPrice > p.price).sort((a, b) => { const discountA = ((a.originalPrice - a.price) / a.originalPrice); const discountB = ((b.originalPrice - b.price) / b.originalPrice); return discountB - discountA; });
    } else if (view === 'wishlist') {
      sourceProducts = products.filter(p => wishlist.includes(p.id));
    } else { sourceProducts = products; }
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
  const handleSearch = (term) => { setSearchTerm(term); };
  const handleCategorySelect = (categoryKey) => { setActiveCategory(categoryKey); if(view === 'wishlist' || view === 'deals') { setView('home'); } };
  const getPageTitle = () => {
      if (view === 'wishlist') return t('pageTitles.wishlist');
      if (view === 'deals') return t('pageTitles.deals');
      return activeCategory === 'all' ? t('pageTitles.featuredProducts') : t(`categories.${activeCategory}`);
  }
  return (
    React.createElement(React.Fragment, null,
      view === 'home' && (
          React.createElement(React.Fragment, null,
          React.createElement("section", { className: "text-center bg-secondary p-8 md:p-12 rounded-2xl mb-12 shadow-lg" },
              React.createElement("h1", { className: "text-4xl md:text-6xl font-black text-white mb-4", style: {animation: 'fade-in-down 0.5s ease-out forwards', opacity: 0} }, t('hero.title')),
              React.createElement("p", { className: "text-lg md:text-xl text-light max-w-3xl mx-auto mb-8", style: {animation: 'fade-in-up 0.5s ease-out 0.2s forwards', opacity: 0} }, t('hero.subtitle')),
              React.createElement("div", { className: "relative max-w-2xl mx-auto" },
                React.createElement("input", { type: "text", placeholder: t('hero.searchPlaceholder'), className: `w-full py-4 ${language.dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} bg-accent text-highlight rounded-full focus:outline-none focus:ring-4 focus:ring-brand/50 transition-all duration-300 shadow-inner`, value: searchTerm, onChange: (e) => handleSearch(e.target.value) }),
                React.createElement("div", { className: `absolute top-1/2 ${language.dir === 'rtl' ? 'right-4' : 'left-4'} -translate-y-1/2 text-light` }, React.createElement(SearchIcon, null))
              )
          ),
          React.createElement("section", { ref: categoriesRef, className: "mb-8" },
            React.createElement("h2", { className: `text-3xl font-bold text-white mb-6 border-brand ${language.dir === 'rtl' ? 'border-r-4 pr-4' : 'border-l-4 pl-4'}` }, t('categories.title')),
            React.createElement("div", { className: "flex flex-wrap gap-4" },
              React.createElement("button", { type: "button", onClick: () => handleCategorySelect('all'), className: `px-6 py-2 rounded-full transition-colors duration-300 font-semibold shadow-md ${ activeCategory === 'all' ? 'bg-brand text-primary' : 'bg-accent text-highlight hover:bg-light hover:text-primary' }` }, t('categories.all')),
              categories.map((category) => ( React.createElement("button", { type: "button", key: category.key, onClick: () => handleCategorySelect(category.key), className: `px-6 py-2 rounded-full transition-colors duration-300 font-semibold shadow-md ${ activeCategory === category.key ? 'bg-brand text-primary' : 'bg-accent text-highlight hover:bg-light hover:text-primary' }` }, t(`categories.${category.key}`)) ))
            )
          ))
      ),
      React.createElement("section", { className: "mb-12" },
        React.createElement("h2", { className: `text-3xl font-bold text-white mb-6 border-brand ${language.dir === 'rtl' ? 'border-r-4 pr-4' : 'border-l-4 pl-4'}` }, getPageTitle()),
        filteredProducts.length > 0 ? (
            React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" },
                filteredProducts.map((product) => ( React.createElement(ProductCard, { key: product.id, product: product, onToggleWishlist: toggleWishlist, isInWishlist: wishlist.includes(product.id), onComparePrices: setSelectedProduct }) ))
            )
        ) : (
            React.createElement("div", { className: "text-center py-16 bg-secondary rounded-xl" },
                React.createElement("p", { className: "text-2xl text-light" }, t('products.noResults')),
                React.createElement("p", { className: "text-light mt-2" }, t('products.noResultsSubtitle'))
            )
        )
      ),
      view === 'home' && (
          React.createElement(React.Fragment, null,
              React.createElement(AIGuideGenerator, null),
              siteSettings.showBlogSection && (
                React.createElement("section", { ref: blogRef, className: "my-12" },
                    React.createElement("h2", { className: `text-3xl font-bold text-white mb-6 border-brand ${language.dir === 'rtl' ? 'border-r-4 pr-4' : 'border-l-4 pl-4'}` }, t('blog.title')),
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8" },
                        siteSettings.blogPosts.map((post) => ( React.createElement(BlogCard, { key: post.id, post: post, onReadMore: onViewPost }) ))
                    )
                )
              ),
              siteSettings.showCouponsSection && (
                React.createElement("section", { className: "mb-12" },
                    React.createElement("h2", { className: `text-3xl font-bold text-white mb-6 border-brand ${language.dir === 'rtl' ? 'border-r-4 pr-4' : 'border-l-4 pl-4'}` }, t('coupons.title')),
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" },
                        coupons.map((coupon) => ( React.createElement(CouponCard, { key: coupon.id, coupon: coupon }) ))
                    )
                )
              )
          )
      ),
      selectedProduct && ( React.createElement(PriceComparisonModal, { product: selectedProduct, onClose: () => setSelectedProduct(null) }) ),
      React.createElement("style", null, `
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `)
    )
  );
};
const LoginPage = ({ onLoginSuccess }) => {
  const { t } = useLocalization();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      onLoginSuccess();
    } else {
      setError(t('login.error'));
    }
  };
  return (
    React.createElement("div", { className: "flex items-center justify-center py-12" },
      React.createElement("div", { className: "w-full max-w-md bg-secondary p-8 rounded-2xl shadow-lg" },
        React.createElement("h1", { className: "text-3xl font-bold text-white text-center mb-6" }, t('login.title')),
        React.createElement("form", { onSubmit: handleSubmit, className: "space-y-6" },
          React.createElement("div", null,
            React.createElement("label", { htmlFor: "username", className: "block text-sm font-medium text-light mb-2" }, t('login.username')),
            React.createElement("input", { type: "text", id: "username", value: username, onChange: (e) => setUsername(e.target.value), required: true, className: "w-full py-3 px-4 bg-accent text-highlight rounded-lg focus:outline-none focus:ring-4 focus:ring-brand/50 transition-all duration-300" })
          ),
          React.createElement("div", null,
            React.createElement("label", { htmlFor: "password", className: "block text-sm font-medium text-light mb-2" }, t('login.password')),
            React.createElement("input", { type: "password", id: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "w-full py-3 px-4 bg-accent text-highlight rounded-lg focus:outline-none focus:ring-4 focus:ring-brand/50 transition-all duration-300" })
          ),
          error && React.createElement("p", { className: "text-red-400 text-center" }, error),
          React.createElement("div", null,
            React.createElement("button", { type: "submit", className: "w-full bg-brand text-primary font-bold py-3 px-8 rounded-lg hover:bg-sky-400 transition-colors duration-300" },
              t('login.loginButton')
            )
          )
        )
      )
    )
  );
};

// === ADMIN COMPONENTS ===
const CollapsibleSection = ({ title, description, isOpen, onToggle, children }) => {
  const { language } = useLocalization();
  return (
    React.createElement("div", { className: "bg-secondary rounded-xl shadow-lg overflow-hidden transition-all duration-300" },
      React.createElement("button", { type: "button", onClick: onToggle, className: "w-full flex justify-between items-center p-6 text-left hover:bg-accent/50 transition-colors", "aria-expanded": isOpen, "aria-controls": `collapsible-content-${title.replace(/\s+/g, '-')}` },
        React.createElement("div", { className: language.dir === 'rtl' ? 'text-right' : 'text-left' },
          React.createElement("h2", { className: "text-2xl font-bold text-white" }, title),
          description && React.createElement("p", { className: "text-light mt-1 text-sm" }, description)
        ),
        React.createElement(ChevronDownIcon, { className: `w-6 h-6 text-light transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}` })
      ),
      isOpen && ( React.createElement("div", { id: `collapsible-content-${title.replace(/\s+/g, '-')}`, className: "p-6 border-t border-accent/20" }, children) )
    )
  );
};
const AddProductByUrlModal = ({ isOpen, isLoading, error, onGenerate, onClose }) => {
    const { t } = useLocalization();
    const [url, setUrl] = useState('');
    const modalRef = useRef(null);
    useModalAccessibility(modalRef, isOpen, onClose);

    if (!isOpen) { return null; }
    const handleSubmit = (e) => { e.preventDefault(); if (url) { onGenerate(url); } };
    return (
        React.createElement("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4", onClick: onClose },
            React.createElement("div", { ref: modalRef, className: "bg-secondary rounded-2xl p-6 md:p-8 w-full max-w-lg mx-auto shadow-2xl border border-accent/30", onClick: (e) => e.stopPropagation() },
                React.createElement("div", { className: "flex justify-between items-center mb-6" },
                    React.createElement("h2", { className: "text-2xl font-bold text-white" }, t('admin.productUrlModal.title')),
                    React.createElement("button", { type: "button", onClick: onClose, className: "text-light hover:text-white p-1 rounded-full hover:bg-accent transition-colors", disabled: isLoading }, React.createElement(CloseIcon, { className: "w-6 h-6" }))
                ),
                React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" },
                    React.createElement("div", null, React.createElement("input", { type: "url", name: "productUrl", value: url, onChange: (e) => setUrl(e.target.value), placeholder: t('admin.productUrlModal.placeholder'), required: true, disabled: isLoading, className: "w-full bg-accent text-highlight rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand" })),
                    error && React.createElement("p", { className: "text-red-400 text-sm" }, error),
                    React.createElement("div", { className: "flex justify-end gap-4 pt-4" },
                        React.createElement("button", { type: "button", onClick: onClose, className: "bg-accent text-highlight font-bold py-2 px-6 rounded-lg hover:bg-light hover:text-primary transition-colors", disabled: isLoading }, t('admin.productForm.cancel')),
                        React.createElement("button", { type: "submit", className: "bg-brand text-primary font-bold py-2 px-6 rounded-lg hover:bg-sky-400 transition-colors flex items-center justify-center disabled:bg-accent disabled:cursor-not-allowed", disabled: isLoading || !url },
                            isLoading ? ( React.createElement(React.Fragment, null, React.createElement("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }, React.createElement("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), React.createElement("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })), t('admin.productUrlModal.generating')) ) : t('admin.productUrlModal.generate')
                        )
                    )
                )
            )
        )
    );
};
const BlogFormModal = ({ post, onSave, onClose }) => {
  const { t } = useLocalization();
  const [formData, setFormData] = useState(post || { title: '', author: '', date: new Date().toISOString().split('T')[0], imageUrl: '', content: '' });
  const modalRef = useRef(null);
  useModalAccessibility(modalRef, true, onClose);

  useEffect(() => { setFormData(post || { title: '', author: '', date: new Date().toISOString().split('T')[0], imageUrl: '', content: '' }); }, [post]);
  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
  const title = post && post.id ? t('admin.blogForm.editPostTitle') : t('admin.blogForm.addPostTitle');
  return (
    React.createElement("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4", onClick: onClose },
      React.createElement("div", { ref: modalRef, className: "bg-secondary rounded-2xl p-6 md:p-8 w-full max-w-3xl mx-auto shadow-2xl border border-accent/30 max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation() },
        React.createElement("div", { className: "flex justify-between items-center mb-6" },
          React.createElement("h2", { className: "text-2xl font-bold text-white" }, title),
          React.createElement("button", { type: "button", onClick: onClose, className: "text-light hover:text-white p-1 rounded-full hover:bg-accent transition-colors" }, React.createElement(CloseIcon, { className: "w-6 h-6" }))
        ),
        React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" },
            React.createElement("div", null, React.createElement("label", { htmlFor: "title", className: "block text-sm font-medium text-light mb-1" }, t('admin.blogForm.title')), React.createElement("input", { type: "text", name: "title", id: "title", value: formData.title, onChange: handleChange, required: true, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
          React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
            React.createElement("div", null, React.createElement("label", { htmlFor: "author", className: "block text-sm font-medium text-light mb-1" }, t('admin.blogForm.author')), React.createElement("input", { type: "text", name: "author", id: "author", value: formData.author, onChange: handleChange, required: true, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
            React.createElement("div", null, React.createElement("label", { htmlFor: "date", className: "block text-sm font-medium text-light mb-1" }, t('admin.blogForm.date')), React.createElement("input", { type: "date", name: "date", id: "date", value: formData.date, onChange: handleChange, required: true, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" }))
          ),
            React.createElement("div", null, React.createElement("label", { htmlFor: "imageUrl", className: "block text-sm font-medium text-light mb-1" }, t('admin.blogForm.imageUrl')), React.createElement("input", { type: "url", name: "imageUrl", id: "imageUrl", value: formData.imageUrl, onChange: handleChange, required: true, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
            React.createElement("div", null, React.createElement("label", { htmlFor: "content", className: "block text-sm font-medium text-light mb-1" }, t('admin.blogForm.content')), React.createElement("textarea", { name: "content", id: "content", value: formData.content, onChange: handleChange, required: true, rows: 10, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
          React.createElement("div", { className: "flex justify-end gap-4 pt-4" },
            React.createElement("button", { type: "button", onClick: onClose, className: "bg-accent text-highlight font-bold py-2 px-6 rounded-lg hover:bg-light hover:text-primary transition-colors" }, t('admin.blogForm.cancel')),
            React.createElement("button", { type: "submit", className: "bg-brand text-primary font-bold py-2 px-6 rounded-lg hover:bg-sky-400 transition-colors" }, t('admin.blogForm.save'))
          )
        )
      )
    )
  );
};
const CouponFormModal = ({ coupon, onSave, onClose }) => {
  const { t } = useLocalization();
  const [formData, setFormData] = useState(coupon || { store: '', storeLogoUrl: '', code: '', description: '', expiryDate: '' });
  const modalRef = useRef(null);
  useModalAccessibility(modalRef, true, onClose);
  useEffect(() => { setFormData(coupon || { store: '', storeLogoUrl: '', code: '', description: '', expiryDate: '' }); }, [coupon]);
  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
  const title = coupon && coupon.id ? t('admin.couponForm.editCouponTitle') : t('admin.couponForm.addCouponTitle');
  return (
    React.createElement("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4", onClick: onClose },
      React.createElement("div", { ref: modalRef, className: "bg-secondary rounded-2xl p-6 md:p-8 w-full max-w-lg mx-auto shadow-2xl border border-accent/30", onClick: (e) => e.stopPropagation() },
        React.createElement("div", { className: "flex justify-between items-center mb-6" },
          React.createElement("h2", { className: "text-2xl font-bold text-white" }, title),
          React.createElement("button", { type: "button", onClick: onClose, className: "text-light hover:text-white p-1 rounded-full hover:bg-accent transition-colors" }, React.createElement(CloseIcon, { className: "w-6 h-6" }))
        ),
        React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" },
          React.createElement("div", null, React.createElement("label", { htmlFor: "store", className: "block text-sm font-medium text-light mb-1" }, t('admin.couponForm.store')), React.createElement("input", { type: "text", name: "store", id: "store", value: formData.store, onChange: handleChange, required: true, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
          React.createElement("div", null, React.createElement("label", { htmlFor: "code", className: "block text-sm font-medium text-light mb-1" }, t('admin.couponForm.code')), React.createElement("input", { type: "text", name: "code", id: "code", value: formData.code, onChange: handleChange, required: true, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
          React.createElement("div", null, React.createElement("label", { htmlFor: "description", className: "block text-sm font-medium text-light mb-1" }, t('admin.couponForm.description')), React.createElement("input", { type: "text", name: "description", id: "description", value: formData.description, onChange: handleChange, required: true, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
          React.createElement("div", null, React.createElement("label", { htmlFor: "expiryDate", className: "block text-sm font-medium text-light mb-1" }, t('admin.couponForm.expiryDate')), React.createElement("input", { type: "date", name: "expiryDate", id: "expiryDate", value: formData.expiryDate, onChange: handleChange, required: true, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
          React.createElement("div", null, React.createElement("label", { htmlFor: "storeLogoUrl", className: "block text-sm font-medium text-light mb-1" }, t('admin.couponForm.storeLogoUrl')), React.createElement("input", { type: "url", name: "storeLogoUrl", id: "storeLogoUrl", value: formData.storeLogoUrl, onChange: handleChange, required: true, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
          React.createElement("div", { className: "flex justify-end gap-4 pt-4" },
            React.createElement("button", { type: "button", onClick: onClose, className: "bg-accent text-highlight font-bold py-2 px-6 rounded-lg hover:bg-light hover:text-primary transition-colors" }, t('admin.couponForm.cancel')),
            React.createElement("button", { type: "submit", className: "bg-brand text-primary font-bold py-2 px-6 rounded-lg hover:bg-sky-400 transition-colors" }, t('admin.couponForm.save'))
          )
        )
      )
    )
  );
};
const EarningsDashboard = ({ products, settings }) => {
    const { t, language, currency, convertPrice } = useLocalization();
    const totalProductValueSAR = products.reduce((sum, product) => sum + product.price, 0);
    const commissionRate = settings.affiliateCommissionRate || 0;
    const estimatedCommissionSAR = totalProductValueSAR * (commissionRate / 100);
    const displayTotalValue = convertPrice(totalProductValueSAR);
    const displayEstimatedCommission = convertPrice(estimatedCommissionSAR);
    return (
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
            React.createElement("div", { className: "bg-accent p-6 rounded-lg" },
                React.createElement("h3", { className: "text-light font-semibold mb-2" }, t('admin.totalValue')),
                React.createElement("p", { className: "text-3xl font-black text-white", lang: "en", dir: "ltr" }, formatCurrency(displayTotalValue, currency.code, language.code))
            ),
            React.createElement("div", { className: "bg-accent p-6 rounded-lg" },
                React.createElement("h3", { className: "text-light font-semibold mb-2" }, `${t('admin.estimatedEarnings')} (${commissionRate}%)`),
                React.createElement("p", { className: "text-3xl font-black text-white", lang: "en", dir: "ltr" }, formatCurrency(displayEstimatedCommission, currency.code, language.code))
            )
        )
    );
};
const MonetizationSettings = ({ settings, onSave }) => {
    const { t } = useLocalization();
    const [formData, setFormData] = useState(settings);
    const [saveMessage, setSaveMessage] = useState('');
    const handleChange = (e) => { const { name, value, type } = e.target; setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value })); };
    const handleCheckboxChange = (e) => { const { name, checked } = e.target; setFormData(prev => ({ ...prev, [name]: checked })); };
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); setSaveMessage(t('admin.settingsSaved')); setTimeout(() => setSaveMessage(''), 3000); };
    return (
        React.createElement("form", { onSubmit: handleSubmit, className: "space-y-6" },
            React.createElement("div", { className: "flex items-center" }, React.createElement("input", { type: "checkbox", name: "showAds", id: "showAds", checked: formData.showAds, onChange: handleCheckboxChange, className: "w-5 h-5 rounded bg-accent border-accent text-brand focus:ring-brand" }), React.createElement("label", { htmlFor: "showAds", className: "mx-3 text-sm font-medium text-highlight" }, t('admin.showAds'))),
            React.createElement("div", null, React.createElement("label", { htmlFor: "googleAdSenseId", className: "block text-sm font-medium text-light mb-1" }, t('admin.adsenseId')), React.createElement("input", { type: "text", name: "googleAdSenseId", id: "googleAdSenseId", value: formData.googleAdSenseId || '', onChange: handleChange, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand", placeholder: "ca-pub-..." })),
            React.createElement("div", null, React.createElement("label", { htmlFor: "facebookPixelId", className: "block text-sm font-medium text-light mb-1" }, t('admin.pixelId')), React.createElement("input", { type: "text", name: "facebookPixelId", id: "facebookPixelId", value: formData.facebookPixelId || '', onChange: handleChange, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand", placeholder: "Your Pixel ID" })),
            React.createElement("div", null, React.createElement("label", { htmlFor: "affiliateCommissionRate", className: "block text-sm font-medium text-light mb-1" }, t('admin.commissionRate')), React.createElement("input", { type: "number", name: "affiliateCommissionRate", id: "affiliateCommissionRate", value: formData.affiliateCommissionRate || 0, onChange: handleChange, step: "0.1", min: "0", max: "100", className: "w-full max-w-xs bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
            React.createElement("div", { className: "flex items-center gap-4" },
                React.createElement("button", { type: "submit", className: "bg-brand text-primary font-bold py-2 px-6 rounded-lg hover:bg-sky-400 transition-colors" }, t('admin.saveSettings')),
                saveMessage && React.createElement("p", { className: "text-green-400 animate-pulse" }, saveMessage)
            )
        )
    );
};
const ProductFormModal = ({ product, onSave, onClose }) => {
  const { t } = useLocalization();
  const [formData, setFormData] = useState(product || { name: '', description: '', category: categories[0]?.key || '', price: 0, originalPrice: undefined, imageUrl: '', rating: 0, reviewCount: 0, store: '', affiliateLink: '', priceComparison: [] });
  const modalRef = useRef(null);
  useModalAccessibility(modalRef, true, onClose);
  useEffect(() => { setFormData(product || { name: '', description: '', category: categories[0]?.key || '', price: 0, originalPrice: undefined, imageUrl: '', rating: 0, reviewCount: 0, store: '', affiliateLink: '', priceComparison: [] }); }, [product]);
  const handleChange = (e) => { const { name, value, type } = e.target; let processedValue = value; if (type === 'number') { processedValue = value === '' ? undefined : parseFloat(value); } setFormData(prev => ({ ...prev, [name]: processedValue })); };
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
  const title = product && product.id ? t('admin.productForm.editProductTitle') : t('admin.productForm.addProductTitle');
  return (
    React.createElement("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4", onClick: onClose },
      React.createElement("div", { ref: modalRef, className: "bg-secondary rounded-2xl p-6 md:p-8 w-full max-w-2xl mx-auto shadow-2xl border border-accent/30 max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation() },
        React.createElement("div", { className: "flex justify-between items-center mb-6" }, React.createElement("h2", { className: "text-2xl font-bold text-white" }, title), React.createElement("button", { type: "button", onClick: onClose, className: "text-light hover:text-white p-1 rounded-full hover:bg-accent transition-colors" }, React.createElement(CloseIcon, { className: "w-6 h-6" }))),
        React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" },
          React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
            React.createElement("div", null, React.createElement("label", { htmlFor: "name", className: "block text-sm font-medium text-light mb-1" }, t('admin.productForm.name')), React.createElement("input", { type: "text", name: "name", id: "name", value: formData.name, onChange: handleChange, required: true, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
            React.createElement("div", null, React.createElement("label", { htmlFor: "category", className: "block text-sm font-medium text-light mb-1" }, t('admin.productForm.category')), React.createElement("select", { name: "category", id: "category", value: formData.category, onChange: handleChange, required: true, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" }, categories.map(cat => React.createElement("option", { key: cat.key, value: cat.key }, t(`categories.${cat.key}`))))),
            React.createElement("div", null, React.createElement("label", { htmlFor: "price", className: "block text-sm font-medium text-light mb-1" }, t('admin.productForm.price')), React.createElement("input", { type: "number", name: "price", id: "price", value: formData.price, onChange: handleChange, required: true, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
            React.createElement("div", null, React.createElement("label", { htmlFor: "originalPrice", className: "block text-sm font-medium text-light mb-1" }, t('admin.productForm.originalPrice')), React.createElement("input", { type: "number", name: "originalPrice", id: "originalPrice", value: formData.originalPrice || '', onChange: handleChange, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
            React.createElement("div", null, React.createElement("label", { htmlFor: "store", className: "block text-sm font-medium text-light mb-1" }, t('admin.productForm.store')), React.createElement("input", { type: "text", name: "store", id: "store", value: formData.store, onChange: handleChange, required: true, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
            React.createElement("div", null, React.createElement("label", { htmlFor: "affiliateLink", className: "block text-sm font-medium text-light mb-1" }, t('admin.productForm.affiliateLink')), React.createElement("input", { type: "url", name: "affiliateLink", id: "affiliateLink", value: formData.affiliateLink, onChange: handleChange, required: true, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
            React.createElement("div", { className: "md:col-span-2" }, React.createElement("label", { htmlFor: "imageUrl", className: "block text-sm font-medium text-light mb-1" }, t('admin.productForm.imageUrl')), React.createElement("input", { type: "url", name: "imageUrl", id: "imageUrl", value: formData.imageUrl, onChange: handleChange, required: true, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
            React.createElement("div", { className: "md:col-span-2" }, React.createElement("label", { htmlFor: "description", className: "block text-sm font-medium text-light mb-1" }, t('admin.productForm.description')), React.createElement("textarea", { name: "description", id: "description", value: formData.description, onChange: handleChange, required: true, rows: 3, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" }))
          ),
          React.createElement("div", { className: "flex justify-end gap-4 pt-4" }, React.createElement("button", { type: "button", onClick: onClose, className: "bg-accent text-highlight font-bold py-2 px-6 rounded-lg hover:bg-light hover:text-primary transition-colors" }, t('admin.productForm.cancel')), React.createElement("button", { type: "submit", className: "bg-brand text-primary font-bold py-2 px-6 rounded-lg hover:bg-sky-400 transition-colors" }, t('admin.productForm.save')))
        )
      )
    )
  );
};
const SiteSettings = ({ settings, onSave }) => {
    const { t } = useLocalization();
    const [formData, setFormData] = useState(settings);
    const [saveMessage, setSaveMessage] = useState('');
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: name === 'copyrightYear' ? parseInt(value, 10) || new Date().getFullYear() : value })); };
    const handleCheckboxChange = (e) => { const { name, checked } = e.target; setFormData(prev => ({ ...prev, [name]: checked })); };
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); setSaveMessage(t('admin.settingsSaved')); setTimeout(() => setSaveMessage(''), 3000); };
    return (
        React.createElement("form", { onSubmit: handleSubmit, className: "space-y-6" },
            React.createElement("div", null, React.createElement("label", { htmlFor: "aboutUs", className: "block text-sm font-medium text-light mb-1" }, t('admin.aboutUs')), React.createElement("textarea", { name: "aboutUs", id: "aboutUs", value: formData.aboutUs, onChange: handleChange, rows: 5, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
            React.createElement("div", null, React.createElement("label", { htmlFor: "privacyPolicy", className: "block text-sm font-medium text-light mb-1" }, t('admin.privacyPolicy')), React.createElement("textarea", { name: "privacyPolicy", id: "privacyPolicy", value: formData.privacyPolicy, onChange: handleChange, rows: 5, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
            React.createElement("div", null, React.createElement("label", { htmlFor: "copyrightYear", className: "block text-sm font-medium text-light mb-1" }, t('admin.copyrightYear')), React.createElement("input", { type: "number", name: "copyrightYear", id: "copyrightYear", value: formData.copyrightYear, onChange: handleChange, className: "w-full max-w-xs bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
            React.createElement("div", { className: "mt-8 border-t border-accent/20 pt-6" },
                React.createElement("h3", { className: "text-xl font-bold text-white mb-2" }, t('admin.siteVisibility')), React.createElement("p", { className: "text-light mb-4" }, t('admin.siteVisibilityDesc')),
                React.createElement("div", { className: "space-y-4" },
                    React.createElement("div", { className: "flex items-center" }, React.createElement("input", { type: "checkbox", name: "showBlogSection", id: "showBlogSection", checked: formData.showBlogSection, onChange: handleCheckboxChange, className: "w-5 h-5 rounded bg-accent border-accent text-brand focus:ring-brand" }), React.createElement("label", { htmlFor: "showBlogSection", className: "mx-3 text-sm font-medium text-highlight" }, t('admin.showBlogSection'))),
                    React.createElement("div", { className: "flex items-center" }, React.createElement("input", { type: "checkbox", name: "showCouponsSection", id: "showCouponsSection", checked: formData.showCouponsSection, onChange: handleCheckboxChange, className: "w-5 h-5 rounded bg-accent border-accent text-brand focus:ring-brand" }), React.createElement("label", { htmlFor: "showCouponsSection", className: "mx-3 text-sm font-medium text-highlight" }, t('admin.showCouponsSection')))
                )
            ),
            React.createElement("div", { className: "flex items-center gap-4 pt-4" },
                React.createElement("button", { type: "submit", className: "bg-brand text-primary font-bold py-2 px-6 rounded-lg hover:bg-sky-400 transition-colors" }, t('admin.saveSettings')),
                saveMessage && React.createElement("p", { className: "text-green-400 animate-pulse" }, saveMessage)
            )
        )
    );
};
const UserFormModal = ({ user, onSave, onClose }) => {
  const { t } = useLocalization();
  const [formData, setFormData] = useState(user ? { ...user, password: '' } : { username: '', password: '', role: 'EDITOR' });
  const modalRef = useRef(null);
  useModalAccessibility(modalRef, true, onClose);
  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
  const isEditing = user && user.id;
  const title = isEditing ? t('admin.userForm.editUserTitle') : t('admin.userForm.addUserTitle');
  return (
    React.createElement("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4", onClick: onClose },
      React.createElement("div", { ref: modalRef, className: "bg-secondary rounded-2xl p-6 md:p-8 w-full max-w-md mx-auto shadow-2xl border border-accent/30", onClick: (e) => e.stopPropagation() },
        React.createElement("div", { className: "flex justify-between items-center mb-6" }, React.createElement("h2", { className: "text-2xl font-bold text-white" }, title), React.createElement("button", { type: "button", onClick: onClose, className: "text-light hover:text-white p-1 rounded-full hover:bg-accent transition-colors" }, React.createElement(CloseIcon, { className: "w-6 h-6" }))),
        React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" },
          React.createElement("div", null, React.createElement("label", { htmlFor: "username", className: "block text-sm font-medium text-light mb-1" }, t('admin.username')), React.createElement("input", { type: "text", name: "username", id: "username", value: formData.username, onChange: handleChange, required: true, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
          React.createElement("div", null, React.createElement("label", { htmlFor: "password", className: "block text-sm font-medium text-light mb-1" }, t('admin.userForm.password')), React.createElement("input", { type: "password", name: "password", id: "password", value: formData.password, onChange: handleChange, placeholder: isEditing ? t('admin.userForm.passwordHint') : '', required: !isEditing, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" })),
          React.createElement("div", null, React.createElement("label", { htmlFor: "role", className: "block text-sm font-medium text-light mb-1" }, t('admin.userForm.role')), React.createElement("select", { name: "role", id: "role", value: formData.role, onChange: handleChange, required: true, className: "w-full bg-accent text-highlight rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand" }, React.createElement("option", { value: "ADMIN" }, t('admin.roles.ADMIN')), React.createElement("option", { value: "EDITOR" }, t('admin.roles.EDITOR')))),
          React.createElement("div", { className: "flex justify-end gap-4 pt-4" }, React.createElement("button", { type: "button", onClick: onClose, className: "bg-accent text-highlight font-bold py-2 px-6 rounded-lg hover:bg-light hover:text-primary transition-colors" }, t('admin.userForm.cancel')), React.createElement("button", { type: "submit", className: "bg-brand text-primary font-bold py-2 px-6 rounded-lg hover:bg-sky-400 transition-colors" }, t('admin.userForm.save')))
        )
      )
    )
  );
};
const UserManagement = () => {
    const { t } = useLocalization();
    const { users, addUser, updateUser, deleteUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(undefined);
    const handleAddNew = () => { setEditingUser(undefined); setIsModalOpen(true); };
    const handleEdit = (user) => { setEditingUser(user); setIsModalOpen(true); };
    const handleDelete = (userId) => { if (window.confirm(t('admin.deleteConfirm'))) { deleteUser(userId); } };
    const handleSave = (user) => { if (user.id) { updateUser(user); } else { addUser(user); } setIsModalOpen(false); };
    return (
        React.createElement(React.Fragment, null,
            React.createElement("div", { className: "flex justify-end items-center mb-6" }, React.createElement("button", { type: "button", onClick: handleAddNew, className: "bg-brand text-primary font-bold py-2 px-4 rounded-lg hover:bg-sky-400 transition-colors" }, t('admin.addNewUser'))),
            React.createElement("div", { className: "bg-primary p-4 rounded-xl shadow-inner" },
                React.createElement("div", { className: "overflow-x-auto" },
                    React.createElement("table", { className: "w-full text-sm text-left text-light" },
                        React.createElement("thead", { className: "text-xs text-highlight uppercase bg-accent" }, React.createElement("tr", null, React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('admin.username')), React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('admin.role')), React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('admin.actions')))),
                        React.createElement("tbody", null, users.map(user => ( React.createElement("tr", { key: user.id, className: "border-b border-accent" }, React.createElement("td", { className: "px-6 py-4 font-medium text-white whitespace-nowrap" }, user.username), React.createElement("td", { className: "px-6 py-4" }, React.createElement("span", { className: `px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-sky-500 text-sky-100' : 'bg-green-500 text-green-100'}` }, t(`admin.roles.${user.role}`))), React.createElement("td", { className: "px-6 py-4 flex gap-4" }, React.createElement("button", { type: "button", onClick: () => handleEdit(user), className: "font-medium text-brand hover:underline" }, t('admin.edit')), React.createElement("button", { type: "button", onClick: () => handleDelete(user.id), className: "font-medium text-red-500 hover:underline" }, t('admin.delete')))) )))
                    )
                )
            ),
            isModalOpen && ( React.createElement(UserFormModal, { user: editingUser, onSave: handleSave, onClose: () => setIsModalOpen(false) }) )
        )
    );
};
const AdminPanel = ({ products, coupons, siteSettings, onSaveProduct, onDeleteProduct, onSaveCoupon, onDeleteCoupon, onSaveSiteSettings, onLogout }) => {
  const { t, language, currency, convertPrice } = useLocalization();
  const { currentUser, logout } = useAuth();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(undefined);
  const [editingCoupon, setEditingCoupon] = useState(undefined);
  const [editingPost, setEditingPost] = useState(undefined);
  const [openAdminSection, setOpenAdminSection] = useState('products');
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const toggleAdminSection = (sectionName) => { setOpenAdminSection(prev => (prev === sectionName ? null : sectionName)); };
  const handleLogout = () => { logout(); onLogout(); };
  const handleAddNewProduct = () => { setEditingProduct(undefined); setIsProductModalOpen(true); };
  const handleEditProduct = (product) => { setEditingProduct(product); setIsProductModalOpen(true); };
  const handleProductModalClose = () => { setIsProductModalOpen(false); setEditingProduct(undefined); };
  const handleProductSave = (product) => { onSaveProduct(product); handleProductModalClose(); };
  const handleAddNewCoupon = () => { setEditingCoupon(undefined); setIsCouponModalOpen(true); };
  const handleEditCoupon = (coupon) => { setEditingCoupon(coupon); setIsCouponModalOpen(true); };
  const handleCouponModalClose = () => { setIsCouponModalOpen(false); setEditingCoupon(undefined); };
  const handleCouponSave = (coupon) => { onSaveCoupon(coupon); handleCouponModalClose(); };
  const handleAddNewPost = () => { setEditingPost(undefined); setIsBlogModalOpen(true); };
  const handleEditPost = (post) => { setEditingPost(post); setIsBlogModalOpen(true); };
  const handleBlogModalClose = () => { setIsBlogModalOpen(false); setEditingPost(undefined); };
  const handleBlogSave = (postToSave) => {
    const currentPosts = siteSettings.blogPosts || [];
    let updatedPosts;
    if (postToSave.id && currentPosts.some(p => p.id === postToSave.id)) {
      updatedPosts = currentPosts.map(p => p.id === postToSave.id ? postToSave : p);
    } else {
      const newPost = { ...postToSave, id: Date.now() };
      updatedPosts = [...currentPosts, newPost];
    }
    onSaveSiteSettings({ ...siteSettings, blogPosts: updatedPosts });
    handleBlogModalClose();
  };
  const handleDeletePost = (postId) => {
    if (window.confirm(t('admin.deleteConfirm'))) {
        const updatedPosts = siteSettings.blogPosts.filter(p => p.id !== postId);
        onSaveSiteSettings({ ...siteSettings, blogPosts: updatedPosts });
    }
  };
  const handleGenerateFromUrl = async (url) => {
    setIsGenerating(true); setGenerationError('');
    try {
        const productData = await generateProductFromUrl(url, language.code);
        setEditingProduct(productData); setIsUrlModalOpen(false); setIsProductModalOpen(true);
    } catch (error) {
        console.error(error); setGenerationError(t('admin.productUrlModal.error'));
    } finally {
        setIsGenerating(false);
    }
  };
  const handleAutomationToggle = (e) => {
    const { checked } = e.target;
    onSaveSiteSettings({ ...siteSettings, enableAutoAdd: checked });
  };
  if (!currentUser) return null;
  return (
    React.createElement("div", { className: "container mx-auto px-4 py-8" },
      React.createElement("div", { className: "flex justify-between items-center mb-8" },
        React.createElement("h1", { className: "text-4xl font-bold text-white" }, t('admin.panelTitle')),
        React.createElement("button", { type: "button", onClick: handleLogout, className: "bg-accent text-highlight font-bold py-2 px-6 rounded-lg hover:bg-light hover:text-primary transition-colors" }, t('admin.logout'))
      ),
      React.createElement("div", { className: "space-y-6" },
        React.createElement(CollapsibleSection, { title: t('admin.manageProducts'), isOpen: openAdminSection === 'products', onToggle: () => toggleAdminSection('products') },
            React.createElement("div", { className: "flex justify-end items-center mb-6 gap-4" }, 
                React.createElement("button", { type: "button", onClick: () => setIsUrlModalOpen(true), className: "bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors" }, t('admin.addProductByUrl')),
                React.createElement("button", { type: "button", onClick: handleAddNewProduct, className: "bg-brand text-primary font-bold py-2 px-4 rounded-lg hover:bg-sky-400 transition-colors" }, t('admin.addNewProduct'))
            ),
            React.createElement("div", { className: "bg-primary p-4 rounded-xl shadow-inner overflow-x-auto" },
                React.createElement("table", { className: "w-full text-sm text-left text-light" },
                    React.createElement("thead", { className: "text-xs text-highlight uppercase bg-accent" }, 
                        React.createElement("tr", null, 
                            React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('admin.productName')), 
                            React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('admin.category')), 
                            React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('admin.price')), 
                            React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('admin.actions'))
                        )
                    ),
                    React.createElement("tbody", null, products.map(p => ( 
                        React.createElement("tr", { key: p.id, className: "border-b border-accent" },
                            React.createElement("td", { className: "px-6 py-4 font-medium text-white" }, p.name || t(`products.${p.id}.name`)),
                            React.createElement("td", { className: "px-6 py-4" }, t(`categories.${p.category}`)),
                            React.createElement("td", { className: "px-6 py-4" }, formatCurrency(convertPrice(p.price), currency.code, language.code)),
                            React.createElement("td", { className: "px-6 py-4 flex gap-4" }, 
                                React.createElement("button", { type: "button", onClick: () => handleEditProduct(p), className: "font-medium text-brand hover:underline" }, t('admin.edit')), 
                                React.createElement("button", { type: "button", onClick: () => onDeleteProduct(p.id), className: "font-medium text-red-500 hover:underline" }, t('admin.delete'))
                            )
                        )
                    )))
                )
            )
        ),
        React.createElement(CollapsibleSection, { title: t('admin.manageCoupons'), isOpen: openAdminSection === 'coupons', onToggle: () => toggleAdminSection('coupons') },
            React.createElement("div", { className: "flex justify-end items-center mb-6" }, React.createElement("button", { type: "button", onClick: handleAddNewCoupon, className: "bg-brand text-primary font-bold py-2 px-4 rounded-lg hover:bg-sky-400 transition-colors" }, t('admin.addNewCoupon'))),
            React.createElement("div", { className: "bg-primary p-4 rounded-xl shadow-inner overflow-x-auto" },
                React.createElement("table", { className: "w-full text-sm text-left text-light" },
                    React.createElement("thead", { className: "text-xs text-highlight uppercase bg-accent" }, 
                        React.createElement("tr", null, 
                            React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('admin.store')), 
                            React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('admin.code')), 
                            React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('admin.description')), 
                            React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('admin.actions'))
                        )
                    ),
                    React.createElement("tbody", null, coupons.map(c => ( 
                        React.createElement("tr", { key: c.id, className: "border-b border-accent" },
                            React.createElement("td", { className: "px-6 py-4 font-medium text-white" }, c.store),
                            React.createElement("td", { className: "px-6 py-4 font-mono text-brand" }, c.code),
                            React.createElement("td", { className: "px-6 py-4" }, c.description),
                            React.createElement("td", { className: "px-6 py-4 flex gap-4" }, 
                                React.createElement("button", { type: "button", onClick: () => handleEditCoupon(c), className: "font-medium text-brand hover:underline" }, t('admin.edit')), 
                                React.createElement("button", { type: "button", onClick: () => onDeleteCoupon(c.id), className: "font-medium text-red-500 hover:underline" }, t('admin.delete'))
                            )
                        )
                    )))
                )
            )
        ),
        React.createElement(CollapsibleSection, { title: t('admin.manageBlog'), isOpen: openAdminSection === 'blog', onToggle: () => toggleAdminSection('blog') },
            React.createElement("div", { className: "flex justify-end items-center mb-6" }, React.createElement("button", { type: "button", onClick: handleAddNewPost, className: "bg-brand text-primary font-bold py-2 px-4 rounded-lg hover:bg-sky-400 transition-colors" }, t('admin.addNewPost'))),
            React.createElement("div", { className: "bg-primary p-4 rounded-xl shadow-inner overflow-x-auto" },
                React.createElement("table", { className: "w-full text-sm text-left text-light" },
                    React.createElement("thead", { className: "text-xs text-highlight uppercase bg-accent" }, 
                        React.createElement("tr", null, 
                            React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('admin.postTitle')), 
                            React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('admin.author')), 
                            React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('admin.date')), 
                            React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('admin.actions'))
                        )
                    ),
                    React.createElement("tbody", null, (siteSettings.blogPosts || []).map(p => ( 
                        React.createElement("tr", { key: p.id, className: "border-b border-accent" },
                            React.createElement("td", { className: "px-6 py-4 font-medium text-white" }, p.title),
                            React.createElement("td", { className: "px-6 py-4" }, p.author),
                            React.createElement("td", { className: "px-6 py-4" }, p.date),
                            React.createElement("td", { className: "px-6 py-4 flex gap-4" }, 
                                React.createElement("button", { type: "button", onClick: () => handleEditPost(p), className: "font-medium text-brand hover:underline" }, t('admin.edit')), 
                                React.createElement("button", { type: "button", onClick: () => handleDeletePost(p.id), className: "font-medium text-red-500 hover:underline" }, t('admin.delete'))
                            )
                        )
                    )))
                )
            )
        ),
        currentUser.role === 'ADMIN' && React.createElement(CollapsibleSection, { title: t('admin.manageUsers'), isOpen: openAdminSection === 'users', onToggle: () => toggleAdminSection('users') }, React.createElement(UserManagement, null)),
        React.createElement(CollapsibleSection, { title: t('admin.manageSite'), description: t('admin.manageSiteDesc'), isOpen: openAdminSection === 'site', onToggle: () => toggleAdminSection('site') }, React.createElement(SiteSettings, { settings: siteSettings, onSave: onSaveSiteSettings })),
        React.createElement(CollapsibleSection, { title: t('admin.monetization'), description: t('admin.monetizationDesc'), isOpen: openAdminSection === 'monetization', onToggle: () => toggleAdminSection('monetization') }, React.createElement(MonetizationSettings, { settings: siteSettings, onSave: onSaveSiteSettings })),
        React.createElement(CollapsibleSection, { title: t('admin.earningsDashboard'), description: `${t('admin.earningsDesc')} ${t('admin.productCount', { count: products.length })}`, isOpen: openAdminSection === 'earnings', onToggle: () => toggleAdminSection('earnings') }, React.createElement(EarningsDashboard, { products, settings: siteSettings })),
        React.createElement(CollapsibleSection, { title: t('admin.automationSettings'), description: t('admin.automationSettingsDesc'), isOpen: openAdminSection === 'automation', onToggle: () => toggleAdminSection('automation') },
          React.createElement("div", { className: "flex items-center" }, 
            React.createElement("input", { type: "checkbox", name: "enableAutoAdd", id: "enableAutoAdd", checked: !!siteSettings.enableAutoAdd, onChange: handleAutomationToggle, className: "w-5 h-5 rounded bg-accent border-accent text-brand focus:ring-brand" }),
            React.createElement("label", { htmlFor: "enableAutoAdd", className: "mx-3 flex flex-col" }, 
              React.createElement("span", { className: "text-sm font-medium text-highlight" }, t('admin.enableAutoAdd')),
              React.createElement("p", { className: "text-xs text-light" }, t('admin.enableAutoAddDesc'))
            )
          )
        )
      ),
      isProductModalOpen && React.createElement(ProductFormModal, { product: editingProduct, onSave: handleProductSave, onClose: handleProductModalClose }),
      isCouponModalOpen && React.createElement(CouponFormModal, { coupon: editingCoupon, onSave: handleCouponSave, onClose: handleCouponModalClose }),
      isBlogModalOpen && React.createElement(BlogFormModal, { post: editingPost, onSave: handleBlogSave, onClose: handleBlogModalClose }),
      isUrlModalOpen && React.createElement(AddProductByUrlModal, { isOpen: isUrlModalOpen, isLoading: isGenerating, error: generationError, onGenerate: handleGenerateFromUrl, onClose: () => setIsUrlModalOpen(false) })
    )
  );
};
const App = () => {
  const { currentUser } = useAuth();
  const { t } = useLocalization();
  const [view, setView] = useState(currentUser ? 'admin-panel' : 'home');
  const [products, setProducts] = useState(() => getStoredData('products', initialProducts));
  const [coupons, setCoupons] = useState(() => getStoredData('coupons', initialCoupons));
  const [siteSettings, setSiteSettings] = useState(() => getStoredData('siteSettings', initialSiteSettings));
  const [wishlist, setWishlist] = useState(() => getStoredData('wishlist', []));
  const [infoModal, setInfoModal] = useState({ isOpen: false, title: '', content: '' });
  const [blogPostModal, setBlogPostModal] = useState({ isOpen: false, post: null });
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const { addNotification } = useNotification();
  const autoAddIntervalRef = useRef(null);
  const categoriesRef = useRef(null);
  const blogRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  const handleInstallClick = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredInstallPrompt(null);
    }
  };
  const saveData = (key, data) => { localStorage.setItem(key, JSON.stringify(data)); };
  useEffect(() => { saveData('products', products); }, [products]);
  useEffect(() => { saveData('coupons', coupons); }, [coupons]);
  useEffect(() => { saveData('siteSettings', siteSettings); }, [siteSettings]);
  useEffect(() => { saveData('wishlist', wishlist); }, [wishlist]);
  const handleAutoAddDeal = useCallback(async () => {
      console.log("Attempting to auto-add a new deal...");
      try {
          const existingNames = products.map(p => p.name || t(`products.${p.id}.name`));
          const newDealData = await generateNewDeal('en', existingNames);
          if (newDealData) {
              const newProduct = {
                  ...newDealData,
                  id: Date.now(),
                  rating: (Math.random() * (5 - 4.5) + 4.5).toFixed(1),
                  reviewCount: Math.floor(Math.random() * 2000) + 50,
                  affiliateLink: 'https://www.example.com',
                  priceComparison: []
              };
              setProducts(prev => [...prev, newProduct]);
              addNotification(t('notifications.newProductAdded', { productName: newProduct.name }));
              console.log("Successfully added new deal:", newProduct);
          }
      } catch (error) {
          console.error("Failed to auto-add new deal:", error);
      }
  }, [products, addNotification, t]);
  useEffect(() => {
    if (siteSettings.enableAutoAdd) {
        if (!autoAddIntervalRef.current) {
            handleAutoAddDeal();
            autoAddIntervalRef.current = setInterval(handleAutoAddDeal, 60000);
        }
    } else {
        if (autoAddIntervalRef.current) {
            clearInterval(autoAddIntervalRef.current);
            autoAddIntervalRef.current = null;
        }
    }
    return () => { if (autoAddIntervalRef.current) { clearInterval(autoAddIntervalRef.current); } };
  }, [siteSettings.enableAutoAdd, handleAutoAddDeal]);
  const toggleWishlist = (productId) => { setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]); };
  const handleSaveProduct = (product) => {
    let newProduct;
    setProducts(prev => {
        if (product.id) {
            return prev.map(p => p.id === product.id ? product : p);
        }
        newProduct = { ...product, id: Date.now() };
        addNotification(t('notifications.newProductAdded', { productName: newProduct.name }));
        return [...prev, newProduct];
    });
  };
  const handleDeleteProduct = (productId) => { setProducts(prev => prev.filter(p => p.id !== productId)); };
  const handleSaveCoupon = (coupon) => { setCoupons(prev => { if (coupon.id) { return prev.map(c => c.id === coupon.id ? coupon : c); } return [...prev, { ...coupon, id: Date.now() }]; }); };
  const handleDeleteCoupon = (couponId) => { setCoupons(prev => prev.filter(c => c.id !== couponId)); };
  const handleSaveSiteSettings = (settings) => { setSiteSettings(settings); };
  const navigate = (view) => {
    if (view === 'about') {
      setInfoModal({ isOpen: true, title: t('footer.about'), content: siteSettings.aboutUs });
    } else if (view === 'privacy') {
      setInfoModal({ isOpen: true, title: t('footer.privacy'), content: siteSettings.privacyPolicy });
    } else {
      setView(view);
      window.scrollTo(0, 0);
    }
  };
  const handleViewPost = (post) => { setBlogPostModal({ isOpen: true, post: post }); };
  const content = () => {
    if (view === 'admin-panel' && currentUser) return React.createElement(AdminPanel, { products, coupons, siteSettings, onSaveProduct: handleSaveProduct, onDeleteProduct: handleDeleteProduct, onSaveCoupon: handleSaveCoupon, onDeleteCoupon: handleDeleteCoupon, onSaveSiteSettings: handleSaveSiteSettings, onLogout: () => setView('home') });
    if (view === 'admin') return React.createElement(LoginPage, { onLoginSuccess: () => setView('admin-panel') });
    return React.createElement(HomePage, { view, products, coupons, wishlist, toggleWishlist, setView, categoriesRef, blogRef, siteSettings, onViewPost: handleViewPost });
  };
  return (
    React.createElement("div", { className: "min-h-screen flex flex-col" },
      React.createElement(Header, {
        wishlistCount: wishlist.length,
        onNavigate: navigate,
        onGoToCategories: () => categoriesRef.current?.scrollIntoView({ behavior: 'smooth' }),
        onGoToBlog: () => blogRef.current?.scrollIntoView({ behavior: 'smooth' }),
        siteSettings: siteSettings
      }),
      React.createElement("main", { className: "container mx-auto px-4 py-8 flex-grow" }, content()),
      React.createElement(Footer, { onNavigate: navigate, siteSettings: siteSettings }),
      infoModal.isOpen && React.createElement(InfoModal, { title: infoModal.title, content: infoModal.content, onClose: () => setInfoModal({ isOpen: false, title: '', content: '' }) }),
      blogPostModal.isOpen && React.createElement(BlogPostModal, { post: blogPostModal.post, onClose: () => setBlogPostModal({ isOpen: false, post: null }) }),
      deferredInstallPrompt && React.createElement(InstallPWAButton, { onInstall: handleInstallClick })
    )
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(AuthProvider, null,
      React.createElement(LocalizationProvider, null,
          React.createElement(NotificationProvider, null,
            React.createElement(App, null)
          )
      )
    )
  )
);
