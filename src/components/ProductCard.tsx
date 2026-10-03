import React, { useState } from 'react';
import { FabricProduct, StoreSettings } from '../types';
import { ImageCarousel } from './ImageCarousel';
import { MessageCircle, Eye, Check, Star, ShieldCheck, Sparkles, Plus, Shirt, Footprints, Scissors } from 'lucide-react';

interface ProductCardProps {
  product: FabricProduct;
  settings: StoreSettings;
  onOpenDetail: (product: FabricProduct, defaultQuantity?: number) => void;
  onAddToCart: (product: FabricProduct, quantity: number, selectedColor?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  settings,
  onOpenDetail,
  onAddToCart,
}) => {
  const unit = product.unitLabel || (product.mainSection === 'cloths' ? 'yard' : product.mainSection === 'shoes' ? 'pair' : 'machine');
  const [selectedQty, setSelectedQty] = useState<number>(product.minimumOrder || 1);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Original');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const images = (product.galleryImages && product.galleryImages.length > 0)
    ? product.galleryImages
    : [product.image];

  const handleAddToInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedQty, selectedColor);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleDirectWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const photoUrl = product.image && !product.image.startsWith('data:image')
      ? (product.image.startsWith('http') ? product.image : `${window.location.origin}${product.image}`)
      : '';

    const photoLine = photoUrl ? `\n📷 Photo Link: ${photoUrl}` : '';

    const message = `Hello ${settings.storeName}, I would like to inquire about the price and availability of:

📌 Product: *${product.name}*
📂 Section: *${product.mainSection === 'cloths' ? 'Cloths' : product.mainSection === 'shoes' ? 'Shoes' : 'Tailoring Machine'}* (${product.category})
🧵 Material/Spec: *${product.fabricType}*
🔢 Quantity: *${selectedQty} ${unit}${selectedQty > 1 ? 's' : ''}*
🎨 Color/Style: *${selectedColor}*${photoLine}

Please send me the price, pictures, and delivery options to my location. Thank you!`;

    const url = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const getSectionIcon = () => {
    if (product.mainSection === 'shoes') return <Footprints className="w-3.5 h-3.5 text-[#D4AF37]" />;
    if (product.mainSection === 'tailoring-machine') return <Scissors className="w-3.5 h-3.5 text-[#D4AF37]" />;
    return <Shirt className="w-3.5 h-3.5 text-[#D4AF37]" />;
  };

  const getSectionName = () => {
    if (product.mainSection === 'shoes') return 'Shoes & Bags';
    if (product.mainSection === 'tailoring-machine') return 'Tailoring Machine';
    return 'Cloths & Fabrics';
  };

  return (
    <div 
      onClick={() => onOpenDetail(product, selectedQty)}
      className="group bg-white rounded-3xl border-2 border-[#E8E2D9] hover:border-[#D4AF37] shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer relative transform hover:-translate-y-1"
      id={`product-card-${product.id}`}
    >
      {/* Top Image Section with Swipeable Jumia Carousel */}
      <div>
        <div className="relative overflow-hidden bg-[#FAF8F5] rounded-t-3xl p-2 sm:p-3">
          <div className="rounded-2xl overflow-hidden shadow-inner">
            <ImageCarousel
              images={images}
              altText={product.name}
              variant="card"
              aspectRatio="square"
              showThumbnails={false}
              showArrows={true}
              showIndicators={true}
              showBadge={true}
              onImageClick={() => onOpenDetail(product, selectedQty)}
            />
          </div>

          {/* Section & Custom Badge Overlay */}
          <div className="absolute top-5 left-5 flex flex-col gap-1.5 items-start z-20 pointer-events-none">
            <span className="bg-[#0F2E22]/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border border-[#D4AF37]/40 shadow flex items-center gap-1.5">
              {getSectionIcon()}
              <span>{getSectionName()}</span>
            </span>

            {product.badge && (
              <span className="bg-[#D4AF37] text-[#0F2E22] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg shadow">
                {product.badge}
              </span>
            )}
          </div>

          {/* Wholesale Availability Indicator */}
          {product.isWholesaleAvailable && (
            <div className="absolute top-5 right-5 z-20 pointer-events-none">
              <span className="bg-white/95 backdrop-blur-md text-[#0F2E22] border border-[#0F2E22]/20 text-[10px] font-black px-2.5 py-1 rounded-lg shadow">
                Wholesale & Retail
              </span>
            </div>
          )}
        </div>

        {/* Card Content & Details (Spacious and Bold) */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Header & Title */}
          <div>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] block">
              {product.category}
            </span>
            <h3 className="text-sm sm:text-lg font-black text-[#0F2E22] group-hover:text-[#2D6A4F] transition-colors leading-snug mt-1 line-clamp-2">
              {product.name}
            </h3>
          </div>

          {/* Material / Spec Highlight */}
          {product.fabricType && (
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E2D9] text-xs">
              <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 block">
                Specification / Material
              </span>
              <span className="font-bold text-[#2D2A26] block mt-0.5 line-clamp-1">
                {product.fabricType}
              </span>
            </div>
          )}

          {/* Color / Variant Selector (if multi-color) */}
          {product.colors && product.colors.length > 1 && (
            <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
              <span className="text-[11px] font-bold text-gray-500 block">Available Colors / Variations:</span>
              <div className="flex flex-wrap gap-1.5">
                {product.colors.slice(0, 3).map((col, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border transition-all ${
                      selectedColor === col
                        ? 'bg-[#0F2E22] text-white border-[#0F2E22]'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs font-bold text-gray-600">
              Quantity ({unit}s):
            </span>
            <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#E8E2D9]">
              <button
                type="button"
                onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                className="w-7 h-7 rounded-lg bg-white hover:bg-gray-200 font-black text-sm flex items-center justify-center text-gray-700 shadow-xs"
              >
                -
              </button>
              <span className="w-8 text-center font-black text-sm text-[#0F2E22]">
                {selectedQty}
              </span>
              <button
                type="button"
                onClick={() => setSelectedQty(selectedQty + 1)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-gray-200 font-black text-sm flex items-center justify-center text-gray-700 shadow-xs"
              >
                +
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Action Buttons (No Price Tags, Bold Inquiries) */}
      <div className="p-5 sm:p-6 pt-0 space-y-2.5">
        <button
          type="button"
          onClick={handleDirectWhatsAppInquiry}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>INQUIRE PRICE ON WHATSAPP</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAddToInquiry}
            className={`py-2.5 px-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              addedAnimation
                ? 'bg-emerald-100 border-emerald-600 text-emerald-800'
                : 'border-[#0F2E22] text-[#0F2E22] hover:bg-[#0F2E22] hover:text-white'
            }`}
          >
            {addedAnimation ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{addedAnimation ? 'Added!' : 'Add to Bag'}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenDetail(product, selectedQty)}
            className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Photos</span>
          </button>
        </div>
      </div>

    </div>
  );
};
