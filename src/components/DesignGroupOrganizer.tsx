import React, { useState } from 'react';
import { FabricProduct, StoreSettings } from '../types';
import { ProductCard } from './ProductCard';
import { Sparkles, Layers, Grid, Palette, MessageCircle, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Eye, Footprints, ShoppingBag, Shirt, Scissors } from 'lucide-react';

interface DesignGroupOrganizerProps {
  products: FabricProduct[];
  settings: StoreSettings;
  onOpenDetail: (product: FabricProduct, defaultQuantity?: number) => void;
  onAddToCart: (product: FabricProduct, quantity: number, selectedColor?: string) => void;
  onSelectSection?: (section: 'cloths' | 'shoes' | 'tailoring-machine') => void;
}

export const DesignGroupOrganizer: React.FC<DesignGroupOrganizerProps> = ({
  products,
  settings,
  onOpenDetail,
  onAddToCart,
  onSelectSection,
}) => {
  const [activeViewFilter, setActiveViewFilter] = useState<'all' | 'matching-groups' | 'distinct-designs' | 'matching-sets-only'>('all');
  
  // Track selected color variant index for each design group
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  // Filter products relevant to Shoes & Bags
  const shoeAndBagProducts = products.filter(
    (p) => p.mainSection === 'shoes' || p.categorySlug.includes('shoe') || p.isMatchingSet
  );

  // Group products by designGroupId
  const designGroupsMap: Record<string, FabricProduct[]> = {};
  const distinctProducts: FabricProduct[] = [];

  shoeAndBagProducts.forEach((product) => {
    if (product.designGroupId) {
      if (!designGroupsMap[product.designGroupId]) {
        designGroupsMap[product.designGroupId] = [];
      }
      designGroupsMap[product.designGroupId].push(product);
    } else {
      distinctProducts.push(product);
    }
  });

  // Extract design groups
  const designGroups = Object.entries(designGroupsMap).map(([groupId, items]) => {
    const mainItem = items[0];
    const groupName = mainItem.designGroupName || mainItem.name;
    const isMatchingShoeBag = items.some(i => i.isMatchingSet);
    return {
      groupId,
      groupName,
      isMatchingShoeBag,
      items,
    };
  });

  // All 2-in-1 Matching Shoe & Bag sets
  const matchingShoeBagSets = shoeAndBagProducts.filter((p) => p.isMatchingSet);

  const handleSelectVariant = (groupId: string, productId: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [groupId]: productId,
    }));
  };

  const handleWhatsAppDesignInquiry = (groupName: string, activeProduct: FabricProduct, allColors: string[]) => {
    const msg = `Hello ${settings.storeName}, I am inquiring about the matching design line:
    
✨ Design: *${groupName}*
🎨 Selected Color: *${activeProduct.colorVariant || activeProduct.colors[0] || 'Default'}*
🏷️ Category: *${activeProduct.category}*
${activeProduct.isMatchingSet ? '👜 Set Type: *Matching Shoe & Handbag 2-in-1 Combo*' : '👞 Item: *Footwear / Native Fashion*'}
🌈 Available Colors in this design: ${allColors.join(', ')}

Please provide pricing, wholesale options, and available sizes for this design. Thank you!`;

    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-10 py-6" id="shoes-and-bags-organizer">
      
      {/* Top Banner & Mode Navigation */}
      <div className="bg-gradient-to-r from-[#0F2E22] via-[#1B4332] to-[#2D6A4F] text-white rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37] shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#D4AF37] text-[#0F2E22] text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow">
                Curated Design Organizer
              </span>
              <span className="bg-white/10 text-[#E0D6C8] text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                Shared Styles • Colorways • 2-in-1 Matching Sets
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Shoes, Handbags & Coordinated Sets
            </h2>
            
            <p className="text-sm sm:text-base text-[#E0D6C8] leading-relaxed">
              Items sharing the exact same structural silhouette are grouped together with interactive color switchers on the left, while distinct individual designs are organized on the right.
            </p>
          </div>

          {/* Filter / View Mode Pills - Ultra-compact Sticker Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none py-1.5 px-2 bg-black/40 rounded-xl border border-white/20 backdrop-blur-md max-w-full w-full lg:w-auto shrink-0">
            <button
              onClick={() => setActiveViewFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all shrink-0 ${
                activeViewFilter === 'all'
                  ? 'bg-[#D4AF37] text-[#0F2E22] shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Dual View
            </button>

            <button
              onClick={() => setActiveViewFilter('matching-groups')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 shrink-0 ${
                activeViewFilter === 'matching-groups'
                  ? 'bg-[#D4AF37] text-[#0F2E22] shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Design Groups ({designGroups.length})</span>
            </button>

            <button
              onClick={() => setActiveViewFilter('matching-sets-only')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 shrink-0 ${
                activeViewFilter === 'matching-sets-only'
                  ? 'bg-[#D4AF37] text-[#0F2E22] shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shoe & Bag Combos ({matchingShoeBagSets.length})</span>
            </button>

            <button
              onClick={() => setActiveViewFilter('distinct-designs')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 shrink-0 ${
                activeViewFilter === 'distinct-designs'
                  ? 'bg-[#D4AF37] text-[#0F2E22] shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Single Items ({distinctProducts.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* DUAL ORGANIZED SECTIONS (Side-by-Side or Selected Mode) */}
      {(activeViewFilter === 'all' || activeViewFilter === 'matching-groups' || activeViewFilter === 'matching-sets-only') && (
        <div className="space-y-6">
          
          {/* Section Header: Matching Groups */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#D4AF37]/40 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#D4AF37] animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
                  SHARED STRUCTURAL DESIGNS & COLORWAYS
                </span>
              </div>
              <h3 className="text-2xl font-black text-[#0F2E22] mt-0.5">
                Matching Design Collections & 2-in-1 Sets
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                Products below share the exact same silhouette and craftsmanship across multiple vibrant colors. Click color chips to switch preview.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-black text-[#0F2E22] bg-[#EAE2D5] px-3.5 py-1.5 rounded-full self-start">
              <span>{designGroups.length} Unique Silhouette Families</span>
            </div>
          </div>

          {/* Design Groups Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {designGroups.map((group) => {
              const activeProductId = selectedVariants[group.groupId] || group.items[0].id;
              const activeProduct = group.items.find((i) => i.id === activeProductId) || group.items[0];
              const allColorNames = group.items.map((i) => i.colorVariant || i.colors[0] || 'Original');

              return (
                <div
                  key={group.groupId}
                  className="bg-white rounded-3xl border-2 border-[#D4AF37] shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  {/* Top Header of the Design Group */}
                  <div className="bg-[#0F2E22] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#D4AF37]/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#D4AF37] text-[#0F2E22] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                          {group.isMatchingShoeBag ? 'Shoe & Bag 2-in-1 Combo' : 'Matching Footwear Line'}
                        </span>
                        <span className="text-xs text-[#E0D6C8] font-bold">
                          {group.items.length} Colorways Available
                        </span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">
                        {group.groupName}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleWhatsAppDesignInquiry(group.groupName, activeProduct, allColorNames)}
                      className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-black flex items-center gap-1.5 shadow transition-transform hover:scale-105"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Inquire Group</span>
                    </button>
                  </div>

                  {/* Active Variant Image & Info */}
                  <div className="p-5 sm:p-6 space-y-5">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                      {/* Image Preview with Zoom */}
                      <div 
                        onClick={() => onOpenDetail(activeProduct)}
                        className="sm:col-span-5 bg-[#FAF8F5] rounded-2xl overflow-hidden p-2 border border-[#E8E2D9] relative cursor-pointer group"
                      >
                        <img
                          src={activeProduct.image}
                          alt={activeProduct.name}
                          className="w-full h-48 sm:h-52 object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                          <span className="bg-white/90 text-[#0F2E22] text-xs font-black px-3 py-1.5 rounded-xl shadow flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect Photos</span>
                          </span>
                        </div>
                      </div>

                      {/* Details & Specs */}
                      <div className="sm:col-span-7 space-y-3">
                        <div>
                          <span className="text-xs font-black text-[#D4AF37] uppercase tracking-wider block">
                            Active Selection: {activeProduct.colorVariant || activeProduct.colors[0]}
                          </span>
                          <h5 className="text-base font-black text-[#0F2E22] line-clamp-2 mt-0.5">
                            {activeProduct.name}
                          </h5>
                        </div>

                        <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-3">
                          {activeProduct.description}
                        </p>

                        <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E8E2D9] text-xs space-y-1">
                          <div className="flex items-center justify-between text-gray-500 font-semibold">
                            <span>Material / Craft:</span>
                            <span className="text-[#0F2E22] font-black">{activeProduct.fabricType}</span>
                          </div>
                          {activeProduct.origin && (
                            <div className="flex items-center justify-between text-gray-500 font-semibold">
                              <span>Origin / Grade:</span>
                              <span className="text-[#0F2E22] font-black">{activeProduct.origin}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Colorway Switcher Chips */}
                    <div className="pt-4 border-t border-gray-100 space-y-2">
                      <div className="flex items-center justify-between text-xs font-black text-gray-700">
                        <span className="flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Select Available Colorway:</span>
                        </span>
                        <span className="text-[#D4AF37]">Click to Switch Variant</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {group.items.map((item) => {
                          const isSelected = item.id === activeProductId;
                          const colorLabel = item.colorVariant || item.colors[0] || 'Color';

                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelectVariant(group.groupId, item.id)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 border-2 ${
                                isSelected
                                  ? 'bg-[#0F2E22] text-[#D4AF37] border-[#D4AF37] shadow-md scale-105'
                                  : 'bg-[#FAF8F5] text-gray-800 border-[#E8E2D9] hover:border-[#D4AF37]'
                              }`}
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
                              <span>{colorLabel}</span>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* Card Bottom Actions */}
                  <div className="bg-[#FAF8F5] p-4 sm:p-5 border-t border-[#E8E2D9] flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => onOpenDetail(activeProduct)}
                      className="text-xs font-black text-[#0F2E22] hover:text-[#2D6A4F] flex items-center gap-1"
                    >
                      <span>View Specifications & Sizes</span>
                      <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onAddToCart(activeProduct, 1, activeProduct.colorVariant || activeProduct.colors[0])}
                        className="px-4 py-2 rounded-xl bg-white border border-[#D4AF37] hover:bg-[#FAF8F5] text-[#0F2E22] text-xs font-black shadow-sm"
                      >
                        + Add to Bag
                      </button>

                      <a
                        href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hello ${settings.storeName}, I want to order/inquire about:
📌 Product: *${activeProduct.name}*
🎨 Color: *${activeProduct.colorVariant || activeProduct.colors[0]}*
📂 Design Line: *${group.groupName}*
Please confirm availability and price.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-black flex items-center gap-1.5 shadow"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span>Order on WhatsApp</span>
                      </a>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* DISTINCT & STANDALONE INDIVIDUAL DESIGNS SECTION */}
      {(activeViewFilter === 'all' || activeViewFilter === 'distinct-designs') && (
        <div className="space-y-6 pt-6">
          
          {/* Section Header: Distinct Standalone Items */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-emerald-900/30 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-700"></span>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-900">
                  STANDALONE & EXCLUSIVE DESIGNS
                </span>
              </div>
              <h3 className="text-2xl font-black text-[#0F2E22] mt-0.5">
                Distinct Individual Footwear & Bags
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                Unique standalone designs crafted as singular statement pieces with exclusive detailing.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-black text-[#0F2E22] bg-[#EAE2D5] px-3.5 py-1.5 rounded-full self-start">
              <span>{distinctProducts.length} Standalone Styles</span>
            </div>
          </div>

          {/* Standalone Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {distinctProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                settings={settings}
                onOpenDetail={onOpenDetail}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
