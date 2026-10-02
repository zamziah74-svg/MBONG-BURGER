import React from 'react';
import { CheckCircle2, Phone, Copy, Check, Share2, Download, ArrowRight, Store, QrCode } from 'lucide-react';
import { Order, StoreSettings } from '../types';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  storeSettings: StoreSettings;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  storeSettings,
}) => {
  if (!order) return null;

  const [copied, setCopied] = React.useState(false);

  // Format the WhatsApp message text
  const generateWhatsAppMessage = () => {
    const itemsList = order.items
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.quantity}x ${it.name}* ${
            it.selectedSize ? `(${it.selectedSize.name})` : ''
          } ${it.isCombo ? '[Set Kombo]' : ''} - RM ${(it.unitPrice * it.quantity).toFixed(2)}`
      )
      .join('%0A');

    const msg = `*PESANAN BARU - BURGER %26 POPIA SIMPUL*%0A` +
      `No. Pesanan: *#${order.orderNumber}*%0A` +
      `Tarikh: ${order.createdAt}%0A%0A` +
      `*Pelanggan:* ${order.customerName}%0A` +
      `*No Telefon:* ${order.customerPhone}%0A` +
      `*Kaedah:* ${order.deliveryMethod === 'delivery' ? 'Penghantaran Rider' : 'Ambil Sendiri (Pickup)'}%0A` +
      `${order.address ? `*Alamat:* ${order.address}%0A` : ''}` +
      `*Masa Diperlukan:* ${order.preferredTime}%0A` +
      `${order.notes ? `*Nota Pesanan:* ${order.notes}%0A` : ''}%0A` +
      `*Senarai Pesanan:*%0A${itemsList}%0A%0A` +
      `*Subtotal:* RM ${order.subtotal.toFixed(2)}%0A` +
      `*Caj Penghantaran:* RM ${order.deliveryFee.toFixed(2)}%0A` +
      `${order.discount > 0 ? `*Diskaun:* -RM ${order.discount.toFixed(2)}%0A` : ''}` +
      `*JUMLAH KESELURUHAN:* *RM ${order.total.toFixed(2)}*%0A` +
      `*Bayaran:* ${order.paymentMethod.toUpperCase()}%0A%0A` +
      `Terima kasih Kak Zamziah, mohon sahkan pesanan saya ya! 🙏`;

    return msg;
  };

  const handleCopyReceipt = () => {
    const rawText = `PESANAN #${order.orderNumber}\nNama: ${order.customerName}\nJumlah: RM ${order.total.toFixed(2)}\nKaedah: ${order.deliveryMethod}\nStatus: ${order.status}`;
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-rose-100 animate-in fade-in zoom-in-95 duration-200 my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 border-2 border-white/40">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <span className="bg-emerald-800/80 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-emerald-400/40">
            Pesanan Berjaya Didaftarkan
          </span>
          <h2 className="text-2xl font-bold font-display mt-2">
            Terima Kasih, {order.customerName}!
          </h2>
          <p className="text-xs text-emerald-100 max-w-sm mx-auto mt-1">
            Pesanan anda telah masuk ke dapur Kak Zamziah. Sila hantar pesanan melalui WhatsApp untuk pengesahan segera.
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Order Number & Meta */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-stone-500 font-medium block">Nombor Pesanan</span>
              <span className="font-display font-extrabold text-xl text-stone-900">
                #{order.orderNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-stone-500 font-medium block">Kaedah</span>
              <span className="inline-block bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                {order.deliveryMethod === 'delivery' ? 'Penghantaran Rider' : 'Ambil Sendiri (Pickup)'}
              </span>
            </div>
          </div>

          {/* DuitNow QR Preview if chosen */}
          {order.paymentMethod === 'duitnow' && (
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-900">
                <QrCode className="w-4 h-4 text-rose-600" />
                <span>Imbas DuitNow QR untuk Pembayaran Pantas</span>
              </div>
              
              {/* QR representation */}
              <div className="inline-block p-3 bg-white rounded-2xl border border-rose-300 shadow-sm">
                <div className="w-36 h-36 mx-auto bg-stone-950 p-2 rounded-xl flex items-center justify-center text-white text-[10px] flex-col gap-1">
                  <div className="w-full h-full border-2 border-dashed border-rose-400/80 rounded-lg flex flex-col items-center justify-center text-center p-1">
                    <span className="font-bold text-xs text-rose-300">DuitNow QR</span>
                    <span className="text-[9px] text-stone-300 font-mono">{storeSettings.duitNowQrPhone || storeSettings.whatsappNumber}</span>
                    <span className="text-[8px] text-amber-300 mt-1 font-semibold">{storeSettings.storeName}</span>
                    <span className="text-xs font-bold text-white mt-1">RM {order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-stone-600">
                Akaun {storeSettings.bankName || 'Maybank'}: <strong className="font-mono text-stone-900">{storeSettings.bankAccountNo || '5123 4567 8901'}</strong> ({storeSettings.bankAccountHolder || storeSettings.ownerName})
              </div>
            </div>
          )}

          {/* Items Summary */}
          <div className="border border-stone-200 rounded-2xl p-3.5 space-y-2 text-xs">
            <div className="font-bold text-stone-700 uppercase tracking-wider text-[11px]">
              Ringkasan Item:
            </div>
            {order.items.map((it) => (
              <div key={it.cartItemId} className="flex justify-between items-center text-stone-700">
                <span>
                  {it.quantity}x {it.name} {it.selectedSize ? `(${it.selectedSize.name})` : ''}
                </span>
                <span className="font-bold text-stone-900">
                  RM {(it.unitPrice * it.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-stone-900">
              <span>Jumlah Keseluruhan:</span>
              <span className="text-rose-700 font-display text-base">RM {order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Primary Action: Direct WhatsApp to Owner */}
          <div className="space-y-2 pt-2">
            <a
              href={`https://wa.me/${storeSettings.whatsappNumber}?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Phone className="w-5 h-5 fill-white text-emerald-600" />
              <span>Hantar Salinan ke WhatsApp Penjual</span>
            </a>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyReceipt}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Disalin ke Papan Keratan' : 'Salin Maklumat Resit'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Kembali ke Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
