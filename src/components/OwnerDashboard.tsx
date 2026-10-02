import React, { useState, useRef } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Minus, 
  Phone, 
  Search, 
  Eye, 
  Edit3, 
  ArrowUpRight, 
  RefreshCw,
  Sliders,
  Filter,
  Flame,
  Award,
  Image as ImageIcon,
  Upload,
  Camera,
  RotateCcw,
  FileCode,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { Order, Product, OrderStatus, StoreSettings } from '../types';
import { CmsPanel } from './CmsPanel';
import { 
  imgHero, 
  imgBurgerSpecial, 
  imgBurgerChicken, 
  imgPopiaOriginal, 
  imgPopiaSpicy, 
  imgPopiaCheese, 
  imgChefOwner 
} from '../data/mockData';

interface OwnerDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  products: Product[];
  onUpdateProductStock: (productId: string, newStock: number, inStock: boolean) => void;
  onUpdateProductImage: (productId: string, newImage: string) => void;
  onResetProductImages: () => void;
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetProducts: () => void;
  storeSettings: StoreSettings;
  onUpdateStoreSettings: (newSettings: StoreSettings) => void;
  onCloseDashboard: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  products,
  onUpdateProductStock,
  onUpdateProductImage,
  onResetProductImages,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetProducts,
  storeSettings,
  onUpdateStoreSettings,
  onCloseDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'cms' | 'inventory' | 'gallery' | 'settings'>('overview');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [tempUrlInputs, setTempUrlInputs] = useState<Record<string, string>>({});
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  // Helper for file upload via FileReader (base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onComplete: (base64Url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('Saiz fail melebihi 4MB. Sila pilih gambar yang lebih kecil.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onComplete(reader.result);
        setUploadSuccessMessage('Gambar berjaya dimuat naik & dikemaskini!');
        setTimeout(() => setUploadSuccessMessage(null), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Overall statistics calculation
  const totalSales = orders
    .filter((o) => o.status !== 'Batal')
    .reduce((sum, o) => sum + o.total, 0);
  
  const totalOrders = orders.length;
  const activeOrdersCount = orders.filter((o) => o.status === 'Baru' || o.status === 'Sedang Dimasak').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'Selesai').length;
  const averageOrderValue = totalOrders > 0 ? totalSales / (orders.filter((o) => o.status !== 'Batal').length || 1) : 0;

  // Calculate Best Sellers
  const productSalesMap: Record<string, { name: string; category: string; quantity: number; revenue: number }> = {};
  orders.forEach((o) => {
    if (o.status !== 'Batal') {
      o.items.forEach((item) => {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = {
            name: item.name,
            category: item.name.toLowerCase().includes('popia') ? 'Popia' : 'Burger',
            quantity: 0,
            revenue: 0,
          };
        }
        productSalesMap[item.productId].quantity += item.quantity;
        productSalesMap[item.productId].revenue += item.unitPrice * item.quantity;
      });
    }
  });

  const bestSellers = Object.values(productSalesMap).sort((a, b) => b.quantity - a.quantity);

  // Daily Sales distribution (7 days)
  const dailySalesData = [
    { day: 'Isnin', date: '25 Sep', sales: 185.00, orders: 8 },
    { day: 'Selasa', date: '26 Sep', sales: 220.50, orders: 11 },
    { day: 'Rabu', date: '27 Sep', sales: 195.00, orders: 9 },
    { day: 'Khamis', date: '28 Sep', sales: 260.00, orders: 13 },
    { day: 'Jumaat', date: '29 Sep', sales: 410.00, orders: 20 },
    { day: 'Sabtu', date: '30 Sep', sales: 520.00, orders: 24 },
    { day: 'Ahad (Hari ini)', date: '01 Okt', sales: totalSales > 0 ? Math.round(totalSales * 100) / 100 : 380.00, orders: totalOrders || 16 },
  ];

  const maxDailySale = Math.max(...dailySalesData.map((d) => d.sales), 500);

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const matchesFilter = orderFilter === 'all' || ord.status === orderFilter;
    const matchesSearch =
      ord.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerPhone.includes(orderSearch);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      {/* Top Admin Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Portal Pengurusan Dapur
              </span>
              <span className="text-xs text-stone-500 font-medium">Pemilik: {storeSettings.ownerName}</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-stone-900 mt-1">
              Dashboard Pemilik Perniagaan
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Store Open/Close Toggle */}
            <button
              onClick={() =>
                onUpdateStoreSettings({ ...storeSettings, isOpen: !storeSettings.isOpen })
              }
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                storeSettings.isOpen
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${storeSettings.isOpen ? 'bg-emerald-600 animate-ping' : 'bg-red-600'}`} />
              <span>{storeSettings.isOpen ? 'Kedai Buka (Menerima Pesanan)' : 'Kedai Tutup Sementara'}</span>
            </button>

            <button
              onClick={onCloseDashboard}
              className="px-4 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Kembali ke Kedai
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 border-t border-stone-100 overflow-x-auto pt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Ringkasan & Jualan
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>Senarai Pesanan</span>
            {activeOrdersCount > 0 && (
              <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {activeOrdersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('cms')}
            className={`px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'cms'
                ? 'border-rose-600 text-rose-700 bg-rose-50/70 rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Sistem CMS (Ubah Gambar, Harga & Detail)</span>
            <span className="bg-gradient-to-r from-amber-400 to-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-2xs">
              CMS
            </span>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Stok Produk
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'gallery'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-rose-600" />
            <span>Galeri & Gambar</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Tetapan Kedai
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* TAB 1: OVERVIEW & SALES */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="text-xs font-semibold">Jumlah Jualan (RM)</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    RM
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
                  RM {totalSales.toFixed(2)}
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +18.4% berbanding minggu lepas
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="text-xs font-semibold">Jumlah Pesanan</span>
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
                  {totalOrders} Pesanan
                </div>
                <div className="text-[11px] text-stone-500">
                  {activeOrdersCount} aktif • {completedOrdersCount} selesai
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="text-xs font-semibold">Purata Nilai Pesanan</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
                  RM {averageOrderValue.toFixed(2)}
                </div>
                <div className="text-[11px] text-stone-500">
                  Pelanggan gemar kombo burger + popia
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="text-xs font-semibold">Item Dalam Stok</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
                  {products.reduce((acc, p) => acc + (p.inStock ? p.stockCount : 0), 0)} Unit
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  Semua menu sedia dimasak
                </div>
              </div>
            </div>

            {/* Daily Sales Chart & Best Sellers */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Daily Sales Bar Chart */}
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-lg text-stone-900">
                      Jualan Mengikut Hari (7 Hari Terkini)
                    </h3>
                    <p className="text-xs text-stone-500">
                      Prestasi jualan harian burger panas dan popia simpul kasih
                    </p>
                  </div>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                    Minggu Ini
                  </span>
                </div>

                {/* Visual Bar Chart */}
                <div className="pt-6 pb-2">
                  <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-52">
                    {dailySalesData.map((item, idx) => {
                      const heightPercent = Math.max(12, Math.round((item.sales / maxDailySale) * 100));
                      const isToday = idx === 6;
                      return (
                        <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                          {/* Value label on hover */}
                          <div className="text-[10px] font-bold text-stone-700 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform">
                            RM {item.sales.toFixed(0)}
                          </div>
                          
                          {/* Bar */}
                          <div className="w-full bg-stone-100 rounded-t-xl h-full flex items-end overflow-hidden p-0.5">
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className={`w-full rounded-t-lg transition-all duration-500 ${
                                isToday
                                  ? 'bg-gradient-to-t from-rose-600 to-amber-500 shadow-md shadow-rose-200'
                                  : 'bg-gradient-to-t from-stone-400 to-stone-300 group-hover:from-rose-500 group-hover:to-red-400'
                              }`}
                            />
                          </div>

                          {/* Day label */}
                          <div className="text-center">
                            <span className={`text-[11px] block font-bold leading-tight ${isToday ? 'text-rose-700' : 'text-stone-600'}`}>
                              {item.day.split(' ')[0]}
                            </span>
                            <span className="text-[9px] text-stone-400 font-medium">
                              {item.orders} ord
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>Puncak jualan berlaku pada hari Jumaat, Sabtu & Ahad (Makan malam & Minum petang)</span>
                  <span className="font-bold text-stone-800">Jumlah: RM {(dailySalesData.reduce((s, d) => s + d.sales, 0)).toFixed(2)}</span>
                </div>
              </div>

              {/* Best Sellers Ranking */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-stone-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Produk Paling Laris</span>
                  </h3>
                  <span className="text-[11px] text-stone-400">Unit Terjual</span>
                </div>

                <div className="space-y-3">
                  {bestSellers.length === 0 ? (
                    <p className="text-xs text-stone-400">Tiada data jualan lagi.</p>
                  ) : (
                    bestSellers.slice(0, 5).map((prod, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-100"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                              idx === 0
                                ? 'bg-amber-400 text-stone-950'
                                : idx === 1
                                ? 'bg-stone-300 text-stone-900'
                                : idx === 2
                                ? 'bg-amber-700 text-white'
                                : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div className="truncate">
                            <h4 className="font-bold text-xs text-stone-900 truncate">
                              {prod.name}
                            </h4>
                            <span className="text-[10px] text-stone-500">
                              Kutipan: RM {prod.revenue.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-black text-sm text-stone-900">
                            {prod.quantity}
                          </span>
                          <span className="text-[10px] text-stone-400 block">pesanan</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-5 sm:p-6 space-y-5">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Cari nama, no. pesanan, telefon..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 outline-none focus:border-rose-500"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
                {['all', 'Baru', 'Sedang Dimasak', 'Sedang Dihantar', 'Selesai'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer shrink-0 ${
                      orderFilter === st
                        ? 'bg-rose-600 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st === 'all' ? 'Semua Status' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  Tiada pesanan dijumpai untuk kriteria ini.
                </div>
              ) : (
                filteredOrders.map((ord) => {
                  const getStatusBadge = (status: OrderStatus) => {
                    switch (status) {
                      case 'Baru':
                        return 'bg-blue-100 text-blue-800 border-blue-200';
                      case 'Sedang Dimasak':
                        return 'bg-amber-100 text-amber-900 border-amber-300';
                      case 'Sedang Dihantar':
                        return 'bg-purple-100 text-purple-900 border-purple-200';
                      case 'Selesai':
                        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
                      case 'Batal':
                        return 'bg-stone-100 text-stone-500 border-stone-200';
                    }
                  };

                  return (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl border border-stone-200/90 hover:border-rose-300 transition-all bg-stone-50/50 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-display font-extrabold text-stone-900 text-base">
                            #{ord.orderNumber}
                          </span>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(ord.status)}`}>
                            {ord.status}
                          </span>
                          <span className="text-xs text-stone-400 font-medium">
                            {ord.createdAt}
                          </span>
                        </div>

                        {/* Order Total & Delivery Type */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold bg-stone-100 px-2 py-0.5 rounded text-stone-700">
                            {ord.deliveryMethod === 'delivery' ? 'Penghantaran Rider' : 'Ambil Sendiri'}
                          </span>
                          <span className="font-display font-black text-rose-700 text-base">
                            RM {ord.total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Customer Info & Items */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs text-stone-700 pt-1">
                        <div className="sm:col-span-4 space-y-1">
                          <div className="font-bold text-stone-900">{ord.customerName}</div>
                          <div className="text-stone-500">Tel: {ord.customerPhone}</div>
                          {ord.address && (
                            <div className="text-stone-500 line-clamp-1">Alamat: {ord.address}</div>
                          )}
                          {ord.notes && (
                            <div className="text-amber-800 italic">Nota: "{ord.notes}"</div>
                          )}
                        </div>

                        {/* Items list preview */}
                        <div className="sm:col-span-5 bg-white p-2.5 rounded-xl border border-stone-200">
                          <span className="text-[10px] text-stone-400 uppercase font-bold block mb-1">
                            Pesanan ({ord.items.length} item):
                          </span>
                          <div className="space-y-0.5">
                            {ord.items.map((it) => (
                              <div key={it.cartItemId} className="flex justify-between text-[11px]">
                                <span className="truncate">
                                  {it.quantity}x {it.name} {it.selectedSize ? `(${it.selectedSize.name.split(' ')[0]})` : ''}
                                </span>
                                <span className="font-semibold text-stone-900 shrink-0">
                                  RM {(it.unitPrice * it.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Status update actions */}
                        <div className="sm:col-span-3 flex flex-col justify-between gap-2">
                          <select
                            value={ord.status}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-800 cursor-pointer focus:border-rose-500"
                          >
                            <option value="Baru">Status: Baru Masuk</option>
                            <option value="Sedang Dimasak">Status: Sedang Dimasak</option>
                            <option value="Sedang Dihantar">Status: Sedang Dihantar</option>
                            <option value="Selesai">Status: Selesai</option>
                            <option value="Batal">Status: Batal</option>
                          </select>

                          {/* Quick WhatsApp chat with customer */}
                          <a
                            href={`https://wa.me/6${ord.customerPhone.replace(/[^0-9]/g, '')}?text=Hai%20${encodeURIComponent(ord.customerName)},%20pesanan%20anda%20%23${ord.orderNumber}%20kini%20dalam%20status:%20*${encodeURIComponent(ord.status)}*.%20Terima%20kasih%20daripada%20Dapur%20Burger%20%26%20Popia%20Simpul!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-center border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>WhatsApp Pelanggan</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CMS PANEL (CONTENT MANAGEMENT SYSTEM) */}
        {activeTab === 'cms' && (
          <CmsPanel
            products={products}
            onAddProduct={onAddProduct}
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
            onResetProducts={onResetProducts}
            storeSettings={storeSettings}
            onUpdateStoreSettings={onUpdateStoreSettings}
          />
        )}

        {/* TAB 4: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-5 sm:p-6 space-y-6">
            <div>
              <h3 className="font-display font-bold text-lg text-stone-900">
                Pengurusan Stok Produk (Dapur Bonda)
              </h3>
              <p className="text-xs text-stone-500">
                Kawal baki stok patty burger daging/ayam dan balang popia simpul kasih harian
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl border border-stone-200 flex gap-3.5 items-center bg-stone-50/50"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        {prod.category}
                      </span>
                      <span className="text-xs font-bold text-stone-900">
                        RM {prod.basePrice.toFixed(2)}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate mt-1">
                      {prod.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-stone-500">Baki Stok:</span>
                      <span className="font-extrabold text-sm text-stone-900">
                        {prod.stockCount} unit
                      </span>
                    </div>
                  </div>

                  {/* Stock Stepper & Toggle */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200">
                      <button
                        onClick={() =>
                          onUpdateProductStock(
                            prod.id,
                            Math.max(0, prod.stockCount - 5),
                            prod.stockCount - 5 > 0
                          )
                        }
                        className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-xs cursor-pointer"
                        title="Kurang 5 unit"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          onUpdateProductStock(
                            prod.id,
                            prod.stockCount + 5,
                            true
                          )
                        }
                        className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-xs cursor-pointer"
                        title="Tambah 5 unit"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        onUpdateProductStock(prod.id, prod.stockCount, !prod.inStock)
                      }
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                        prod.inStock
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-red-50 text-red-800 border-red-200'
                      }`}
                    >
                      {prod.inStock ? 'Ada Stok' : 'Tandakan Habis'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GALLERY & IMAGE MANAGEMENT */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            {/* Gallery Intro Banner */}
            <div className="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-3">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-200 border border-white/30">
                <Camera className="w-3.5 h-3.5" />
                <span>Pengurusan Gambar & Media Dapur</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display leading-tight">
                Ubah Gambar Banner & Produk Mengikut Citarasa Anda
              </h2>
              <p className="text-xs sm:text-sm text-rose-100 max-w-2xl leading-relaxed">
                Anda boleh menukar sebarang gambar dalam aplikasi ini dengan serta-merta. Pilih gambar dari galeri telefon pintar, kamera, fail komputer (format JPG/PNG/WebP), atau masukkan pautan URL gambar terus.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onResetProductImages}
                  className="px-4 py-2 rounded-xl bg-white text-stone-900 font-bold text-xs hover:bg-stone-100 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                  <span>Kembalikan Semua Gambar Asal</span>
                </button>
              </div>
            </div>

            {uploadSuccessMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{uploadSuccessMessage}</span>
              </div>
            )}

            {/* SEKSYEN 1: BANNER UTAMA (HERO BANNER) */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-display font-bold text-lg text-stone-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-rose-600" />
                    <span>1. Gambar Banner Utama (Hero Section)</span>
                  </h3>
                  <p className="text-xs text-stone-500">
                    Gambar besar yang dipaparkan di bahagian paling atas muka depan laman web
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStoreSettings({ ...storeSettings, heroImage: imgHero });
                    setUploadSuccessMessage('Gambar banner telah dikembalikan ke gambar asal!');
                    setTimeout(() => setUploadSuccessMessage(null), 3000);
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Banner Asal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 relative rounded-2xl overflow-hidden border-2 border-stone-200 shadow-sm h-48 bg-stone-100">
                  <img
                    src={storeSettings.heroImage || imgHero}
                    alt="Pratonton Banner Utama"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-semibold">
                    Pratonton Semasa
                  </div>
                </div>

                <div className="md:col-span-7 space-y-3">
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      Pilihan A: Muat Naik Dari Telefon / Komputer
                    </label>
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Pilih Fail Gambar (JPG / PNG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) =>
                          handleFileChange(e, (dataUrl) =>
                            onUpdateStoreSettings({ ...storeSettings, heroImage: dataUrl })
                          )
                        }
                      />
                    </label>
                  </div>

                  <div className="pt-2 border-t border-stone-100">
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      Pilihan B: Masukkan Pautan URL Gambar
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/gambar-burger.jpg"
                        value={tempUrlInputs['hero'] || ''}
                        onChange={(e) =>
                          setTempUrlInputs({ ...tempUrlInputs, hero: e.target.value })
                        }
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-rose-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const url = tempUrlInputs['hero'];
                          if (url) {
                            onUpdateStoreSettings({ ...storeSettings, heroImage: url });
                            setUploadSuccessMessage('Gambar banner telah dikemaskini daripada URL!');
                            setTimeout(() => setUploadSuccessMessage(null), 3000);
                          }
                        }}
                        className="px-3.5 py-2 bg-stone-900 text-white font-bold text-xs rounded-xl hover:bg-stone-800 cursor-pointer"
                      >
                        Guna URL
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEKSYEN 2: GAMBAR PEMILIK / DAPUR BONDA */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-display font-bold text-lg text-stone-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-rose-600" />
                    <span>2. Gambar Pemilik & Dapur Bonda (Kak Zamziah)</span>
                  </h3>
                  <p className="text-xs text-stone-500">
                    Foto yang dipaparkan pada bahagian "Kisah Dapur Kami"
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStoreSettings({ ...storeSettings, ownerImage: imgChefOwner });
                    setUploadSuccessMessage('Gambar pemilik telah dikembalikan ke gambar asal!');
                    setTimeout(() => setUploadSuccessMessage(null), 3000);
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Gambar Asal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4 relative rounded-2xl overflow-hidden border-2 border-stone-200 shadow-sm h-48 bg-stone-100 max-w-[200px]">
                  <img
                    src={storeSettings.ownerImage || imgChefOwner}
                    alt="Pratonton Gambar Pemilik"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-semibold">
                    Pratonton Semasa
                  </div>
                </div>

                <div className="md:col-span-8 space-y-3">
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      Pilihan A: Muat Naik Gambar Sendiri / Gambar Dapur
                    </label>
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Muat Naik Foto Dari Telefon/PC</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) =>
                          handleFileChange(e, (dataUrl) =>
                            onUpdateStoreSettings({ ...storeSettings, ownerImage: dataUrl })
                          )
                        }
                      />
                    </label>
                  </div>

                  <div className="pt-2 border-t border-stone-100">
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      Pilihan B: Masukkan Pautan URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/foto-kak-zamziah.jpg"
                        value={tempUrlInputs['owner'] || ''}
                        onChange={(e) =>
                          setTempUrlInputs({ ...tempUrlInputs, owner: e.target.value })
                        }
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-rose-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const url = tempUrlInputs['owner'];
                          if (url) {
                            onUpdateStoreSettings({ ...storeSettings, ownerImage: url });
                            setUploadSuccessMessage('Gambar pemilik telah dikemaskini!');
                            setTimeout(() => setUploadSuccessMessage(null), 3000);
                          }
                        }}
                        className="px-3.5 py-2 bg-stone-900 text-white font-bold text-xs rounded-xl hover:bg-stone-800 cursor-pointer"
                      >
                        Guna URL
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEKSYEN 3: GAMBAR SETIAP PRODUK MAKANAN */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="font-display font-bold text-lg text-stone-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-600" />
                  <span>3. Gambar Menu Produk (Burger & Popia Simpul)</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Tukar gambar makanan bagi setiap hidangan yang dipaparkan dalam menu jualan
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((prod) => {
                  const defaultImgMap: Record<string, string> = {
                    'burger-daging-special': imgBurgerSpecial,
                    'burger-ayam-crispy': imgBurgerChicken,
                    'burger-daging-double-cheese': imgBurgerSpecial,
                    'burger-ayam-grill-bbq': imgBurgerChicken,
                    'popia-simpul-original': imgPopiaOriginal,
                    'popia-simpul-pedas': imgPopiaSpicy,
                    'popia-simpul-cheese': imgPopiaCheese,
                    'kombo-kasih-petang': imgHero,
                  };
                  const defaultImg = defaultImgMap[prod.id] || imgHero;

                  return (
                    <div
                      key={prod.id}
                      className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-3"
                    >
                      <div className="flex gap-3 items-center">
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-stone-200 shrink-0 bg-white shadow-2xs relative">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                            {prod.category}
                          </span>
                          <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate mt-1">
                            {prod.name}
                          </h4>
                          <span className="text-xs text-stone-500">
                            Harga: RM {prod.basePrice.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 pt-1 border-t border-stone-200/80">
                        {/* File Upload Button */}
                        <div className="flex items-center gap-2">
                          <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 text-xs font-bold transition-colors cursor-pointer shadow-2xs">
                            <Camera className="w-3.5 h-3.5 text-rose-600" />
                            <span>Pilih Fail Gambar</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) =>
                                handleFileChange(e, (dataUrl) =>
                                  onUpdateProductImage(prod.id, dataUrl)
                                )
                              }
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              onUpdateProductImage(prod.id, defaultImg);
                              setUploadSuccessMessage(`Gambar ${prod.name} telah dikembalikan ke asal!`);
                              setTimeout(() => setUploadSuccessMessage(null), 3000);
                            }}
                            className="p-2 rounded-xl bg-white hover:bg-stone-100 text-stone-500 hover:text-stone-800 border border-stone-200 text-xs transition-colors cursor-pointer"
                            title="Reset gambar ke asal"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* URL input */}
                        <div className="flex gap-1.5">
                          <input
                            type="url"
                            placeholder="Atau tampal URL gambar..."
                            value={tempUrlInputs[prod.id] || ''}
                            onChange={(e) =>
                              setTempUrlInputs({
                                ...tempUrlInputs,
                                [prod.id]: e.target.value,
                              })
                            }
                            className="flex-1 px-2.5 py-1.5 text-[11px] rounded-lg border border-stone-200 bg-white outline-none focus:border-rose-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const url = tempUrlInputs[prod.id];
                              if (url) {
                                onUpdateProductImage(prod.id, url);
                                setUploadSuccessMessage(`Gambar ${prod.name} telah dikemaskini daripada URL!`);
                                setTimeout(() => setUploadSuccessMessage(null), 3000);
                              }
                            }}
                            className="px-2.5 py-1.5 bg-stone-900 text-white font-bold text-[11px] rounded-lg hover:bg-stone-800 cursor-pointer"
                          >
                            Guna
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEKSYEN 4: PANDUAN MANUAL MELALUI KOD SISTEM FAIL */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <FileCode className="w-4 h-4 text-amber-700" />
                <span>Panduan Menukar Fail Gambar Dalam Kod Sumber (Jika Mahu Ubah Fail Secara Terus)</span>
              </div>
              <p className="text-xs text-amber-950/80 leading-relaxed">
                Selain memuat naik terus dari dashboard ini, anda juga boleh menggantikan fail imej fizikal di dalam projek secara manual:
              </p>
              <div className="bg-white/80 p-3.5 rounded-2xl border border-amber-200 text-xs text-stone-700 font-mono space-y-1.5">
                <div>📁 <strong>Lokasi Folder Imej:</strong> <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded">/src/assets/images/</code></div>
                <div>📄 <strong>Fail Data Produk:</strong> <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded">/src/data/mockData.ts</code></div>
                <div className="text-stone-500 font-sans text-[11px] pt-1">
                  * Tip: Anda boleh meletakkan sebarang fail gambar di dalam folder <code>/src/assets/images/</code> dan import di dalam <code>mockData.ts</code>.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STORE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-5 sm:p-6 space-y-6 max-w-2xl">
            <div>
              <h3 className="font-display font-bold text-lg text-stone-900">
                Maklumat Kedai & Operasi
              </h3>
              <p className="text-xs text-stone-500">
                Kemaskini nombor WhatsApp perniagaan, caj penghantaran dan pengumuman
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Nama Perniagaan
                </label>
                <input
                  type="text"
                  value={storeSettings.storeName}
                  onChange={(e) =>
                    onUpdateStoreSettings({ ...storeSettings, storeName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Nombor WhatsApp Pemilik (Untuk Terima Pesanan)
                </label>
                <input
                  type="text"
                  value={storeSettings.whatsappNumber}
                  onChange={(e) =>
                    onUpdateStoreSettings({ ...storeSettings, whatsappNumber: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    Caj Penghantaran Asas (RM)
                  </label>
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    Had Percuma Penghantaran (RM)
                  </label>
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Waktu Operasi Dapur
                </label>
                <input
                  type="text"
                  value={storeSettings.operatingHours}
                  onChange={(e) =>
                    onUpdateStoreSettings({ ...storeSettings, operatingHours: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Alamat Pengambilan Sendiri (Pickup Point)
                </label>
                <input
                  type="text"
                  value={storeSettings.pickupLocation}
                  onChange={(e) =>
                    onUpdateStoreSettings({ ...storeSettings, pickupLocation: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Mesej Bar Pengumuman Atas (Announcement Banner)
                </label>
                <textarea
                  rows={2}
                  value={storeSettings.announcement}
                  onChange={(e) =>
                    onUpdateStoreSettings({ ...storeSettings, announcement: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-medium"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
