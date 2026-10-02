import React from 'react';
import { ArrowDown, ShoppingBag, Sparkles, Heart, CheckCircle2, Flame, Award, Clock } from 'lucide-react';
import { imgHero } from '../data/mockData';

interface HeroProps {
  onExploreMenu: () => void;
  onOrderNow: () => void;
  onOpenRecipes: () => void;
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreMenu,
  onOrderNow,
  onOpenRecipes,
  heroImage,
  heroTitle,
  heroSubtitle
}) => {
  const currentHeroImg = heroImage || imgHero;
  return (
    <section className="relative overflow-hidden pt-6 pb-12 md:py-16 bg-gradient-to-b from-rose-50/70 via-amber-50/30 to-transparent">
      {/* Decorative background blurs */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-rose-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-rose-200 shadow-sm text-xs font-semibold text-rose-800">
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Dapur Bonda • Sentuhan Kasih Wanita Melayu</span>
            </div>

            {/* Main Catchy Title */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
              {heroTitle ? (
                <span>{heroTitle}</span>
              ) : (
                <>
                  Burger Sedap, <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 bg-clip-text text-transparent">
                    Popia Rangup
                  </span>
                  , <br />
                  <span className="italic font-serif font-normal text-rose-950">Dibuat Dengan Hati</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {heroSubtitle || (
                <>
                  Nikmati keenakan patty burger daging & ayam berjus homemade yang dibakar panas, 
                  digandingkan bersama keasyikan kudapan warisan <strong>Popia Simpul Kasih</strong> berinti serunding ikan kampung asli. Rangup krup-krup, segar tanpa bahan pengawet!
                </>
              )}
            </p>

            {/* Trust Highlights Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-stone-700 font-medium">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-xl border border-stone-200/70 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Buatan Sendiri</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-xl border border-stone-200/70 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Serunding Ikan Segar</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-xl border border-stone-200/70 shadow-2xs col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Dijamin Halal & Bersih</span>
              </div>
            </div>

            {/* Call To Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onOrderNow}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-base shadow-lg shadow-rose-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-amber-200" />
                <span>Buat Pesanan Sekarang</span>
              </button>

              <button
                onClick={onExploreMenu}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-base border-2 border-stone-300/80 hover:border-stone-400 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Lihat Menu Penuh</span>
                <ArrowDown className="w-4 h-4 text-rose-600" />
              </button>

              <button
                onClick={onOpenRecipes}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl text-rose-800 hover:bg-rose-100/60 font-semibold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Rahsia & Cara Membuat</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Glow backdrop frame */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-rose-400 via-amber-400 to-red-500 rounded-3xl opacity-30 blur-xl transform rotate-2" />
              
              {/* Main Photo Card */}
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-stone-900 group">
                <img
                  src={currentHeroImg}
                  alt="Hidangan Burger Homemade dan Popia Simpul Kasih yang menyelerakan"
                  className="w-full h-[360px] sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20" />
                
                {/* Floating Badge on Photo */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-rose-200 shadow-md flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-600 fill-rose-500" />
                  <span className="text-xs font-bold text-stone-900">Dimasak Panas & Rangup</span>
                </div>

                <div className="absolute top-4 right-4 bg-amber-500 text-stone-950 px-3 py-1 rounded-full font-black text-xs shadow-md flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Resipi Asli</span>
                </div>

                {/* Bottom Overlay Text */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs text-amber-300 font-semibold tracking-wider uppercase mb-1">
                    Kombo Popular Sepanjang Musim
                  </p>
                  <h3 className="text-xl font-bold font-display leading-tight drop-shadow-sm">
                    Gandingan Mantap Burger Bakar & Popia Simpul Kasih
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-xs text-stone-200">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-300" /> Waktu Pesanan: 2:00 PM - 10:30 PM
                    </span>
                    <span className="bg-rose-600/90 text-white font-bold px-2 py-0.5 rounded">
                      Dari RM 10.90
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Stat Pill (Bottom Left) */}
              <div className="absolute -bottom-5 -left-4 sm:left-2 bg-white p-3 sm:p-3.5 rounded-2xl shadow-xl border border-rose-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-lg">
                  ❤️
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">1,500+ Pelanggan Setia</div>
                  <div className="text-[11px] text-stone-500">Kawasan Shah Alam & Lembah Klang</div>
                </div>
              </div>

              {/* Floating Stat Pill (Top Right) */}
              <div className="absolute -top-4 -right-3 hidden sm:flex bg-amber-50 border border-amber-200 p-2.5 rounded-2xl shadow-lg items-center gap-2">
                <span className="text-xl">✨</span>
                <div className="text-left">
                  <span className="block text-[11px] font-bold text-stone-900 leading-tight">Simpul Satu Persatu</span>
                  <span className="text-[10px] text-amber-800">Dijamin kemas & sedap</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
