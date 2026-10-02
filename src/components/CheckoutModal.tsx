import React, { useState } from 'react';
import { X, Check, ShieldCheck, QrCode, CreditCard, Banknote, MapPin, Phone, User, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { CartItem, DeliveryMethod, PaymentMethod, Order, StoreSettings } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  deliveryMethod: DeliveryMethod;
  appliedDiscount: number;
  discountCode: string;
  storeSettings: StoreSettings;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  deliveryMethod: initialDeliveryMethod,
  appliedDiscount,
  discountCode,
  storeSettings,
  onOrderCompleted,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(initialDeliveryMethod);
  const [address, setAddress] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('Hari Ini - Secepat Mungkin (30-45 minit)');
  const [notes, setNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('duitnow');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const isFreeDelivery = deliveryMethod === 'pickup' || subtotal >= storeSettings.freeDeliveryThreshold;
  const deliveryFee = deliveryMethod === 'pickup' ? 0 : (isFreeDelivery ? 0 : storeSettings.deliveryFee);
  const totalAmount = Math.max(0, subtotal + deliveryFee - appliedDiscount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim()) {
      setFormError('Sila masukkan nama anda untuk pesanan.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 8) {
      setFormError('Sila masukkan nombor telefon WhatsApp yang sah untuk kemaskini pesanan.');
      return;
    }
    if (deliveryMethod === 'delivery' && (!address.trim() || address.length < 5)) {
      setFormError('Sila masukkan alamat lengkap untuk penghantaran makanan.');
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const orderNum = `BP-${Math.floor(1000 + Math.random() * 9000)}`;
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: formattedDate,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryMethod,
      address: deliveryMethod === 'delivery' ? address.trim() : undefined,
      preferredTime,
      notes: notes.trim(),
      items: [...items],
      subtotal,
      deliveryFee,
      discount: appliedDiscount,
      total: totalAmount,
      paymentMethod,
      status: 'Baru',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderCompleted(newOrder);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-rose-100 animate-in fade-in zoom-in-95 duration-200 my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-rose-100 flex items-center justify-between bg-gradient-to-r from-rose-50 to-amber-50">
          <div>
            <h2 className="font-display font-bold text-xl text-stone-900 leading-tight">
              Maklumat Pesanan & Checkout
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Sila lengkapkan butiran untuk pesanan terus ke dapur kami
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-700 font-semibold">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section 1: Customer Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-600" />
              <span>1. Butiran Pelanggan</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nama Penuh <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Siti Aisyah"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 text-xs sm:text-sm text-stone-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nombor Telefon (WhatsApp) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Contoh: 012-345 6789"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 text-xs sm:text-sm text-stone-800 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Delivery vs Pickup Method */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              <span>2. Kaedah & Alamat Penerimaan</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <label 
                className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                  deliveryMethod === 'delivery'
                    ? 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-200'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="delivery"
                  checked={deliveryMethod === 'delivery'}
                  onChange={() => setDeliveryMethod('delivery')}
                  className="w-4 h-4 text-rose-600 accent-rose-600"
                />
                <div>
                  <div className="font-bold text-xs text-stone-900">Penghantaran Rider</div>
                  <div className="text-[11px] text-stone-500">
                    {isFreeDelivery ? 'Percuma' : `Caj RM ${storeSettings.deliveryFee.toFixed(2)}`}
                  </div>
                </div>
              </label>

              <label 
                className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                  deliveryMethod === 'pickup'
                    ? 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-200'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="pickup"
                  checked={deliveryMethod === 'pickup'}
                  onChange={() => setDeliveryMethod('pickup')}
                  className="w-4 h-4 text-rose-600 accent-rose-600"
                />
                <div>
                  <div className="font-bold text-xs text-stone-900">Ambil Sendiri (Pickup)</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">Percuma di Dapur Kami</div>
                </div>
              </label>
            </div>

            {deliveryMethod === 'delivery' ? (
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Alamat Lengkap Penghantaran <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="No rumah, jalan, taman/seksyen, poskod (Kawasan Shah Alam, Subang, Klang, Petaling Jaya)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 text-xs sm:text-sm text-stone-800 outline-none"
                />
              </div>
            ) : (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                <span className="font-bold block">Lokasi Pengambilan Sendiri:</span>
                <span>{storeSettings.pickupLocation}</span>
                <span className="block text-[11px] text-amber-700 mt-1">
                  Waktu operasi: {storeSettings.operatingHours}
                </span>
              </div>
            )}

            {/* Preferred Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Masa Diperlukan <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 text-xs sm:text-sm text-stone-800 outline-none bg-white cursor-pointer"
                  >
                    <option value="Hari Ini - Secepat Mungkin (30-45 minit)">Hari Ini - Secepat Mungkin (30-45 minit)</option>
                    <option value="Minum Petang (4:30 PM - 5:30 PM)">Minum Petang (4:30 PM - 5:30 PM)</option>
                    <option value="Makan Malam Awal (6:30 PM - 7:30 PM)">Makan Malam Awal (6:30 PM - 7:30 PM)</option>
                    <option value="Makan Malam Santai (8:30 PM - 9:30 PM)">Makan Malam Santai (8:30 PM - 9:30 PM)</option>
                    <option value="Tempahan Esok Hari">Tempahan Esok Hari (Nyatakan di nota)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nota Khas Pesanan
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Cth: Sos black pepper asing, tingkat 2"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 text-xs sm:text-sm text-stone-800 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <Banknote className="w-3.5 h-3.5 text-rose-600" />
              <span>3. Kaedah Pembayaran</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label 
                className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-2 cursor-pointer transition-all ${
                  paymentMethod === 'duitnow'
                    ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-200'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <QrCode className="w-6 h-6 text-rose-600" />
                <div>
                  <div className="font-bold text-xs text-stone-900">DuitNow QR</div>
                  <div className="text-[10px] text-stone-500">Scan & Bayar Pantas</div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="duitnow"
                  checked={paymentMethod === 'duitnow'}
                  onChange={() => setPaymentMethod('duitnow')}
                  className="sr-only"
                />
              </label>

              <label 
                className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-2 cursor-pointer transition-all ${
                  paymentMethod === 'fpx'
                    ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-200'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-6 h-6 text-rose-600" />
                <div>
                  <div className="font-bold text-xs text-stone-900">FPX / Perbankan Online</div>
                  <div className="text-[10px] text-stone-500">Maybank2u / CIMB / Bank Islam</div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="fpx"
                  checked={paymentMethod === 'fpx'}
                  onChange={() => setPaymentMethod('fpx')}
                  className="sr-only"
                />
              </label>

              <label 
                className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-200'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Banknote className="w-6 h-6 text-rose-600" />
                <div>
                  <div className="font-bold text-xs text-stone-900">
                    {deliveryMethod === 'delivery' ? 'Tunai / COD' : 'Tunai Semasa Ambil'}
                  </div>
                  <div className="text-[10px] text-stone-500">Bayar semasa terima</div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="sr-only"
                />
              </label>
            </div>

            {/* DuitNow QR simulation helper */}
            {paymentMethod === 'duitnow' && (
              <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200 flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl border border-rose-300 flex items-center justify-center p-1 shrink-0">
                  <div className="grid grid-cols-3 gap-0.5 w-full h-full">
                    <div className="bg-rose-700 rounded-2xs" />
                    <div className="bg-stone-800 rounded-2xs" />
                    <div className="bg-rose-700 rounded-2xs" />
                    <div className="bg-stone-800 rounded-2xs" />
                    <div className="bg-rose-700 rounded-2xs" />
                    <div className="bg-stone-800 rounded-2xs" />
                    <div className="bg-rose-700 rounded-2xs" />
                    <div className="bg-stone-800 rounded-2xs" />
                    <div className="bg-rose-700 rounded-2xs" />
                  </div>
                </div>
                <div className="text-xs">
                  <div className="font-bold text-stone-900">DuitNow QR Kak Zamziah Burger & Popia</div>
                  <div className="text-stone-600 text-[11px]">
                    Kod QR rasmi dan nombor akaun akan dipaparkan sebaik sahaja anda klik butang sahkan pesanan.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Order Summary Breakdown */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              Ringkasan Pesanan ({items.length} item)
            </h4>
            <div className="max-h-32 overflow-y-auto space-y-1.5 text-xs text-stone-600 pr-1">
              {items.map((it) => (
                <div key={it.cartItemId} className="flex justify-between items-center">
                  <span className="truncate pr-2">
                    {it.quantity}x {it.name} {it.selectedSize ? `(${it.selectedSize.name.split(' ')[0]})` : ''}
                  </span>
                  <span className="font-bold text-stone-800 shrink-0">
                    RM {(it.unitPrice * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-200/80 space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>RM {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Penghantaran</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-700">Percuma</strong> : `RM ${deliveryFee.toFixed(2)}`}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Diskaun Kupon ({discountCode})</span>
                  <span>-RM {appliedDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                <span className="font-bold text-stone-900 text-sm">Jumlah Perlu Dibayar:</span>
                <span className="text-xl font-black text-rose-700 font-display">
                  RM {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold transition-colors cursor-pointer"
            >
              Kembali ke Troli
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-sm shadow-lg shadow-rose-200 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Memproses Pesanan...</span>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Sahkan & Hantar Pesanan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
