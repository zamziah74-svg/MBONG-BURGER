import React from 'react';
import { Search, X, Flame, Sparkles, Filter } from 'lucide-react';
import { ProductCategory } from '../types';

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedFlavor: string;
  setSelectedFlavor: (flavor: string) => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedFlavor,
  setSelectedFlavor,
}) => {
  const categories = [
    { id: 'all', label: 'Semua Menu', icon: '🍽️' },
    { id: 'burger', label: 'Burger Homemade', icon: '🍔' },
    { id: 'popia', label: 'Popia Simpul', icon: '🥨' },
    { id: 'kombo', label: 'Set Kombo Jimat', icon: '🍱' },
    { id: 'popular', label: 'Paling Laris 🔥', icon: '⭐' },
  ];

  const flavors = [
    { id: 'all', label: 'Semua Rasa' },
    { id: 'Original', label: 'Original Asli' },
    { id: 'Pedas', label: 'Pedas Berapi 🌶️' },
    { id: 'Cheese', label: 'Cheese Leleh 🧀' },
    { id: 'Black Pepper', label: 'Black Pepper' },
  ];

  return (
    <div className="space-y-4 mb-8">
      {/* Search Input Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari burger juicy, popia simpul original, popia pedas, cheese..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border-2 border-stone-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none text-stone-800 placeholder-stone-400 text-sm md:text-base font-medium transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar px-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                isSelected
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-200 scale-102'
                  : 'bg-white text-stone-700 border border-stone-200/80 hover:border-rose-300 hover:bg-rose-50/50'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Flavor / Spice Sub-filters */}
      <div className="flex items-center justify-start md:justify-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-stone-500 font-semibold flex items-center gap-1 mr-1 shrink-0">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <span>Rasa:</span>
        </span>
        {flavors.map((f) => {
          const isSelected = selectedFlavor === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFlavor(f.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {f.label}
            </button>
          );
        })}
        {(searchQuery || selectedCategory !== 'all' || selectedFlavor !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedFlavor('all');
            }}
            className="shrink-0 text-rose-600 hover:text-rose-800 text-xs font-bold underline px-2 cursor-pointer"
          >
            Reset Semua
          </button>
        )}
      </div>
    </div>
  );
};
