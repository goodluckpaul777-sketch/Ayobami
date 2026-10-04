import React from 'react';
import { 
  Star, 
  ShoppingBag, 
  Eye, 
  MessageCircle, 
  Check, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { Product } from '../types';
import { formatNaira } from '../utils/formatters';
import { STORE_INFO } from '../data/initialData';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenLightbox?: (imageUrl: string, title: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  onOpenLightbox,
}) => {
  const primaryImage = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80';

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURI(
      `Hello Ayobami SAM Venture, I want to purchase:\n*${product.name}*\nPrice: ${formatNaira(product.price)} (${product.unit})\nSKU: ${product.sku || 'N/A'}\nPlease confirm availability and delivery dispatch.`
    );
    window.open(`https://wa.me/${STORE_INFO.whatsapp.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <div 
      onClick={() => onSelect(product)}
      className="group bg-white rounded-2xl border border-stone-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/3 sm:aspect-square overflow-hidden bg-stone-100">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {product.isBestSeller && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
              New Arrival
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Multiple Images Counter */}
        {product.images && product.images.length > 1 && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-900/70 text-white backdrop-blur-xs">
            {product.images.length} photos
          </div>
        )}

        {/* Hover Action: Zoom in Lightbox */}
        {onOpenLightbox && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenLightbox(primaryImage, product.name);
            }}
            className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-white/90 text-stone-800 hover:text-amber-700 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            title="View Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-amber-800">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-1 text-stone-600">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-stone-400">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 className="font-semibold text-stone-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>

          <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-stone-100">
          {/* Price & Unit */}
          <div className="flex items-baseline justify-between gap-1">
            <div>
              <div className="text-base sm:text-lg font-bold text-stone-900 font-serif">
                {formatNaira(product.price)}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-[11px] text-stone-400 line-through">
                  {formatNaira(product.originalPrice)}
                </div>
              )}
            </div>
            <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium text-right">
              {product.unit}
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs border border-amber-200 transition-all flex items-center justify-center gap-1 active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleWhatsAppInquiry}
              className="py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-xs border border-emerald-200 transition-all flex items-center justify-center gap-1 active:scale-95"
              title="Order directly on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
