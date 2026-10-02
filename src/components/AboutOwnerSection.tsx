import React from 'react';
import { Heart, Sparkles, Award, ShieldCheck, MapPin, Phone, Clock } from 'lucide-react';
import { imgChefOwner } from '../data/mockData';
import { StoreSettings } from '../types';

interface AboutOwnerSectionProps {
  storeSettings: StoreSettings;
  onExploreMenu: () => void;
}

export const AboutOwnerSection: React.FC<AboutOwnerSectionProps> = ({
  storeSettings,
  onExploreMenu,
}) => {
  return (
    <section className="py-16 bg-gradient-to-b from-stone-50 via-rose-50/40 to-stone-50 border-t border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Owner Photo with warm decorative styling */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              <div className="absolute -inset-3 bg-gradient-to-tr from-rose-300 via-amber-200 to-rose-200 rounded-3xl blur-xl opacity-60 -rotate-2" />
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white">
                <img
                  src={storeSettings.ownerImage || imgChefOwner}
                  alt="Kak Zamziah - Pemilik & Tukang Masak Burger & Popia Simpul"
                  className="w-full h-80 sm:h-96 object-cover object-top"
                />
                <div className="p-4 bg-white/95 backdrop-blur-md border-t border-rose-100 text-center">
                  <h4 className="font-display font-bold text-lg text-stone-900">
                    Kak Zamziah & Keluarga
                  </h4>
                  <p className="text-xs text-rose-700 font-semibold">
                    Pengasas & Tukang Masak Dapur Bonda
                  </p>
                </div>
              </div>

              {/* Floating Quote Badge */}
              <div className="absolute -bottom-4 -right-4 bg-white p-3.5 rounded-2xl shadow-lg border border-rose-200 max-w-[220px]">
                <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-800">
                    Prinsip Dapur Kami
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 italic leading-snug">
                  "Kalau kita sendiri tak lalu nak makan, jangan sesekali jamu kepada pelanggan."
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Story & Quality Commitments */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
              <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span>Kisah Dapur Kecil Kami</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 leading-tight">
              Bermula Dari Dapur Rumah, <br className="hidden sm:inline" />
              <span className="text-rose-700">Dimasak Dengan Penuh Kasih Sayang</span>
            </h2>

            <div className="space-y-4 text-stone-600 text-sm leading-relaxed">
              <p>
                Perniagaan ini bermula secara kecil-kecilan dari kegemaran keluarga berkumpul pada waktu petang. Ramai jiran dan saudara mara sering memuji keenakan patty daging burger kami yang juicy serta kerangupan <strong>Popia Simpul Kasih</strong> yang tidak mudah lemau.
              </p>
              <p>
                Bagi kami, setiap balang popia disimpul satu persatu dengan tangan penuh teliti sambil berzikir dan berselawat. Daging burger pula diadun segar setiap pagi tanpa campuran tepung berlebihan atau bahan pengawet tiruan.
              </p>
              <p className="font-medium text-stone-800">
                Kami percaya bahawa makanan yang sedap bukan sekadar memuaskan nafsu makan, tetapi membawa kegembiraan dan mengeratkan silaturrahim sekeluarga.
              </p>
            </div>

            {/* Guarantees Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900">100% Bersih & Halal</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Menggunakan bahan mentah segar pembekal Muslim tempatan yang diyakini.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900">Rangup Krup-Krup</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Popia simpul tahan berbulan dalam balang kedap tanpa bau hapak atau minyak tengik.
                  </p>
                </div>
              </div>
            </div>

            {/* Operating Hours & Location snippet */}
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-700">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-950">
                  <Clock className="w-4 h-4 text-rose-600" />
                  <span>{storeSettings.operatingHours}</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-600">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>{storeSettings.pickupLocation}</span>
                </div>
              </div>

              <button
                onClick={onExploreMenu}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition-colors shrink-0 cursor-pointer"
              >
                Pesan Dari Dapur Kami
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
