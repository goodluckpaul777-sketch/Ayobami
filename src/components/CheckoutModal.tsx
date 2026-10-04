import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  Copy, 
  Check, 
  CreditCard, 
  MessageCircle, 
  MapPin, 
  ShieldCheck, 
  Truck,
  Building,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, OrderDetails } from '../types';
import { formatNaira } from '../utils/formatters';
import { STORE_INFO } from '../data/initialData';
import { StoreService } from '../services/storeService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [stateOrCity, setStateOrCity] = useState('Lagos Mainland');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'whatsapp' | 'pickup'>('bank_transfer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Delivery fee estimation logic
  const getShippingFee = () => {
    if (paymentMethod === 'pickup') return 0;
    if (stateOrCity.includes('Lagos')) return 3500;
    return 6500; // Interstate waybill across Nigeria
  };

  const shippingFee = getShippingFee();
  const grandTotal = subtotal + shippingFee;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(STORE_INFO.accountDetails.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phoneNumber || (!deliveryAddress && paymentMethod !== 'pickup')) {
      alert('Please fill in your name, contact phone number, and delivery details.');
      return;
    }

    setIsSubmitting(true);

    const orderPayload: OrderDetails = {
      customerName,
      phoneNumber,
      email,
      stateOrCity,
      deliveryAddress: paymentMethod === 'pickup' ? 'Store Pickup: Shop 14, Balogun Central Plaza, Lagos Island' : deliveryAddress,
      paymentMethod,
      notes,
      items: items.map(it => ({
        productId: it.product.id,
        productName: it.product.name,
        unit: it.product.unit,
        price: it.product.price,
        quantity: it.quantity,
        color: it.selectedColor,
      })),
      subtotal,
      shippingFee,
      grandTotal,
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore / local
    await StoreService.recordOrder(orderPayload);

    // Fire confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setIsSubmitting(false);
    setIsSuccess(true);
    onOrderSuccess();

    // If whatsapp or bank transfer, prompt WhatsApp send
    if (paymentMethod === 'whatsapp' || paymentMethod === 'bank_transfer') {
      const itemsText = items.map((it, idx) => `${idx + 1}. *${it.product.name}* (Qty: ${it.quantity}) ${it.selectedColor ? `[${it.selectedColor}]` : ''} - ${formatNaira(it.product.price * it.quantity)}`).join('\n');
      const whatsappMsg = encodeURI(
        `*NEW ORDER — Ayobami SAM Venture*\n` +
        `--------------------------------\n` +
        `👤 *Customer:* ${customerName}\n` +
        `📞 *Phone:* ${phoneNumber}\n` +
        `📍 *Location:* ${stateOrCity}\n` +
        `🏠 *Delivery Address:* ${paymentMethod === 'pickup' ? 'Store Pickup (Balogun)' : deliveryAddress}\n` +
        `💳 *Payment:* ${paymentMethod.toUpperCase()}\n\n` +
        `*ORDERED ITEMS:*\n${itemsText}\n\n` +
        `📦 *Subtotal:* ${formatNaira(subtotal)}\n` +
        `🚚 *Shipping Fee:* ${formatNaira(shippingFee)}\n` +
        `💰 *TOTAL AMOUNT:* ${formatNaira(grandTotal)}\n` +
        (notes ? `\n📝 *Notes:* ${notes}` : '') +
        `\n\nPlease confirm availability and payment receipt.`
      );
      window.open(`https://wa.me/${STORE_INFO.whatsapp.replace('+', '')}?text=${whatsappMsg}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-5 sm:p-8 my-6 border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Order Received Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
              Thank you, <strong>{customerName}</strong>. Your order has been registered in the Ayobami SAM Venture merchant system.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left max-w-md mx-auto text-xs space-y-2">
              <div className="font-semibold text-stone-900 flex items-center justify-between">
                <span>Total Amount:</span>
                <span className="text-base font-bold text-amber-900">{formatNaira(grandTotal)}</span>
              </div>
              <div className="text-stone-600">
                <span>Account Number: </span>
                <strong className="text-stone-900">{STORE_INFO.accountDetails.accountNumber}</strong> ({STORE_INFO.accountDetails.bankName})
              </div>
              <div className="text-[11px] text-amber-800">
                Please send your payment transfer receipt to our WhatsApp support at <strong>{STORE_INFO.phone}</strong> for instant dispatch packaging.
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/${STORE_INFO.whatsapp.replace('+', '')}?text=Hello%20Ayobami%20SAM%20Venture,%20I%20just%20completed%20an%20order%20for%20${customerName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Merchant on WhatsApp</span>
              </a>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs"
              >
                Close &amp; Return to Store
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/60 px-2.5 py-0.5 rounded-full">
                Secure Checkout
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1">
                Complete Your Order
              </h2>
              <p className="text-xs text-stone-500">
                Direct dispatch from Balogun Market with waybill to all 36 states across Nigeria.
              </p>
            </div>

            {/* Step 1: Customer Contact */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                1. Customer &amp; Delivery Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Mrs. Titilayo Adebisi"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 08012345678"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    State / Destination *
                  </label>
                  <select
                    value={stateOrCity}
                    onChange={(e) => setStateOrCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                  >
                    <option value="Lagos Island">Lagos Island (Same-day dispatch)</option>
                    <option value="Lagos Mainland">Lagos Mainland (Ikeja, Surulere, etc.)</option>
                    <option value="Abuja FCT">Abuja FCT (Interstate Waybill)</option>
                    <option value="Rivers - Port Harcourt">Rivers (Port Harcourt)</option>
                    <option value="Oyo - Ibadan">Oyo (Ibadan)</option>
                    <option value="Kano / Kaduna">Kano / Kaduna (Northern Transit)</option>
                    <option value="Delta / Edo">Delta / Edo (Warri, Benin)</option>
                    <option value="Enugu / Anambra / Imo">Enugu / Onitsha / Owerri</option>
                    <option value="Other States">Other Nigerian State (Motor Park Waybill)</option>
                    <option value="International">International Shipping (Diaspora DHL)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              {paymentMethod !== 'pickup' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Street Address / Delivery Landmark *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. No. 12 Adeola Odeku St, Victoria Island or God Is Good Motor Park, Ikeja"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                2. Select Payment &amp; Fulfillment Mode
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-amber-600 bg-amber-50 text-amber-950 font-semibold shadow-xs'
                      : 'border-stone-200 hover:border-amber-300 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Building className="w-4 h-4 text-amber-700" />
                    <span>Bank Transfer</span>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Direct transfer to verified merchant account.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('whatsapp')}
                  className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                    paymentMethod === 'whatsapp'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-xs'
                      : 'border-stone-200 hover:border-emerald-300 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Order</span>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Send invoice to sales rep on WhatsApp.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('pickup')}
                  className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                    paymentMethod === 'pickup'
                      ? 'border-stone-900 bg-stone-100 text-stone-950 font-semibold shadow-xs'
                      : 'border-stone-200 hover:border-stone-400 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <MapPin className="w-4 h-4 text-stone-800" />
                    <span>Store Pickup</span>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Pay &amp; pick up at Balogun Market shop.
                  </div>
                </button>
              </div>

              {/* Bank Account Details Box */}
              {paymentMethod === 'bank_transfer' && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-300 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-amber-950">
                    <span>Ayobami SAM Venture Merchant Account</span>
                    <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded-full text-amber-900">
                      Official Merchant
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-stone-500 block">Bank Name:</span>
                      <strong>{STORE_INFO.accountDetails.bankName}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Account Name:</span>
                      <strong>{STORE_INFO.accountDetails.accountName}</strong>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-200">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-sans">Account No:</span>
                      <strong className="text-amber-800 text-sm tracking-wider font-mono">
                        {STORE_INFO.accountDetails.accountNumber}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-1 transition-all"
                    >
                      {copiedAccount ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Cost Breakdown */}
            <div className="pt-3 border-t border-stone-200 bg-stone-50 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal ({items.length} items):</span>
                <span>{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping / Waybill:</span>
                <span>{shippingFee === 0 ? 'FREE (Store Pickup)' : formatNaira(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-950 pt-1 border-t border-stone-200">
                <span>Grand Total:</span>
                <span className="font-serif text-base text-amber-900">{formatNaira(grandTotal)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Registering Order...</span>
                ) : (
                  <>
                    <span>Confirm Order ({formatNaira(grandTotal)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
