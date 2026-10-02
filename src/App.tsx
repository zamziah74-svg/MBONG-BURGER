import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Flame, 
  Check, 
  ArrowRight, 
  Heart, 
  Clock, 
  MapPin, 
  Phone, 
  Search,
  Filter,
  ShieldCheck,
  Award,
  ChevronDown
} from 'lucide-react';
import { 
  Product, 
  CartItem, 
  Order, 
  ProductSizeOption, 
  OrderStatus, 
  DeliveryMethod, 
  StoreSettings 
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_STORE_SETTINGS,
  imgHero,
  imgBurgerSpecial,
  imgPopiaOriginal,
  imgPopiaSpicy,
  imgPopiaCheese
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SearchAndFilter } from './components/SearchAndFilter';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { RecipeSection } from './components/RecipeSection';
import { AboutOwnerSection } from './components/AboutOwnerSection';
import { OwnerDashboard } from './components/OwnerDashboard';
import { Footer } from './components/Footer';
import { AiAssistantModal } from './components/AiAssistantModal';

export default function App() {
  // --- Persistent State from LocalStorage or Defaults ---
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('bp_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('bp_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('bp_settings');
      return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bp_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isOwnerMode, setIsOwnerMode] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);

  // Cart & Pricing State
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [discountCode, setDiscountCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('all');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('bp_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bp_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bp_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bp_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Cart Operations
  const handleAddToCart = (
    product: Product,
    quantity: number,
    selectedSize?: ProductSizeOption,
    isCombo?: boolean,
    specialInstructions?: string
  ) => {
    const basePrice = selectedSize ? selectedSize.price : product.basePrice;
    const unitPrice = isCombo && product.comboPriceExtra ? basePrice + product.comboPriceExtra : basePrice;

    // Unique key for same item with same customization
    const cartItemId = `${product.id}-${selectedSize?.id || 'standard'}-${isCombo ? 'combo' : 'single'}-${specialInstructions || 'none'}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            productId: product.id,
            name: product.name,
            image: product.image,
            selectedSize,
            isCombo,
            specialInstructions,
            unitPrice,
            quantity,
          },
        ];
      }
    });

    showToast(`✓ Ditambah ke troli: ${quantity}x ${product.name}`);
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item telah dibuang daripada troli');
  };

  const handleClearCart = () => {
    setCart([]);
    setAppliedDiscount(0);
    setDiscountCode('');
    showToast('Troli telah dikosongkan');
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setAppliedDiscount(0);
    setDiscountCode('');
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setCompletedOrder(newOrder);

    // Deduct stock
    setProducts((prev) =>
      prev.map((p) => {
        const orderedItem = newOrder.items.find((it) => it.productId === p.id);
        if (orderedItem) {
          const newCount = Math.max(0, p.stockCount - orderedItem.quantity);
          return {
            ...p,
            stockCount: newCount,
            inStock: newCount > 0,
          };
        }
        return p;
      })
    );
  };

  // Owner Operations
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Status pesanan dikemaskini kepada: ${newStatus}`);
  };

  const handleUpdateProductStock = (productId: string, newStock: number, inStock: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockCount: newStock, inStock } : p))
    );
    showToast('Stok produk telah dikemaskini');
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`✓ Menu baru "${newProduct.name}" telah ditambah!`);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    showToast(`✓ Maklumat & harga "${updatedProduct.name}" berjaya disimpan!`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Menu makanan telah dipadam daripada senarai');
  };

  const handleResetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    setStoreSettings(INITIAL_STORE_SETTINGS);
    showToast('Semua data produk, harga dan gambar telah di-reset ke asal');
  };

  const handleUpdateProductImage = (productId: string, newImage: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, image: newImage } : p))
    );
    showToast('Gambar produk berjaya dikemaskini!');
  };

  const handleResetProductImages = () => {
    setProducts(INITIAL_PRODUCTS);
    setStoreSettings((prev) => ({
      ...prev,
      heroImage: INITIAL_STORE_SETTINGS.heroImage,
      ownerImage: INITIAL_STORE_SETTINGS.ownerImage,
    }));
    showToast('Semua gambar telah dikembalikan kepada asal!');
  };

  const handleUpdateStoreSettings = (newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
    showToast('Tetapan kedai telah disimpan');
  };

  // Filter products for display
  const filteredProducts = products.filter((prod) => {
    // Category check
    if (selectedCategory === 'burger' && prod.category !== 'burger') return false;
    if (selectedCategory === 'popia' && prod.category !== 'popia') return false;
    if (selectedCategory === 'kombo' && prod.category !== 'kombo') return false;
    if (selectedCategory === 'popular' && !prod.isPopular) return false;

    // Flavor check
    if (selectedFlavor !== 'all' && prod.flavor !== selectedFlavor) return false;

    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      const matchTag = prod.tagline.toLowerCase().includes(q);
      const matchFlavor = prod.flavor?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchTag && !matchFlavor) return false;
    }

    return true;
  });

  const cartTotalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#292524] flex flex-col font-sans selection:bg-rose-200">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-stone-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        cartCount={cartTotalItemsCount}
        cartTotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        storeSettings={storeSettings}
        isOwnerMode={isOwnerMode}
        setIsOwnerMode={setIsOwnerMode}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
      />

      {/* Conditional Rendering: OWNER DASHBOARD vs CUSTOMER STORE */}
      {isOwnerMode ? (
        <OwnerDashboard
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          products={products}
          onUpdateProductStock={handleUpdateProductStock}
          onUpdateProductImage={handleUpdateProductImage}
          onResetProductImages={handleResetProductImages}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onResetProducts={handleResetProducts}
          storeSettings={storeSettings}
          onUpdateStoreSettings={handleUpdateStoreSettings}
          onCloseDashboard={() => setIsOwnerMode(false)}
        />
      ) : activeTab === 'recipes' ? (
        <main className="flex-1">
          <RecipeSection
            onOrderProduct={(category) => {
              setActiveTab('menu');
              setSelectedCategory(category);
              const el = document.getElementById('menu-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
          <AboutOwnerSection
            storeSettings={storeSettings}
            onExploreMenu={() => {
              setActiveTab('menu');
              const el = document.getElementById('menu-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </main>
      ) : activeTab === 'about' ? (
        <main className="flex-1">
          <AboutOwnerSection
            storeSettings={storeSettings}
            onExploreMenu={() => {
              setActiveTab('menu');
              const el = document.getElementById('menu-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
          <RecipeSection
            onOrderProduct={(category) => {
              setActiveTab('menu');
              setSelectedCategory(category);
              const el = document.getElementById('menu-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </main>
      ) : (
        /* Home & Full Storefront View */
        <main className="flex-1">
          {/* 1. Hero Section */}
          <Hero
            heroImage={storeSettings.heroImage}
            heroTitle={storeSettings.heroTitle}
            heroSubtitle={storeSettings.heroSubtitle}
            onExploreMenu={() => {
              const el = document.getElementById('menu-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOrderNow={() => {
              const el = document.getElementById('menu-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenRecipes={() => {
              setActiveTab('recipes');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* 2. Popular Showcase (Paling Laris) */}
          <section className="py-10 bg-white border-y border-rose-100/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
                    <Flame className="w-4 h-4 fill-rose-600 text-rose-600" />
                    <span>Pilihan Ramai & Kegemaran Pelanggan</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-900">
                    Produk Popular Minggu Ini
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    const el = document.getElementById('menu-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Lihat semua menu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 3 Best Sellers Quick Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products
                  .filter((p) => p.isPopular)
                  .slice(0, 3)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onQuickView={(p) => setSelectedProductModal(p)}
                    />
                  ))}
              </div>
            </div>
          </section>

          {/* 3. Full Menu Section with Search & Filter */}
          <section id="menu-section" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 inline-block mb-2">
                Dibuat Segar Setiap Hari
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900">
                Pilih Menu Kegemaran Anda
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-2">
                Daripada burger daging homemade berjus, burger ayam rangup, hingga balang popia simpul kasih pelbagai perisa.
              </p>
            </div>

            {/* Search & Category Filter Controls */}
            <SearchAndFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedFlavor={selectedFlavor}
              setSelectedFlavor={setSelectedFlavor}
            />

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 max-w-md mx-auto">
                <span className="text-4xl mb-3 block">🔍</span>
                <h3 className="font-bold text-stone-900 text-base mb-1">
                  Tiada Makanan Dijumpai
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  Cuba cari perkataan lain seperti "burger", "popia", "daging", atau reset semula penapis.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedFlavor('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs cursor-pointer"
                >
                  Reset Carian
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickView={(p) => setSelectedProductModal(p)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* 4. Special Banner: "Cara Membuat" Preview */}
          <section className="py-12 bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-200 border border-white/30 inline-block">
                  Perkongsian Dapur
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold leading-tight">
                  Ingin Belajar Cara Membuat Burger & Popia Simpul Kasih?
                </h3>
                <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
                  Kami kongsikan sukatan bahan, teknik membentukkan lekukan tengah patty daging, cara gunting kulit popia dan petua menggoreng rangup tahan lama.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('recipes');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-7 py-3.5 rounded-2xl bg-white text-stone-900 hover:bg-stone-100 font-bold text-sm shadow-xl transition-all shrink-0 cursor-pointer"
              >
                Ketahui Cara Membuat
              </button>
            </div>
          </section>

          {/* 5. About the Female Cook / Warm Authentic Story */}
          <AboutOwnerSection
            storeSettings={storeSettings}
            onExploreMenu={() => {
              const el = document.getElementById('menu-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </main>
      )}

      {/* Product Customization Modal */}
      <ProductModal
        product={selectedProductModal}
        onClose={() => setSelectedProductModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        deliveryMethod={deliveryMethod}
        setDeliveryMethod={setDeliveryMethod}
        discountCode={discountCode}
        setDiscountCode={setDiscountCode}
        appliedDiscount={appliedDiscount}
        setAppliedDiscount={setAppliedDiscount}
        storeSettings={storeSettings}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        deliveryMethod={deliveryMethod}
        appliedDiscount={appliedDiscount}
        discountCode={discountCode}
        storeSettings={storeSettings}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Order Success / WhatsApp Modal */}
      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        storeSettings={storeSettings}
      />

      {/* AI Assistant Modal (Kak Zamziah AI) */}
      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        onNavigateToMenu={() => {
          setIsAiAssistantOpen(false);
          const el = document.getElementById('menu-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Floating AI Assistant FAB Button */}
      {!isOwnerMode && (
        <button
          onClick={() => setIsAiAssistantOpen(true)}
          className="fixed bottom-18 lg:bottom-6 right-4 sm:right-6 z-40 bg-gradient-to-r from-rose-600 via-red-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white/80 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Tanya Kak Zamziah AI untuk cadangan hidangan"
          aria-label="Buka Pembantu AI Dapur"
        >
          <div className="relative">
            <span className="text-xl">👩‍🍳</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-300 rounded-full animate-ping" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[10px] font-black text-amber-200 uppercase tracking-wider leading-none flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Pembantu AI Dapur
            </div>
            <div className="text-xs font-bold leading-tight mt-0.5">
              Tanya Kak Zamziah
            </div>
          </div>
        </button>
      )}

      {/* Global Footer */}
      <Footer
        storeSettings={storeSettings}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setIsOwnerMode(false);
        }}
        onOpenOwner={() => {
          setIsOwnerMode(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
