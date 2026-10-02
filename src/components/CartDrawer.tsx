import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Bike, Store, Check, Sparkles } from 'lucide-react';
import { CartItem, DeliveryMethod, StoreSettings } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  appliedDiscount: number;
  setAppliedDiscount: (amount: number) => void;
  storeSettings: StoreSettings;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  deliveryMethod,
  setDeliveryMethod,
  discountCode,
  setDiscountCode,
  appliedDiscount,
  setAppliedDiscount,
  storeSettings,
  onProceedToCheckout
}) => {
  const [couponInput, setCouponInput] = useState<string>(discountCode);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const isFreeDelivery = deliveryMethod === 'pickup' || subtotal >= storeSettings.freeDeliveryThreshold;
  const deliveryFee = deliveryMethod === 'pickup' ? 0 : (isFreeDelivery ? 0 : storeSettings.deliveryFee);
  const totalAmount = Math.max(0, subtotal + deliveryFee - appliedDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponInput.trim().toUpperCase();
    if (!clean) {
      setAppliedDiscount(0);
      setDiscountCode('');
      setCouponMessage(null);
      return;
    }

    // Check storeSettings coupons first
    const activeCoupons = storeSettings.coupons || [];
    const foundCoupon = activeCoupons.find((c) => c.code.toUpperCase() === clean && c.active);

    if (foundCoupon) {
      if (subtotal < foundCoupon.minSpend) {
        setCouponMessage({
          text: `Pesanan minimum RM ${foundCoupon.minSpend.toFixed(2)} diperlukan untuk guna kupon ini.`,
          isError: true,
        });
        return;
      }
      const disc =
        foundCoupon.discountType === 'percentage'
          ? Math.round(((subtotal * foundCoupon.discountValue) / 100) * 100) / 100
          : foundCoupon.discountValue;

      setAppliedDiscount(disc);
      setDiscountCode(foundCoupon.code);
      setCouponMessage({
        text: `Kupon ${foundCoupon.code} berjaya! Anda jimat RM ${disc.toFixed(2)}.`,
        isError: false,
      });
    } else if (clean === 'KASIH5') {
      setAppliedDiscount(5.00);
      setDiscountCode('KASIH5');
      setCouponMessage({ text: 'Tahniah! Diskaun Kasih RM 5.00 telah ditolak.', isError: false });
    } else if (clean === 'SEDAP10') {
      const disc = Math.round(subtotal * 0.1 * 100) / 100;
      setAppliedDiscount(disc);
      setDiscountCode('SEDAP10');
      setCouponMessage({ text: `Kupon 10% berjaya! Anda jimat RM ${disc.toFixed(2)}.`, isError: false });
    } else {
      setCouponMessage({ text: 'Kod kupon tidak sah atau telah tamat tempoh.', isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-rose-100 flex items-center justify-between bg-gradient-to-r from-rose-50/70 to-amber-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-stone-900 leading-tight">
                Troli Pesanan Anda
              </h2>
              <p className="text-xs text-stone-500">
                {items.length === 0 ? 'Troli kosong' : `${items.length} jenis hidangan dipilih`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 hover:bg-white rounded-full transition-colors cursor-pointer"
            aria-label="Tutup troli"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Delivery Mode Selector */}
        <div className="p-4 bg-stone-50 border-b border-stone-200/70">
          <div className="text-xs font-bold text-stone-700 mb-2">Kaedah Penerimaan Pesanan:</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDeliveryMethod('delivery')}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                deliveryMethod === 'delivery'
                  ? 'border-rose-600 bg-rose-50 text-rose-800 shadow-xs ring-1 ring-rose-400'
                  : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Bike className="w-4 h-4 text-rose-600" />
              <span>Penghantaran (Delivery)</span>
            </button>
            <button
              type="button"
              onClick={() => setDeliveryMethod('pickup')}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                deliveryMethod === 'pickup'
                  ? 'border-rose-600 bg-rose-50 text-rose-800 shadow-xs ring-1 ring-rose-400'
                  : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Store className="w-4 h-4 text-rose-600" />
              <span>Ambil Sendiri (Pickup)</span>
            </button>
          </div>

          {/* Delivery threshold notice */}
          {deliveryMethod === 'delivery' && (
            <div className="mt-2 text-[11px] text-stone-600 flex items-center justify-between">
              {subtotal >= storeSettings.freeDeliveryThreshold ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Anda layak dapat Penghantaran Percuma!
                </span>
              ) : (
                <span>
                  Tambah <strong>RM {(storeSettings.freeDeliveryThreshold - subtotal).toFixed(2)}</strong> lagi untuk FREE DELIVERY!
                </span>
              )}
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-4xl mb-3">
                🍔
              </div>
              <h3 className="font-bold text-stone-800 text-base mb-1">
                Troli Anda Masih Kosong
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mb-4">
                Pilih burger panas buatan sendiri atau popia simpul kasih rangup untuk mulakan pesanan anda hari ini!
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-200 hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Pilih Makanan Sekarang
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartItemId}
                className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-2xs flex gap-3 items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-100"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                    {item.name}
                  </h4>
                  {item.selectedSize && (
                    <span className="inline-block text-[10px] text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded font-medium border border-amber-200/60 mt-0.5">
                      {item.selectedSize.name} ({item.selectedSize.weightOrSize})
                    </span>
                  )}
                  {item.isCombo && (
                    <span className="inline-block ml-1 text-[10px] text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded font-medium border border-rose-200/60 mt-0.5">
                      Set Kombo (Fries + Air)
                    </span>
                  )}
                  {item.specialInstructions && (
                    <p className="text-[10px] text-stone-400 italic truncate mt-0.5">
                      Nota: {item.specialInstructions}
                    </p>
                  )}
                  <div className="text-xs font-black text-rose-700 mt-1">
                    RM {(item.unitPrice * item.quantity).toFixed(2)}{' '}
                    <span className="text-[10px] font-normal text-stone-400">
                      (@ RM {item.unitPrice.toFixed(2)})
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-1.5">
                  <button
                    onClick={() => onRemoveItem(item.cartItemId)}
                    className="text-stone-300 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                    title="Padam item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
                    <button
                      onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                      className="w-5 h-5 rounded bg-white text-stone-700 flex items-center justify-center font-bold text-xs shadow-2xs hover:bg-stone-200 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-bold text-xs text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-5 h-5 rounded bg-white text-stone-700 flex items-center justify-center font-bold text-xs shadow-2xs hover:bg-stone-200 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo Code & Summary Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-white space-y-3">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Kod Kupon (KASIH5 / SEDAP10)"
                  className="w-full pl-8 pr-3 py-2 text-xs uppercase rounded-xl border border-stone-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-200 outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Guna
              </button>
            </form>
            {couponMessage && (
              <p className={`text-[11px] font-semibold ${couponMessage.isError ? 'text-red-600' : 'text-emerald-700'}`}>
                {couponMessage.text}
              </p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1 text-xs text-stone-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal Makanan</span>
                <span className="font-semibold text-stone-900">RM {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  {deliveryMethod === 'delivery' ? 'Caj Penghantaran' : 'Ambil Sendiri (Pickup)'}
                </span>
                <span className="font-semibold">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">PERCUMA</span>
                  ) : (
                    `RM ${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Diskaun ({discountCode})</span>
                  <span>-RM {appliedDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-stone-900">Jumlah Keseluruhan</span>
                <div className="text-xl font-black text-rose-700 font-display">
                  RM {totalAmount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClearCart}
                className="px-3 py-3 rounded-2xl border border-stone-200 text-stone-500 hover:text-red-600 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
                title="Kosongkan Troli"
              >
                Kosongkan
              </button>
              <button
                type="button"
                onClick={onProceedToCheckout}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-sm shadow-md shadow-rose-200 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Teruskan ke Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
