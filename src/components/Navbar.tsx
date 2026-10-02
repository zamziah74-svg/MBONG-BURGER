import React from 'react';
import { ShoppingBag, ChefHat, Heart, Phone, UtensilsCrossed, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { StoreSettings } from '../types';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  storeSettings: StoreSettings;
  isOwnerMode: boolean;
  setIsOwnerMode: (val: boolean) => void;
  onOpenAiAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  activeTab,
  setActiveTab,
  storeSettings,
  isOwnerMode,
  setIsOwnerMode,
  onOpenAiAssistant,
}) => {
  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 text-white text-xs md:text-sm py-1.5 px-4 font-medium text-center shadow-inner flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-200" />
        <span>{storeSettings.announcement}</span>
        <span className="hidden md:inline bg-rose-800/60 px-2 py-0.5 rounded text-[11px] font-semibold border border-rose-400/30">
          WhatsApp: +{storeSettings.whatsappNumber.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '$1 $2-$3 $4')}
        </span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <button
            onClick={() => {
              setActiveTab('home');
              setIsOwnerMode(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 via-red-600 to-amber-500 flex items-center justify-center shadow-md shadow-rose-200 group-hover:scale-105 transition-transform duration-300">
              <span className="text-2xl" role="img" aria-label="burger and knot">🍔</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-xl md:text-2xl text-stone-900 tracking-tight leading-none group-hover:text-rose-700 transition-colors">
                  Burger & Popia Simpul
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-semibold border border-rose-200">
                  <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" /> Kasih Bonda
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium tracking-wide mt-0.5">
                Dibuat Segar • Rangup & Menyelerakan
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-stone-50 p-1 rounded-full border border-stone-200/70 shadow-inner">
            <button
              onClick={() => {
                setActiveTab('home');
                setIsOwnerMode(false);
              }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'home' && !isOwnerMode
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Halaman Utama
            </button>
            <button
              onClick={() => {
                setActiveTab('menu');
                setIsOwnerMode(false);
                const el = document.getElementById('menu-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'menu' && !isOwnerMode
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Menu & Pesanan
            </button>
            <button
              onClick={() => {
                setActiveTab('recipes');
                setIsOwnerMode(false);
              }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'recipes' && !isOwnerMode
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              Cara Membuat (Resipi)
            </button>
            <button
              onClick={() => {
                setActiveTab('about');
                setIsOwnerMode(false);
              }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'about' && !isOwnerMode
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Kisah Dapur
            </button>
          </nav>

          {/* Right Action Icons & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Owner Dashboard Switch */}
            <button
              onClick={() => setIsOwnerMode(!isOwnerMode)}
              title="Akses Dashboard Pengurusan Pemilik"
              className={`text-xs px-3 py-2 rounded-xl font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                isOwnerMode
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm font-bold'
                  : 'bg-stone-100/90 hover:bg-stone-200 text-stone-700 border-stone-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">{isOwnerMode ? 'Mod Pemilik (Aktif)' : 'Dashboard Pemilik'}</span>
              <span className="sm:hidden">Owner</span>
            </button>

            {/* AI Assistant Button */}
            {onOpenAiAssistant && (
              <button
                type="button"
                onClick={onOpenAiAssistant}
                className="hidden sm:flex items-center gap-1.5 text-xs text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 px-3 py-2 rounded-xl font-bold transition-all shadow-2xs hover:scale-102 cursor-pointer"
                title="Tanya Kak Zamziah AI untuk cadangan menu"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Tanya AI Dapur</span>
              </button>
            )}

            {/* Direct WhatsApp Help */}
            <a
              href={`https://wa.me/${storeSettings.whatsappNumber}?text=Hai%20Kak%20Zamziah,%20saya%20ingin%20tanya%20tentang%20Burger%20dan%20Popia%20Simpul`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-xl font-semibold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white px-3.5 sm:px-4 py-2 rounded-xl font-semibold text-sm shadow-md shadow-rose-200 active:scale-95 transition-all cursor-pointer"
              aria-label="Lihat Troli Pesanan"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-900 text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Troli</span>
              {cartTotal > 0 && (
                <span className="bg-rose-800/80 px-2 py-0.5 rounded text-xs text-amber-200 font-bold border border-rose-400/40">
                  RM {cartTotal.toFixed(2)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-100 px-2 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => {
            setActiveTab('home');
            setIsOwnerMode(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium cursor-pointer ${
            activeTab === 'home' && !isOwnerMode ? 'text-rose-600 font-bold' : 'text-stone-500'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span>Utama</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('menu');
            setIsOwnerMode(false);
            const el = document.getElementById('menu-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium cursor-pointer ${
            activeTab === 'menu' && !isOwnerMode ? 'text-rose-600 font-bold' : 'text-stone-500'
          }`}
        >
          <span className="text-lg leading-none">🍔</span>
          <span>Menu</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('recipes');
            setIsOwnerMode(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium cursor-pointer ${
            activeTab === 'recipes' && !isOwnerMode ? 'text-rose-600 font-bold' : 'text-stone-500'
          }`}
        >
          <ChefHat className="w-5 h-5 text-amber-600" />
          <span>Resipi</span>
        </button>

        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium text-stone-700 cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-rose-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-400 text-stone-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="font-semibold text-rose-700">Troli</span>
        </button>

        <button
          onClick={() => setIsOwnerMode(!isOwnerMode)}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium cursor-pointer ${
            isOwnerMode ? 'text-amber-600 font-bold' : 'text-stone-500'
          }`}
        >
          <ShieldAlert className="w-5 h-5" />
          <span>Pemilik</span>
        </button>
      </div>
    </>
  );
};
