import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPortal } from './components/AdminPortal';
import { YardEstimatorModal } from './components/YardEstimatorModal';
import { LightboxModal } from './components/LightboxModal';
import { CustomerReviews } from './components/CustomerReviews';
import { WhyShopWithUs } from './components/WhyShopWithUs';
import { DeliverySection } from './components/DeliverySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Product, CartItem, CategoryId } from './types';
import { StoreService } from './services/storeService';
import { STORE_INFO } from './data/initialData';
import { 
  MessageCircle, 
  Sparkles, 
  Filter, 
  SearchX, 
  CheckCircle,
  PackageCheck
} from 'lucide-react';

const CART_STORAGE_KEY = 'ayobami_sam_cart_v2';

export const App: React.FC = () => {
  // Products state
  const [products, setProducts] = useState<Product[]>(() => StoreService.getLocalProducts());
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState<{ isOpen: boolean; imageUrl: string; title: string }>({
    isOpen: false,
    imageUrl: '',
    title: '',
  });

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse cart storage:', e);
    }
    return [];
  });

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart storage:', e);
    }
  }, [cartItems]);

  // Initial load from Firestore
  useEffect(() => {
    StoreService.fetchFirestoreProducts().then((res) => {
      if (res.products && res.products.length > 0) {
        setProducts(res.products);
      }
    });
  }, []);

  // Compute category item counts
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category match
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inName = prod.name.toLowerCase().includes(query);
        const inCategory = (prod.categoryLabel || '').toLowerCase().includes(query);
        const inDesc = (prod.description || '').toLowerCase().includes(query);
        const inMaterial = (prod.material || '').toLowerCase().includes(query);
        const inColors = (prod.colors || []).some(c => c.toLowerCase().includes(query));
        const inFeatures = (prod.features || []).some(f => f.toLowerCase().includes(query));
        return inName || inCategory || inDesc || inMaterial || inColors || inFeatures;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  // Cart actions
  const handleAddToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (it) => it.product.id === product.id && it.selectedColor === selectedColor
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedColor }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number, color?: string) => {
    if (quantity <= 0) {
      handleRemoveItem(productId, color);
      return;
    }
    setCartItems((prev) =>
      prev.map((it) => {
        if (it.product.id === productId && it.selectedColor === color) {
          return { ...it, quantity };
        }
        return it;
      })
    );
  };

  const handleRemoveItem = (productId: string, color?: string) => {
    setCartItems((prev) =>
      prev.filter((it) => !(it.product.id === productId && it.selectedColor === color))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOpenLightbox = (imageUrl: string, title: string) => {
    setLightboxData({
      isOpen: true,
      imageUrl,
      title,
    });
  };

  const cartTotalCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Header */}
      <Header
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenEstimator={() => setIsEstimatorOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            const el = document.getElementById('catalog');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenEstimator={() => setIsEstimatorOpen(true)}
        />

        {/* Categories Bar */}
        <CategoryGrid
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          productCounts={productCounts}
        />

        {/* Product Catalog Section */}
        <section id="catalog" className="py-8 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-serif font-bold text-stone-950">
                  {selectedCategory === 'all'
                    ? 'All Store Merchandise'
                    : products.find((p) => p.category === selectedCategory)?.categoryLabel || 'Products'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              {searchQuery && (
                <p className="text-xs text-stone-500 mt-1">
                  Search results for: <strong className="text-stone-900">"{searchQuery}"</strong>
                </p>
              )}
            </div>

            {/* Quick Filter Tag / Reset */}
            {(selectedCategory !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline self-start sm:self-auto"
              >
                Clear Filters &amp; Show All
              </button>
            )}
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                <SearchX className="w-7 h-7" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                No matching products found
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                We couldn't find any products matching your search. You can view all categories or use the Admin Uploader to add new cloth photos.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs"
                >
                  View All Products
                </button>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs"
                >
                  Upload Product Images
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => setSelectedProduct(p)}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onOpenLightbox={handleOpenLightbox}
                />
              ))}
            </div>
          )}
        </section>

        {/* Why Shop With Us Section */}
        <WhyShopWithUs />

        {/* Customer Reviews */}
        <CustomerReviews />

        {/* Delivery & Waybill Information */}
        <DeliverySection />

        {/* Contact & Map Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('catalog');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenEstimator={() => setIsEstimatorOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onOpenLightbox={handleOpenLightbox}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={handleClearCart}
      />

      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onProductsUpdated={(updated) => setProducts(updated)}
      />

      <YardEstimatorModal
        isOpen={isEstimatorOpen}
        onClose={() => setIsEstimatorOpen(false)}
        onFilterCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('catalog');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <LightboxModal
        isOpen={lightboxData.isOpen}
        onClose={() => setLightboxData((prev) => ({ ...prev, isOpen: false }))}
        imageUrl={lightboxData.imageUrl}
        title={lightboxData.title}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href={`https://wa.me/${STORE_INFO.whatsapp.replace('+', '')}?text=Hello%20Ayobami%20SAM%20Venture,%20I%20am%20chatting%20from%20your%20website`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
        title="Chat with Merchant on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="hidden group-hover:inline text-xs font-bold pr-1">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
};
