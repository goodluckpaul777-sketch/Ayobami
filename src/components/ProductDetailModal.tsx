import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  MessageCircle, 
  Check, 
  ShieldCheck, 
  Truck, 
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { Product } from '../types';
import { formatNaira } from '../utils/formatters';
import { STORE_INFO } from '../data/initialData';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedColor?: string) => void;
  onOpenLightbox?: (imageUrl: string, title: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenLightbox,
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );
  const [addedNotice, setAddedNotice] = useState(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'];

  const currentImage = images[activeImageIndex] || images[0];

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedColor);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const text = encodeURI(
      `Hello Ayobami SAM Venture, I want to order this product:\n*${product.name}*\nQuantity: ${quantity} (${product.unit})` +
      (selectedColor ? `\nColor: ${selectedColor}` : '') +
      `\nTotal Estimated Price: ${formatNaira(product.price * quantity)}\nSKU: ${product.sku || 'N/A'}\nPlease confirm dispatch details to my address.`
    );
    window.open(`https://wa.me/${STORE_INFO.whatsapp.replace('+', '')}?text=${text}`, '_blank');
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-y-auto no-scrollbar border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white transition-all hover:scale-105"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 sm:p-8">
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 space-y-3">
            {/* Main Image Stage */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Lightbox Trigger */}
              {onOpenLightbox && (
                <button
                  onClick={() => onOpenLightbox(currentImage, product.name)}
                  className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-white/90 text-stone-800 hover:text-amber-700 shadow-md transition-all hover:scale-110"
                  title="Expand Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}

              {/* Image Prev/Next Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {discountPercent > 0 && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm">
                  Save {discountPercent}%
                </div>
              )}
            </div>

            {/* Thumbnails list */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      idx === activeImageIndex
                        ? 'border-amber-600 scale-105 shadow-md'
                        : 'border-stone-200 hover:border-amber-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span className="font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                  {product.categoryLabel}
                </span>
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-stone-900">{product.rating}</span>
                  <span>({product.reviewsCount} customer reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-950 leading-snug">
                {product.name}
              </h2>

              {product.sku && (
                <div className="text-[11px] text-stone-400 mt-0.5">
                  Merchant SKU: <span className="font-mono text-stone-600">{product.sku}</span>
                </div>
              )}

              {/* Price & Unit */}
              <div className="mt-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold font-serif text-stone-950">
                    {formatNaira(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-stone-400 line-through">
                      {formatNaira(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-xs text-stone-600 font-medium">
                    / {product.unit}
                  </span>
                </div>

                {/* Wholesale Callout */}
                {product.wholesalePrice && product.wholesaleMinYards && (
                  <div className="mt-2 text-xs text-amber-900 font-medium bg-amber-100/70 p-2 rounded-xl flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      <strong>Wholesale Price:</strong> {formatNaira(product.wholesalePrice)} when buying {product.wholesaleMinYards}+ yards (Aso-Ebi packages available).
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Material spec */}
              {product.material && (
                <div className="mt-3 text-xs text-stone-700">
                  <span className="font-semibold text-stone-900">Fabric/Material:</span> {product.material}
                </div>
              )}

              {/* Color variants selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-stone-900 mb-2">
                    Available Colors / Patterns:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          selectedColor === color
                            ? 'border-amber-600 bg-amber-600 text-white font-semibold shadow-xs'
                            : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-amber-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Features bullets */}
              {product.features && product.features.length > 0 && (
                <div className="mt-4 space-y-1.5">
                  <div className="text-xs font-semibold text-stone-900">Key Highlights:</div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-stone-600">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom Purchase Bar */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-200 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-bold text-xs sm:text-sm text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-200 font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedNotice ? 'Added to Cart ✓' : 'Add to Cart'}</span>
                </button>
              </div>

              {/* WhatsApp direct buy */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Buy via WhatsApp (Direct Merchant Chat)</span>
              </button>

              {/* Guarantees */}
              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-amber-600" />
                  Waybill across Nigeria
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Balogun Merchant Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
