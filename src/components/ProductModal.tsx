import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Check, Heart, Sparkles, Flame, ShieldCheck } from 'lucide-react';
import { Product, ProductSizeOption } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    selectedSize?: ProductSizeOption,
    isCombo?: boolean,
    specialInstructions?: string
  ) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<ProductSizeOption | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [isCombo, setIsCombo] = useState<boolean>(false);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const basePrice = selectedSize ? selectedSize.price : product.basePrice;
  const unitPrice = isCombo && product.comboPriceExtra ? basePrice + product.comboPriceExtra : basePrice;
  const grandPrice = unitPrice * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.inStock) return;
    onAddToCart(product, quantity, selectedSize, isCombo, specialInstructions);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-rose-100 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Image Header */}
        <div className="relative h-64 sm:h-72 w-full bg-stone-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-black/20 to-black/30" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-stone-800 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-5 right-5 text-white">
            <span className="text-xs uppercase tracking-wider font-extrabold text-amber-300 bg-black/40 px-2.5 py-1 rounded-md">
              {product.category === 'burger' ? 'Burger Homemade Panas' : product.category === 'popia' ? 'Popia Simpul Rangup' : 'Set Kombo'}
            </span>
            <h2 className="text-2xl font-bold font-display mt-1 text-white leading-tight">
              {product.name}
            </h2>
            <p className="text-xs text-stone-200 mt-0.5 line-clamp-1">
              {product.tagline}
            </p>
          </div>
        </div>

        {/* Modal Form Details */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Description */}
          <div>
            <p className="text-sm text-stone-600 leading-relaxed">
              {product.description}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Dijamin Halal & Segar
              </span>
              {product.flavor && (
                <span className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Perisa {product.flavor}
                </span>
              )}
            </div>
          </div>

          {/* Size Choice if Popia */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-900 block">
                Pilihan Saiz Balang Popia:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {product.sizes.map((sz) => {
                  const isSel = selectedSize?.id === sz.id;
                  return (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        isSel
                          ? 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-300'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className="font-bold text-xs text-stone-900">{sz.name}</div>
                      <div className="text-[11px] text-stone-500">{sz.weightOrSize}</div>
                      <div className="text-sm font-black text-rose-700 mt-1">RM {sz.price.toFixed(2)}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Burger Combo Option */}
          {product.comboAvailable && (
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCombo}
                  onChange={(e) => setIsCombo(e.target.checked)}
                  className="w-5 h-5 text-rose-600 rounded focus:ring-rose-400 accent-rose-600 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-sm text-stone-900">
                    Tambah Set Kombo (+RM {product.comboPriceExtra?.toFixed(2)})
                  </div>
                  <div className="text-xs text-stone-600">
                    Dapat Kentang Goreng (French Fries) rangup + Minuman Sejuk Segar
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Special Customization Note */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1">
              Nota Khas Penyediaan (Pilihan):
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Contoh: Kurangkan sos lada hitam, jangan letak timun, sambal asing..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 text-xs sm:text-sm text-stone-800 outline-none"
            />
          </div>

          {/* Footer Quantity & Add to Cart */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] text-stone-400 font-medium">Jumlah Pesanan</div>
              <div className="text-2xl font-black text-stone-900 font-display">
                RM {grandPrice.toFixed(2)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Counter */}
              <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-sm shadow-2xs transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-extrabold text-sm text-stone-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-sm shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!product.inStock}
                className={`px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                  isSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200'
                }`}
              >
                {isSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Ditambah!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-amber-200" />
                    <span>Tambah Pesanan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
