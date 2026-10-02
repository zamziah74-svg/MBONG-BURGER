import React, { useState } from 'react';
import { Clock, Users, Flame, Sparkles, CheckCircle2, ChevronRight, Award, ChefHat, BookOpen } from 'lucide-react';
import { Recipe } from '../types';
import { RECIPES } from '../data/mockData';

interface RecipeSectionProps {
  onOrderProduct?: (category: string) => void;
}

export const RecipeSection: React.FC<RecipeSectionProps> = ({ onOrderProduct }) => {
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number>(0);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  const currentRecipe = RECIPES[selectedRecipeIndex];

  const toggleIngredient = (itemKey: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  return (
    <section className="py-12 bg-gradient-to-b from-transparent via-amber-50/40 to-rose-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
            <ChefHat className="w-4 h-4 text-rose-600" />
            <span>Dapur Warisan & Panduan Memasak</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Cara Membuat & Rahsia Resipi Dapur Kami
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Kami kongsikan langkah demi langkah, teknik rahsia dan petua tradisional agar anda dapat memahami keunikan setiap gigitan burger dan kerangupan popia simpul kasih kami.
          </p>
        </div>

        {/* Tab Switcher: Burger vs Popia */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1.5 rounded-2xl border border-stone-200 shadow-sm flex gap-2">
            {RECIPES.map((recipe, idx) => {
              const isSelected = selectedRecipeIndex === idx;
              return (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipeIndex(idx)}
                  className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-lg">{idx === 0 ? '🍔' : '🥨'}</span>
                  <span>{idx === 0 ? 'A. Resipi Burger Homemade' : 'B. Resipi Popia Simpul Kasih'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Recipe Content Container */}
        <div className="bg-white rounded-3xl border border-rose-100 shadow-xl overflow-hidden">
          {/* Hero Banner for current recipe */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-black text-rose-600 tracking-wider uppercase bg-rose-50 px-3 py-1 rounded-md border border-rose-200 inline-block mb-3">
                  {currentRecipe.difficulty} • Resipi Asli Bonda
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                  {currentRecipe.title}
                </h3>
                <p className="text-stone-600 text-sm sm:text-base mt-2 font-normal">
                  {currentRecipe.subtitle}
                </p>
              </div>

              {/* Meta stats pills */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-medium block">Persediaan</span>
                    <span className="font-bold text-xs text-stone-900">{currentRecipe.prepTime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-medium block">Memasak</span>
                    <span className="font-bold text-xs text-stone-900">{currentRecipe.cookTime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-medium block">Hasil</span>
                    <span className="font-bold text-xs text-stone-900">{currentRecipe.servings}</span>
                  </div>
                </div>
              </div>

              {/* CTA button to order ready-made */}
              {onOrderProduct && (
                <div className="pt-2">
                  <button
                    onClick={() => onOrderProduct(selectedRecipeIndex === 0 ? 'burger' : 'popia')}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-4 py-2.5 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                  >
                    <span>Tiada masa nak buat sendiri? Pesan siap di dapur kami sekarang!</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Recipe Image preview */}
            <div className="lg:col-span-5 relative h-64 lg:h-auto min-h-[300px]">
              <img
                src={currentRecipe.image}
                alt={currentRecipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
            </div>
          </div>

          {/* Detailed Content: Ingredients & Steps */}
          <div className="p-6 sm:p-10 border-t border-stone-100 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Ingredients Checklist (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-lg text-stone-900 flex items-center gap-2">
                  <span>🥣 Bahan-Bahan</span>
                </h4>
                <span className="text-[11px] text-stone-400">Tanda bahan yang ada</span>
              </div>

              {currentRecipe.ingredients.map((cat, cIdx) => (
                <div key={cIdx} className="space-y-2 bg-stone-50/70 p-4 rounded-2xl border border-stone-200/70">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-rose-800">
                    {cat.category}
                  </h5>
                  <ul className="space-y-2 pt-1">
                    {cat.items.map((item, iIdx) => {
                      const itemKey = `${currentRecipe.id}-${cIdx}-${iIdx}`;
                      const isChecked = !!checkedIngredients[itemKey];
                      return (
                        <li
                          key={iIdx}
                          onClick={() => toggleIngredient(itemKey)}
                          className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-0.5 w-4 h-4 text-rose-600 rounded border-stone-300 accent-rose-600 cursor-pointer"
                          />
                          <span className={`transition-all ${isChecked ? 'line-through text-stone-400' : 'group-hover:text-stone-900'}`}>
                            {item}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              {/* Pro Tips Box */}
              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Petua & Tips Rahsia Bonda</span>
                </div>
                <ul className="space-y-2 text-xs text-amber-950/90 leading-relaxed">
                  {currentRecipe.proTips.map((tip, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Step-by-Step Instructions (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <h4 className="font-display font-bold text-lg text-stone-900 flex items-center gap-2">
                <span>👩‍🍳 Langkah Demi Langkah</span>
              </h4>

              <div className="space-y-4">
                {currentRecipe.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-5 rounded-2xl bg-white border border-stone-200/90 hover:border-rose-300 hover:shadow-md transition-all space-y-2 relative"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm">
                        {step.stepNumber}
                      </div>
                      <h5 className="font-bold text-sm sm:text-base text-stone-900">
                        {step.title}
                      </h5>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-11">
                      {step.description}
                    </p>

                    {step.tip && (
                      <div className="ml-11 mt-2 p-2.5 bg-rose-50/60 rounded-xl border border-rose-100 flex items-start gap-2 text-xs text-rose-900 font-medium">
                        <Award className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{step.tip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
