import React, { useState } from 'react';
import { InquiryItem, StoreSettings } from '../types';
import { X, Trash2, Plus, Minus, MessageCircle, ArrowRight, CheckCircle2, ShoppingBag, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: InquiryItem[];
  settings: StoreSettings;
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onSubmitInquiry: (customerName: string, phone: string, state: string, city: string, notes: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  settings,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSubmitInquiry,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerState, setCustomerState] = useState('Lagos');
  const [customerCity, setCustomerCity] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSendWhatsAppInquiry = () => {
    if (cart.length === 0) return;

    let itemsListText = cart.map((item, idx) => {
      const unit = item.product.unitLabel || (item.product.mainSection === 'cloths' ? 'yard' : item.product.mainSection === 'shoes' ? 'pair' : 'machine');
      const section = item.product.mainSection === 'cloths' ? 'Cloths' : item.product.mainSection === 'shoes' ? 'Shoes' : 'Tailoring Machine';
      const photoUrl = item.product.image && !item.product.image.startsWith('data:image')
        ? (item.product.image.startsWith('http') ? item.product.image : `${window.location.origin}${item.product.image}`)
        : '';
      const photoLine = photoUrl ? `\n   - 📷 Photo: ${photoUrl}` : '';

      return `${idx + 1}. *${item.product.name}*\n   - Section: ${section} (${item.product.category})\n   - Quantity: ${item.quantity} ${unit}${item.quantity > 1 ? 's' : ''}\n   - Variation: ${item.selectedColor || 'Standard'}${photoLine}`;
    }).join('\n\n');

    let customerInfoText = customerName ? `\n\n👤 *Customer Name:* ${customerName}\n📞 *Phone:* ${customerPhone}\n📍 *Delivery Location:* ${customerCity}, ${customerState} State` : '';

    const message = `Hello ${settings.storeName}, I would like to request price quotations and availability for the following items from your catalogue:\n\n${itemsListText}${customerInfoText}\n\nPlease reply with the prices, availability, and delivery options. Thank you!`;

    const url = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please enter your name and phone number');
      return;
    }

    onSubmitInquiry(customerName, customerPhone, customerState, customerCity, customerNotes);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClearCart();
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl border-l-2 border-[#D4AF37] flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 bg-[#0F2E22] text-white flex items-center justify-between border-b border-[#D4AF37]">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-[#D4AF37]" />
              <div>
                <h2 className="text-lg font-black tracking-tight text-white">
                  PRODUCT INQUIRY BAG
                </h2>
                <p className="text-xs text-emerald-300 font-semibold">
                  {totalItemsCount} item{totalItemsCount === 1 ? '' : 's'} selected for pricing quotation
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body List */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {isSubmitted ? (
              <div className="bg-emerald-50 border-2 border-emerald-600 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-black text-emerald-950">Inquiry Sent Successfully!</h3>
                <p className="text-xs text-emerald-800 font-medium">
                  Our sales team at Ayobami SAM Ventures will contact you via WhatsApp/Phone shortly.
                </p>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-[#FAF8F5] border border-gray-200 flex items-center justify-center mx-auto text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-black text-gray-800">Your Inquiry Bag is Empty</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Browse our Cloths, Shoes, and Tailoring Machine departments and add items you want to inquire about.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-[#0F2E22] text-white text-xs font-black"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                    <span>SELECTED ITEMS ({cart.length})</span>
                    <button
                      onClick={onClearCart}
                      className="text-red-600 hover:underline text-[11px]"
                    >
                      Clear All
                    </button>
                  </div>

                  {cart.map((item) => {
                    const unit = item.product.unitLabel || (item.product.mainSection === 'cloths' ? 'yard' : item.product.mainSection === 'shoes' ? 'pair' : 'machine');
                    return (
                      <div key={item.product.id} className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D9] flex items-center gap-3">
                        <img
                          src={item.product.image || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='}
                          alt={item.product.name}
                          className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-black uppercase text-[#D4AF37] block">
                            {item.product.category}
                          </span>
                          <h4 className="text-xs font-black text-[#0F2E22] truncate">
                            {item.product.name}
                          </h4>
                          <span className="text-[11px] text-gray-500 block">
                            Variation: {item.selectedColor || 'Standard'}
                          </span>
                        </div>

                        {/* Qty controls */}
                        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="w-6 h-6 rounded bg-gray-100 font-black text-xs flex items-center justify-center text-gray-700"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-bold text-xs text-[#0F2E22]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 rounded bg-gray-100 font-black text-xs flex items-center justify-center text-gray-700"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Optional Customer Contact Form */}
                <form onSubmit={handleFormSubmit} className="pt-4 border-t border-[#E8E2D9] space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-[#0F2E22] block">
                    Your Contact Information (Optional)
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Full Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold"
                    />
                    <input
                      type="tel"
                      placeholder="Phone / WhatsApp *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={customerState}
                      onChange={(e) => setCustomerState(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold"
                    >
                      {['Lagos', 'Abuja (FCT)', 'Ogun', 'Oyo', 'Rivers', 'Anambra', 'Enugu', 'Kano', 'Kaduna', 'Edo', 'Delta', 'Other States', 'International / Diaspora'].map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="City / Area"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold"
                    />
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Any special size/yardage notes or questions..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </form>
              </>
            )}

          </div>

          {/* Bottom Actions */}
          {cart.length > 0 && !isSubmitted && (
            <div className="p-6 bg-[#FAF8F5] border-t border-[#E8E2D9] space-y-3">
              <button
                type="button"
                onClick={handleSendWhatsAppInquiry}
                className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl hover:shadow-2xl transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>SEND INQUIRY LIST ON WHATSAPP</span>
              </button>

              <button
                type="button"
                onClick={handleFormSubmit}
                className="w-full py-3 px-4 rounded-xl bg-[#0F2E22] hover:bg-[#1B4332] text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <span>Submit Inquiry to Store Admin</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
