import React, { useState } from 'react';
import { 
  DollarSign, 
  Image as ImageIcon, 
  Phone, 
  MapPin, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Upload, 
  Camera, 
  Tag, 
  Sparkles, 
  RotateCcw, 
  Save, 
  CreditCard, 
  Percent, 
  HelpCircle,
  CheckCircle2,
  Package,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Product, StoreSettings, PromoCoupon, ProductCategory, ProductSizeOption } from '../types';
import { 
  imgHero, 
  imgBurgerSpecial, 
  imgBurgerChicken, 
  imgPopiaOriginal, 
  imgPopiaSpicy, 
  imgPopiaCheese, 
  imgChefOwner 
} from '../data/mockData';

interface CmsPanelProps {
  products: Product[];
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetProducts: () => void;
  storeSettings: StoreSettings;
  onUpdateStoreSettings: (newSettings: StoreSettings) => void;
}

export const CmsPanel: React.FC<CmsPanelProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetProducts,
  storeSettings,
  onUpdateStoreSettings,
}) => {
  const [cmsTab, setCmsTab] = useState<'products' | 'pricing' | 'images' | 'contact' | 'coupons'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNewProduct, setIsAddingNewProduct] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGeneratingAiCopy, setIsGeneratingAiCopy] = useState<boolean>(false);

  // Form state for creating new product
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('burger');
  const [newProdTagline, setNewProdTagline] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(12.00);
  const [newProdImage, setNewProdImage] = useState(imgBurgerSpecial);
  const [newProdFlavor, setNewProdFlavor] = useState<'Original' | 'Pedas' | 'Cheese' | 'Black Pepper' | 'BBQ'>('Original');
  const [newProdStock, setNewProdStock] = useState(30);

  // Form state for creating coupon
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'fixed' | 'percentage'>('fixed');
  const [newCouponValue, setNewCouponValue] = useState(5);
  const [newCouponMinSpend, setNewCouponMinSpend] = useState(25);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  const handleAiGenerateCopy = async () => {
    if (!newProdName.trim()) {
      alert('Sila masukkan nama makanan terlebih dahulu.');
      return;
    }
    setIsGeneratingAiCopy(true);
    try {
      const res = await fetch('/api/ai/generate-menu-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: newProdName,
          category: newProdCategory,
          flavor: newProdFlavor,
        }),
      });

      if (!res.ok) {
        throw new Error(`API status ${res.status}`);
      }

      const data = await res.json();
      if (data.tagline) setNewProdTagline(data.tagline);
      if (data.description) setNewProdDesc(data.description);
      showNotification('✨ AI telah menjana slogan & penerangan yang menyelerakan!');
    } catch (err) {
      console.warn('AI API notice (using responsive culinary template):', err);
      // Smart local generator fallback for static GitHub Pages hosting
      const isBurger = newProdCategory === 'burger';
      const fallbackTagline = isBurger
        ? `Patty ${newProdFlavor} berjus tebal dengan limpahan sos rahsia istimewa`
        : `Popia simpul kasih rangup berperisa ${newProdFlavor} warisan bonda`;
      const fallbackDesc = isBurger
        ? `Disediakan segar setiap hari menggunakan daging bermutu tinggi diperap rempah asli. Panggangan panas membangkitkan aroma asap yang memikat selera.`
        : `Kudapan warisan rangup krup-krup disimpul kemas dengan inti serunding ikan kampung segar. Enak dinikmati sekeluarga pada bila-bila masa.`;

      setNewProdTagline(fallbackTagline);
      setNewProdDesc(fallbackDesc);
      showNotification('✨ Tagline & huraian menu berjaya dijana!');
    } finally {
      setIsGeneratingAiCopy(false);
    }
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, onDone: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('Fail melebihi 4MB. Sila pilih gambar yang lebih kecil.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onDone(reader.result);
        showNotification('Gambar berjaya dimuat naik!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProduct(editingProduct);
    setEditingProduct(null);
    showNotification(`Perubahan pada ${editingProduct.name} berjaya disimpan!`);
  };

  const handleCreateNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      category: newProdCategory,
      tagline: newProdTagline.trim() || 'Menu Istimewa Dapur Bonda',
      description: newProdDesc.trim() || 'Dibuat segar dengan bahan berkualiti tinggi.',
      basePrice: Number(newProdPrice) || 10,
      image: newProdImage || (newProdCategory === 'popia' ? imgPopiaOriginal : imgBurgerSpecial),
      flavor: newProdFlavor,
      inStock: true,
      stockCount: Number(newProdStock) || 20,
      comboAvailable: newProdCategory === 'burger',
      comboPriceExtra: newProdCategory === 'burger' ? 4.50 : undefined,
      sizes: newProdCategory === 'popia' ? [
        { id: 'size-s', name: 'Balang Comel (Kecil)', weightOrSize: '180 gram', price: newProdPrice },
        { id: 'size-m', name: 'Balang Standard', weightOrSize: '350 gram', price: newProdPrice * 1.8 },
        { id: 'size-l', name: 'Balang Mega Famili', weightOrSize: '650 gram', price: newProdPrice * 3.2 },
      ] : undefined
    };

    onAddProduct(newProd);
    setIsAddingNewProduct(false);
    setNewProdName('');
    setNewProdDesc('');
    setNewProdTagline('');
    showNotification(`Menu baharu "${newProd.name}" telah ditambah!`);
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const newCoupon: PromoCoupon = {
      id: `coup-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: Number(newCouponValue),
      minSpend: Number(newCouponMinSpend),
      description: newCouponDesc.trim() || `Diskaun ${newCouponType === 'fixed' ? `RM ${newCouponValue}` : `${newCouponValue}%`}`,
      active: true,
    };

    const currentCoupons = storeSettings.coupons || [];
    onUpdateStoreSettings({
      ...storeSettings,
      coupons: [...currentCoupons, newCoupon],
    });

    setNewCouponCode('');
    setNewCouponDesc('');
    showNotification(`Kupon "${newCoupon.code}" telah diaktifkan!`);
  };

  const handleToggleCoupon = (couponId: string) => {
    const updated = (storeSettings.coupons || []).map((c) =>
      c.id === couponId ? { ...c, active: !c.active } : c
    );
    onUpdateStoreSettings({ ...storeSettings, coupons: updated });
    showNotification('Status kupon telah dikemaskini');
  };

  const handleDeleteCoupon = (couponId: string) => {
    const updated = (storeSettings.coupons || []).filter((c) => c.id !== couponId);
    onUpdateStoreSettings({ ...storeSettings, coupons: updated });
    showNotification('Kupon telah dipadam');
  };

  return (
    <div className="space-y-6">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CMS Header & Sub-Tabs */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-rose-100 text-rose-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                Sistem CMS Dapur
              </span>
              <span className="text-xs text-stone-500 font-semibold">Semua perubahan disimpan serta-merta</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-stone-900 mt-1">
              Pusat Kawalan Kandungan (CMS)
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Ubah harga makanan, gambar, nombor telefon WhatsApp, alamat, notis dan kod diskaun mengikut keperluan perniagaan anda.
            </p>
          </div>

          <button
            type="button"
            onClick={onResetProducts}
            className="text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            title="Kembalikan semua produk dan harga ke tetapan asal"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
            <span>Reset Data Produk Asal</span>
          </button>
        </div>

        {/* CMS Sub-Tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setCmsTab('products')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              cmsTab === 'products'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>1. Ubah Produk & Harga</span>
          </button>

          <button
            type="button"
            onClick={() => setCmsTab('images')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              cmsTab === 'images'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>2. Ubah Gambar & Media</span>
          </button>

          <button
            type="button"
            onClick={() => setCmsTab('contact')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              cmsTab === 'contact'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>3. Kontek, Waktu & Lokasi</span>
          </button>

          <button
            type="button"
            onClick={() => setCmsTab('pricing')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              cmsTab === 'pricing'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>4. Bayaran & Caj Rider</span>
          </button>

          <button
            type="button"
            onClick={() => setCmsTab('coupons')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              cmsTab === 'coupons'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>5. Kupon & Promosi</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PRODUCTS & PRICING MANAGEMENT */}
      {cmsTab === 'products' && (
        <div className="space-y-6">
          {/* Header Action: Add New Product Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-stone-200">
            <div>
              <h3 className="font-display font-bold text-lg text-stone-900">
                Senarai Menu Jualan ({products.length} Item)
              </h3>
              <p className="text-xs text-stone-500">
                Klik butang "Edit" untuk mengubah nama, harga, saiz balang atau penerangan setiap makanan.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingNewProduct(!isAddingNewProduct)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-200 hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingNewProduct ? 'Batal Tambah' : 'Tambah Menu Baharu'}</span>
            </button>
          </div>

          {/* New Product Form (Collapsible) */}
          {isAddingNewProduct && (
            <form onSubmit={handleCreateNewProduct} className="bg-rose-50/70 border border-rose-200 rounded-3xl p-6 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-rose-200 pb-3">
                <h4 className="font-display font-bold text-base text-rose-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Daftar Menu Makanan Baharu</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingNewProduct(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    Nama Makanan <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="Contoh: Burger Kambing Bakar Berempah"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-sm font-medium outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Kategori Menu</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-sm font-medium outline-none focus:border-rose-500 cursor-pointer"
                  >
                    <option value="burger">Burger Homemade</option>
                    <option value="popia">Popia Simpul Kasih</option>
                    <option value="kombo">Set Kombo Jimat</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    Harga Asas (RM) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-sm font-bold text-rose-700 outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* AI Copywriter trigger */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gradient-to-r from-amber-50 to-rose-50 p-3 rounded-2xl border border-amber-200">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Buntu idea nak tulis ayat promosi menu?</span>
                </div>
                <button
                  type="button"
                  disabled={isGeneratingAiCopy || !newProdName.trim()}
                  onClick={handleAiGenerateCopy}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>{isGeneratingAiCopy ? 'AI Sedang Menjana...' : 'Jana Tagline & Huraian dengan AI'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Slogan Ringkas (Tagline)</label>
                  <input
                    type="text"
                    value={newProdTagline}
                    onChange={(e) => setNewProdTagline(e.target.value)}
                    placeholder="Contoh: Daging Perap Black Pepper Juicy & Keju Leleh"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs font-medium outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Perisa / Rasa</label>
                  <select
                    value={newProdFlavor}
                    onChange={(e) => setNewProdFlavor(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs font-medium outline-none focus:border-rose-500 cursor-pointer"
                  >
                    <option value="Original">Original Asli</option>
                    <option value="Pedas">Pedas Berapi</option>
                    <option value="Cheese">Cheese Leleh</option>
                    <option value="Black Pepper">Black Pepper</option>
                    <option value="BBQ">BBQ Madu</option>
                  </select>
                </div>
              </div>

              <div className="text-xs">
                <label className="font-bold text-stone-800 block mb-1">Penerangan Penuh</label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Kongsikan keistimewaan resipi, bahan-bahan atau cara penyediaan..."
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs font-medium outline-none focus:border-rose-500"
                />
              </div>

              {/* Upload image for new product */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-14 h-14 rounded-xl border border-stone-200 overflow-hidden bg-white shrink-0">
                  <img src={newProdImage} alt="Pratonton" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer shadow-2xs">
                    <Camera className="w-3.5 h-3.5 text-rose-600" />
                    <span>Muat Naik Foto Makanan</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handleFileUpload(e, (url) => setNewProdImage(url))}
                    />
                  </label>
                  <span className="text-[11px] text-stone-500 block mt-0.5">Atau biarkan menggunakan gambar contoh sedia ada</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNewProduct(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 text-xs font-bold hover:bg-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 cursor-pointer"
                >
                  Simpan & Paparkan Menu
                </button>
              </div>
            </form>
          )}

          {/* Edit Product Modal if active */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
              <div 
                className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-rose-100 animate-in zoom-in-95 my-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-display font-bold text-lg text-stone-900">
                    Kemaskini Butiran & Harga: {editingProduct.name}
                  </h3>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveProductEdit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-stone-800 block mb-1">Nama Produk</label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-semibold outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-800 block mb-1">Harga Asas (RM)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editingProduct.basePrice}
                        onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-bold text-rose-700 outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-800 block mb-1">Tagline Ringkas</label>
                    <input
                      type="text"
                      value={editingProduct.tagline}
                      onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-800 block mb-1">Penerangan Menu</label>
                    <textarea
                      rows={3}
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium outline-none focus:border-rose-500"
                    />
                  </div>

                  {/* Size Options Editing if Popia */}
                  {editingProduct.sizes && editingProduct.sizes.length > 0 && (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                      <div className="font-bold text-amber-950 text-xs flex items-center justify-between">
                        <span>Pilihan Saiz Balang & Harga:</span>
                        <span className="text-[10px] text-amber-800 font-normal">Harga pelanggan mengikut saiz pek</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {editingProduct.sizes.map((sz, sIdx) => (
                          <div key={sz.id} className="bg-white p-2.5 rounded-xl border border-amber-200 space-y-1">
                            <span className="font-bold text-[11px] text-stone-800 block truncate">{sz.name}</span>
                            <span className="text-[10px] text-stone-500 block">{sz.weightOrSize}</span>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs font-bold text-stone-500">RM</span>
                              <input
                                type="number"
                                step="0.5"
                                value={sz.price}
                                onChange={(e) => {
                                  const updatedSizes = [...editingProduct.sizes!];
                                  updatedSizes[sIdx].price = parseFloat(e.target.value) || 0;
                                  setEditingProduct({ ...editingProduct, sizes: updatedSizes });
                                }}
                                className="w-full px-2 py-1 text-xs font-bold text-rose-700 border border-stone-200 rounded outline-none focus:border-rose-500"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Burger combo price extra */}
                  {editingProduct.comboAvailable && (
                    <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-stone-900 block">Harga Tambahan Set Kombo (+ Fries & Air)</span>
                        <span className="text-[11px] text-stone-500">Caj tambahan bila pelanggan klik "Jadikan Set Kombo"</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-rose-800">RM</span>
                        <input
                          type="number"
                          step="0.5"
                          value={editingProduct.comboPriceExtra || 4.5}
                          onChange={(e) => setEditingProduct({ ...editingProduct, comboPriceExtra: parseFloat(e.target.value) || 0 })}
                          className="w-20 px-2 py-1 text-xs font-bold text-rose-700 bg-white border border-rose-300 rounded outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-200"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Products List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col justify-between gap-3 hover:border-rose-300 transition-all"
              >
                <div className="flex gap-3.5 items-start">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shrink-0 relative">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        {prod.category}
                      </span>
                      {prod.flavor && (
                        <span className="text-[10px] font-medium text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                          {prod.flavor}
                        </span>
                      )}
                      {prod.isPopular && (
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                          Paling Laris 🔥
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-stone-900 truncate mt-1">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      {prod.tagline}
                    </p>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-[10px] text-stone-400">Harga:</span>
                      <span className="text-base font-black text-rose-700 font-display">
                        RM {prod.basePrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500 text-[11px]">
                    Stok: <strong className="text-stone-800">{prod.stockCount} unit</strong> ({prod.inStock ? 'Ada' : 'Habis'})
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingProduct({ ...prod })}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Ubah Harga / Info</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Adakah anda pasti mahu memadam menu "${prod.name}"?`)) {
                          onDeleteProduct(prod.id);
                          showNotification(`Menu "${prod.name}" telah dipadam.`);
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Padam menu ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: IMAGES & MEDIA CMS */}
      {cmsTab === 'images' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div>
            <h3 className="font-display font-bold text-lg text-stone-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-rose-600" />
              <span>Pengurusan Gambar & Media Utama</span>
            </h3>
            <p className="text-xs text-stone-500">
              Muat naik gambar terus dari galeri telefon pintar atau komputer untuk menggantikan banner dan hidangan makanan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hero Banner */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                  Banner Utama (Hero Section)
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStoreSettings({ ...storeSettings, heroImage: imgHero });
                    showNotification('Banner utama telah dikembalikan ke gambar asal!');
                  }}
                  className="text-[11px] text-rose-600 font-semibold hover:underline"
                >
                  Reset Asal
                </button>
              </div>

              <div className="h-44 rounded-xl overflow-hidden border border-stone-200 relative bg-stone-200">
                <img
                  src={storeSettings.heroImage || imgHero}
                  alt="Banner Utama"
                  className="w-full h-full object-cover"
                />
              </div>

              <label className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors">
                <Upload className="w-4 h-4" />
                <span>Muat Naik Banner Baru</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) =>
                    handleFileUpload(e, (dataUrl) =>
                      onUpdateStoreSettings({ ...storeSettings, heroImage: dataUrl })
                    )
                  }
                />
              </label>
            </div>

            {/* Owner / Kitchen Photo */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                  Foto Pemilik / Dapur Bonda
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStoreSettings({ ...storeSettings, ownerImage: imgChefOwner });
                    showNotification('Foto pemilik telah dikembalikan ke gambar asal!');
                  }}
                  className="text-[11px] text-rose-600 font-semibold hover:underline"
                >
                  Reset Asal
                </button>
              </div>

              <div className="h-44 rounded-xl overflow-hidden border border-stone-200 relative bg-stone-200">
                <img
                  src={storeSettings.ownerImage || imgChefOwner}
                  alt="Foto Pemilik"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <label className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors">
                <Upload className="w-4 h-4" />
                <span>Muat Naik Foto Pemilik Baru</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) =>
                    handleFileUpload(e, (dataUrl) =>
                      onUpdateStoreSettings({ ...storeSettings, ownerImage: dataUrl })
                    )
                  }
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONTACT & STORE DETAILS CMS */}
      {cmsTab === 'contact' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-5">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-display font-bold text-lg text-stone-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-rose-600" />
              <span>Maklumat Hubungan, Waktu & Lokasi Dapur</span>
            </h3>
            <p className="text-xs text-stone-500">
              Semua butiran ini digunakan pada resit pesanan, pautan WhatsApp automatik dan paparan kedai.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Nombor Telefon WhatsApp Penjual (Paling Penting!)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={storeSettings.whatsappNumber}
                    onChange={(e) =>
                      onUpdateStoreSettings({ ...storeSettings, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })
                    }
                    placeholder="Contoh: 60193482901"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold outline-none focus:border-rose-500 font-mono"
                  />
                </div>
                <span className="text-[10px] text-stone-500 block mt-1">
                  * Format antarabangsa tanpa simbol (Cth: 60193482901). Pesanan pelanggan akan dihantar terus ke nombor ini.
                </span>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Nama Perniagaan / Jenama
                </label>
                <input
                  type="text"
                  value={storeSettings.storeName}
                  onChange={(e) =>
                    onUpdateStoreSettings({ ...storeSettings, storeName: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Nama Pemilik / Tukang Masak
                </label>
                <input
                  type="text"
                  value={storeSettings.ownerName}
                  onChange={(e) =>
                    onUpdateStoreSettings({ ...storeSettings, ownerName: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm font-medium outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Slogan Perniagaan (Tagline)
                </label>
                <input
                  type="text"
                  value={storeSettings.tagline}
                  onChange={(e) =>
                    onUpdateStoreSettings({ ...storeSettings, tagline: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm font-medium outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                Waktu Operasi Dapur
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={storeSettings.operatingHours}
                  onChange={(e) =>
                    onUpdateStoreSettings({ ...storeSettings, operatingHours: e.target.value })
                  }
                  placeholder="Contoh: Setiap Hari: 2:00 Petang – 10:30 Malam"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-sm font-medium outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                Alamat Lokasi Ambil Sendiri (Pickup Point)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-rose-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={storeSettings.pickupLocation}
                  onChange={(e) =>
                    onUpdateStoreSettings({ ...storeSettings, pickupLocation: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-sm font-medium outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                Kawasan Liputan Penghantaran Rider
              </label>
              <input
                type="text"
                value={storeSettings.deliveryCoverageArea || ''}
                onChange={(e) =>
                  onUpdateStoreSettings({ ...storeSettings, deliveryCoverageArea: e.target.value })
                }
                placeholder="Contoh: Seksyen 7, Seksyen 2, Seksyen 3, Padang Jawa, UiTM Shah Alam"
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm font-medium outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                Teks Bar Pengumuman Atas (Announcement Banner)
              </label>
              <textarea
                rows={2}
                value={storeSettings.announcement}
                onChange={(e) =>
                  onUpdateStoreSettings({ ...storeSettings, announcement: e.target.value })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-medium outline-none focus:border-rose-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => showNotification('Semua maklumat hubungan telah disimpan!')}
                className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 shadow-sm"
              >
                Simpan Butiran Hubungan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRICING & PAYMENT CMS */}
      {cmsTab === 'pricing' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-display font-bold text-lg text-stone-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-rose-600" />
              <span>Tetapan Caj Penghantaran & Akaun Pembayaran Pelanggan</span>
            </h3>
            <p className="text-xs text-stone-500">
              Konfigurasi caj rider, had percuma penghantaran serta nombor akaun bank untuk resit DuitNow/FPX.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <label className="font-bold text-stone-800 block">
                  Caj Penghantaran Asas Rider (RM)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-stone-500 font-bold">RM</span>
                  <input
                    type="number"
                    step="0.5"
                    value={storeSettings.deliveryFee}
                    onChange={(e) =>
                      onUpdateStoreSettings({
                        ...storeSettings,
                        deliveryFee: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-base font-bold text-rose-700 outline-none"
                  />
                </div>
                <span className="text-[10px] text-stone-500 block">
                  Caj standard yang dikenakan pada troli penghantaran.
                </span>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <label className="font-bold text-stone-800 block">
                  Had Pesanan Percuma Penghantaran (Free Delivery)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-stone-500 font-bold">RM</span>
                  <input
                    type="number"
                    step="1"
                    value={storeSettings.freeDeliveryThreshold}
                    onChange={(e) =>
                      onUpdateStoreSettings({
                        ...storeSettings,
                        freeDeliveryThreshold: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-base font-bold text-emerald-700 outline-none"
                  />
                </div>
                <span className="text-[10px] text-stone-500 block">
                  Bila pelanggan berbelanja jumlah ini ke atas, caj penghantaran automatik menjadi RM0 (Percuma).
                </span>
              </div>
            </div>

            {/* Bank and DuitNow Account Details */}
            <div className="p-5 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-3">
              <h4 className="font-bold text-rose-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>Maklumat Akaun Bank (Untuk Pelanggan Buat Bayaran)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Nama Bank</label>
                  <input
                    type="text"
                    value={storeSettings.bankName || 'Maybank'}
                    onChange={(e) =>
                      onUpdateStoreSettings({ ...storeSettings, bankName: e.target.value })
                    }
                    placeholder="Contoh: Maybank / CIMB"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Nombor Akaun Bank</label>
                  <input
                    type="text"
                    value={storeSettings.bankAccountNo || '5123 4567 8901'}
                    onChange={(e) =>
                      onUpdateStoreSettings({ ...storeSettings, bankAccountNo: e.target.value })
                    }
                    placeholder="Contoh: 5123 4567 8901"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs font-mono font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Nama Pemegang Akaun</label>
                  <input
                    type="text"
                    value={storeSettings.bankAccountHolder || 'Zamziah Binti Hassan'}
                    onChange={(e) =>
                      onUpdateStoreSettings({ ...storeSettings, bankAccountHolder: e.target.value })
                    }
                    placeholder="Contoh: Zamziah Binti Hassan"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Nombor Telefon DuitNow QR (Untuk Resit DuitNow)
                </label>
                <input
                  type="text"
                  value={storeSettings.duitNowQrPhone || storeSettings.whatsappNumber}
                  onChange={(e) =>
                    onUpdateStoreSettings({ ...storeSettings, duitNowQrPhone: e.target.value })
                  }
                  placeholder="Contoh: 019-348 2901"
                  className="w-full sm:w-1/2 px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs font-mono font-bold outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => showNotification('Tetapan bayaran & caj rider berjaya disimpan!')}
              className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800"
            >
              Simpan Tetapan Bayaran
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: COUPONS & PROMOS CMS */}
      {cmsTab === 'coupons' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div>
            <h3 className="font-display font-bold text-lg text-stone-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-rose-600" />
              <span>Pengurusan Kupon Diskaun & Promosi</span>
            </h3>
            <p className="text-xs text-stone-500">
              Cipta kod promosi yang pelanggan boleh masukkan dalam troli untuk mendapatkan potongan harga.
            </p>
          </div>

          {/* Create new coupon form */}
          <form onSubmit={handleAddCoupon} className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3 text-xs">
            <div className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-amber-700" />
              <span>Cipta Kupon Baharu</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-bold text-stone-800 block mb-1">Kod Kupon</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: RAYA10 / HUJUNGMIN"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 font-bold uppercase text-xs outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Jenis Diskaun</label>
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="fixed">Potongan Ringgit Tetap (RM)</option>
                  <option value="percentage">Peratusan (%)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Nilai Diskaun</label>
                <input
                  type="number"
                  required
                  step="0.5"
                  value={newCouponValue}
                  onChange={(e) => setNewCouponValue(parseFloat(e.target.value) || 0)}
                  placeholder={newCouponType === 'fixed' ? 'Contoh: 5 (RM5)' : 'Contoh: 10 (10%)'}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 font-bold text-xs text-rose-700 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Belanja Min. (RM)</label>
                <input
                  type="number"
                  step="1"
                  value={newCouponMinSpend}
                  onChange={(e) => setNewCouponMinSpend(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 font-bold text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={newCouponDesc}
                onChange={(e) => setNewCouponDesc(e.target.value)}
                placeholder="Penerangan ringkas (Contoh: Diskaun RM5 sempena hari gaji)"
                className="flex-1 px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-stone-900 text-white font-bold text-xs rounded-xl hover:bg-stone-800 cursor-pointer shrink-0"
              >
                Tambah Kupon
              </button>
            </div>
          </form>

          {/* Active Coupons List */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-stone-700 uppercase tracking-wider">
              Senarai Kod Kupon Aktif
            </h4>

            {(storeSettings.coupons || []).length === 0 ? (
              <p className="text-xs text-stone-400">Tiada kupon aktif pada masa ini.</p>
            ) : (
              (storeSettings.coupons || []).map((coup) => (
                <div
                  key={coup.id}
                  className="p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between gap-3 text-xs bg-stone-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-rose-700 bg-white px-3 py-1 rounded-xl border border-rose-200 text-sm shadow-2xs">
                      {coup.code}
                    </span>
                    <div>
                      <span className="font-bold text-stone-900 block">
                        {coup.discountType === 'fixed'
                          ? `Potongan RM ${coup.discountValue.toFixed(2)}`
                          : `Diskaun ${coup.discountValue}%`}
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Min. belanja RM {coup.minSpend.toFixed(2)} • {coup.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleCoupon(coup.id)}
                      className={`px-3 py-1 rounded-xl font-bold text-[11px] border cursor-pointer ${
                        coup.active
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-stone-200 text-stone-600 border-stone-300'
                      }`}
                    >
                      {coup.active ? 'Aktif' : 'Dinyahaktif'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCoupon(coup.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-white"
                      title="Padam kupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
