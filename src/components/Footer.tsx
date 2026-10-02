import React from 'react';
import { Heart, Phone, MapPin, Clock, ShieldCheck, Instagram, Facebook } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  storeSettings: StoreSettings;
  onNavigate: (tab: string) => void;
  onOpenOwner: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  storeSettings,
  onNavigate,
  onOpenOwner,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-16 lg:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-stone-800 text-xs sm:text-sm">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍔</span>
              <h3 className="font-display font-bold text-xl text-white">
                Burger & Popia Simpul
              </h3>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Dibuat dengan hati oleh Kak Zamziah dan keluarga. Menghidangkan burger homemade panas berjus dan popia simpul kasih rangup tradisional untuk kudapan seisi rumah.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-rose-300 font-semibold bg-rose-950/60 px-3 py-1 rounded-full border border-rose-800/40">
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              <span>100% Halal, Bersih & Homemade</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              Pautan Pantas
            </h4>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Laman Utama
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('menu');
                    const el = document.getElementById('menu-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Menu Burger Panas
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('menu');
                    const el = document.getElementById('menu-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Menu Popia Simpul Rangup
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('recipes');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Cara Membuat & Resipi
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Kisah Dapur Bonda
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenOwner}
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
                >
                  Portal Pemilik (Dashboard)
                </button>
              </li>
            </ul>
          </div>

          {/* Operating Info */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              Waktu & Lokasi
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{storeSettings.operatingHours}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{storeSettings.pickupLocation}</span>
              </div>
              <p className="text-[11px] text-stone-400 pt-1">
                Kawasan Liputan Rider: Seksyen 7, Seksyen 2, Seksyen 3, Padang Jawa, UiTM & UNISEL Shah Alam.
                <br />
                <span className="text-amber-300 font-medium">
                  *Popia Simpul boleh dipos ke seluruh Malaysia termasuk Sabah & Sarawak!
                </span>
              </p>
            </div>
          </div>

          {/* Contact & WhatsApp */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              Hubungi Kami
            </h4>
            <p className="text-xs text-stone-400">
              Ada pertanyaan mengenai tempahan katering kenduri, majlis hari jadi atau pek borong popia simpul?
            </p>
            <a
              href={`https://wa.me/${storeSettings.whatsappNumber}?text=Hai%20Kak%20Zamziah,%20saya%20ingin%20tanya%20tentang%20tempahan`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp: 019-348 2901</span>
            </a>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <div>
            &copy; {new Date().getFullYear()} Burger & Popia Simpul. Hak Cipta Terpelihara. Dibuat dengan kasih sayang.
          </div>
          <div className="flex items-center gap-2">
            <span>Sentuhan Dapur Bonda Malaysia</span>
            <span>•</span>
            <button
              onClick={onOpenOwner}
              className="text-stone-400 hover:text-white underline cursor-pointer"
            >
              Log Masuk Pemilik
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
