import React from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck,
  Truck
} from 'lucide-react';
import { CartItem } from '../types';
import { formatNaira } from '../utils/formatters';
import { STORE_INFO } from '../data/initialData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, color?: string) => void;
  onRemoveItem: (productId: string, color?: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    const itemList = items
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.product.name}* (Qty: ${it.quantity} ${it.product.unit}) ${it.selectedColor ? `[Color: ${it.selectedColor}]` : ''} — ${formatNaira(it.product.price * it.quantity)}`
      )
      .join('\n');

    const message = encodeURI(
      `Hello Ayobami SAM Venture, I want to place this order from your website:\n\n${itemList}\n\n*SUBTOTAL:* ${formatNaira(
        subtotal
      )}\nPlease share bank details and advise on delivery dispatch.`
    );

    window.open(`https://wa.me/${STORE_INFO.whatsapp.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-700" />
              <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                Your Shopping Cart
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-200 text-amber-900">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-base">
                  Your cart is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs">
                  Discover authentic Hollandais Ankara, luxury Lace, and industrial sewing machines from Balogun Market.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item, idx) => {
                const img = item.product.images?.[0] || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80';
                return (
                  <div key={`${item.product.id}-${item.selectedColor || idx}`} className="py-4 flex gap-3 sm:gap-4">
                    <img
                      src={img}
                      alt={item.product.name}
                      className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-100"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-xs sm:text-sm text-stone-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.product.id, item.selectedColor)}
                            className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.selectedColor && (
                          <div className="text-[11px] text-amber-800 font-medium mt-0.5">
                            Color: {item.selectedColor}
                          </div>
                        )}
                        <div className="text-[11px] text-stone-500">
                          {formatNaira(item.product.price)} / {item.product.unit}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1">
                        <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50 text-xs">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1, item.selectedColor)}
                            className="px-2.5 py-1 text-stone-600 hover:bg-stone-200"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-semibold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.selectedColor)}
                            className="px-2.5 py-1 text-stone-600 hover:bg-stone-200"
                          >
                            +
                          </button>
                        </div>

                        <div className="font-serif font-bold text-xs sm:text-sm text-stone-900">
                          {formatNaira(item.product.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="flex items-baseline justify-between text-stone-900">
                <span className="font-semibold text-xs sm:text-sm">Subtotal:</span>
                <span className="font-serif font-bold text-lg sm:text-xl text-stone-950">
                  {formatNaira(subtotal)}
                </span>
              </div>

              <div className="text-[11px] text-stone-500 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-amber-600" />
                  Delivery &amp; Waybill calculated at checkout
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified
                </span>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Checkout</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
