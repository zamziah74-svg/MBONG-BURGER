import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, Check, Flame, Sparkles, Award } from 'lucide-react';
import { Product, ProductSizeOption } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, selectedSize?: ProductSizeOption, isCombo?: boolean) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<ProductSizeOption | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [isCombo, setIsCombo] = useState<boolean>(false);
  const [addedJustNow, setAddedJustNow] = useState<boolean>(false);

  // Calculate current unit price
  const basePrice = selectedSize ? selectedSize.price : product.basePrice;
  const unitPrice = isCombo && product.comboPriceExtra ? basePrice + product.comboPriceExtra : basePrice;
  const totalPrice = unitPrice * quantity;

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(prev + 1, product.stockCount || 99));
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAdd = () => {
    if (!product.inStock) return;
    onAddToCart(product, quantity, selectedSize, isCombo);
    setAddedJustNow(true);
    setTimeout(() => {
      setAddedJustNow(false);
    }, 1400);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group relative">
      {/* Top badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 pointer-events-none">
        {product.isPopular && (
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-[11px] px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Award className="w-3 h-3" />
            <span>Paling Laris</span>
          </span>
        )}
        {product.isSpicy && (
          <span className="bg-red-600 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Flame className="w-3 h-3 fill-white" />
            <span>{product.spiceLevel || 'Pedas'}</span>
          </span>
        )}
        {product.category === 'burger' && (
          <span className="bg-rose-900/80 backdrop-blur-md text-white font-semibold text-[10px] px-2 py-0.5 rounded-full">
            Homemade Patty
          </span>
        )}
      </div>

      {/* Product Image */}
      <div 
        className="relative h-52 sm:h-56 w-full overflow-hidden bg-stone-100 cursor-pointer"
        onClick={() => onQuickView && onQuickView(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <span className="text-white text-xs font-semibold bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-xs">
            Klik untuk butiran penuh
          </span>
        </div>

        {/* Stock warning */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-600 text-white px-3 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider">
              Habis Stok Sementara
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Tagline / Subtitle */}
          <div className="flex items-center justify-between text-xs text-rose-700 font-semibold mb-1">
            <span className="capitalize">{product.category === 'popia' ? 'Popia Simpul Rangup' : product.category === 'burger' ? 'Burger Panas Segar' : 'Kombo Hidangan'}</span>
            {product.flavor && (
              <span className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded-md font-medium text-[11px] border border-rose-200/50">
                {product.flavor}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onQuickView && onQuickView(product)}
            className="font-display font-bold text-lg text-stone-900 leading-snug group-hover:text-rose-700 transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed line-clamp-2 mt-1.5">
            {product.description}
          </p>
        </div>

        {/* Size Selection for Popia Simpul */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="space-y-1.5 bg-amber-50/60 p-2.5 rounded-2xl border border-amber-100/80">
            <label className="text-[11px] font-bold text-amber-950 block">
              Pilih Saiz Balang:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {product.sizes.map((size) => {
                const isSelected = selectedSize?.id === size.id;
                return (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-1.5 py-1.5 rounded-xl text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600 text-white font-extrabold shadow-sm scale-102'
                        : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/60'
                    }`}
                  >
                    <div className="text-[10px] leading-tight font-semibold line-clamp-1">{size.name.split(' ')[1] || size.name}</div>
                    <div className="text-[11px] font-bold mt-0.5">RM {size.price.toFixed(2)}</div>
                  </button>
                );
              })}
            </div>
            {selectedSize && (
              <p className="text-[10px] text-amber-900 font-medium text-center pt-0.5">
                Berat bersih: {selectedSize.weightOrSize}
              </p>
            )}
          </div>
        )}

        {/* Combo Upsell for Burgers */}
        {product.comboAvailable && (
          <label className="flex items-center gap-2 p-2 rounded-xl bg-rose-50/60 border border-rose-100 hover:bg-rose-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={isCombo}
              onChange={(e) => setIsCombo(e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded focus:ring-rose-400 accent-rose-600 cursor-pointer"
            />
            <div className="text-[11px] leading-tight">
              <span className="font-bold text-stone-900 block">Jadikan Set Kombo (+RM {product.comboPriceExtra?.toFixed(2)})</span>
              <span className="text-stone-500">Termasuk French Fries Rangup & Air Sejuk</span>
            </div>
          </label>
        )}

        {/* Price & Quantity & Add to Cart action */}
        <div className="pt-2 border-t border-stone-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-stone-500 font-medium block">Jumlah Harga</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-rose-600 font-bold">RM</span>
                <span className="text-2xl font-black text-stone-900 font-display">
                  {totalPrice.toFixed(2)}
                </span>
                {quantity > 1 && (
                  <span className="text-[10px] text-stone-400">
                    (@ RM {unitPrice.toFixed(2)})
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 1 || !product.inStock}
                className="w-7 h-7 rounded-lg bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-sm shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Kurangkan kuantiti"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center font-extrabold text-sm text-stone-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={!product.inStock}
                className="w-7 h-7 rounded-lg bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-sm shadow-2xs disabled:opacity-40 transition-colors cursor-pointer"
                aria-label="Tambah kuantiti"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer ${
              addedJustNow
                ? 'bg-emerald-600 text-white shadow-emerald-200'
                : !product.inStock
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-rose-200 hover:shadow-lg'
            }`}
          >
            {addedJustNow ? (
              <>
                <Check className="w-4 h-4 animate-scale" />
                <span>Dimasukkan ke Troli!</span>
              </>
            ) : !product.inStock ? (
              <span>Stok Habis</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-amber-200" />
                <span>Tambah ke Troli</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
