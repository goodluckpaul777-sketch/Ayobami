import React from 'react';
import { 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Award, 
  MessageCircle, 
  ArrowRight,
  Store
} from 'lucide-react';
import { STORE_INFO } from '../data/initialData';
import { CategoryId } from '../types';

interface HeroProps {
  onSelectCategory: (cat: CategoryId) => void;
  onOpenEstimator: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectCategory, onOpenEstimator }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-amber-950 text-white pt-8 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6">
      {/* Background Decorative Accents */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide">
              <Store className="w-3.5 h-3.5" />
              <span>Direct Balogun Market Lagos Merchant • Wholesale & Retail</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-[1.15]">
              Authentic Fabrics, Industrial Machines &amp; Owambe Elegance.
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-stone-300 max-w-2xl font-light leading-relaxed">
              Wholesale &amp; retail supplier of original <strong className="text-amber-300 font-semibold">Hollandais Wax Ankara</strong>, luxury <strong className="text-amber-300 font-semibold">French &amp; Swiss Lace</strong>, Austrian Guinea Brocade, <strong className="text-amber-300 font-semibold">Direct Drive Industrial Sewing Machines</strong>, and matching party shoes with nationwide waybill.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectCategory('ankara')}
                className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Shop Fabrics</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectCategory('sewing-machines')}
                className="px-5 py-3 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-amber-200 border border-amber-500/30 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Sewing Machines</span>
              </button>

              <a
                href={`https://wa.me/${STORE_INFO.whatsapp.replace('+', '')}?text=Hello%20Ayobami%20SAM%20Venture,%20I%20want%20to%20place%20an%20order`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">WhatsApp Order</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-800/80 text-[11px] sm:text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Fast Nationwide Waybill</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Genuine Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Direct Importer Rates</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Aso-Ebi Uniform Discounts</span>
              </div>
            </div>
          </div>

          {/* Right Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-stone-800/60 p-4 shadow-2xl backdrop-blur-xs">
              <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80"
                  alt="Ayobami SAM Venture Fabrics"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Featured Collection
                  </div>
                  <div className="text-base sm:text-lg font-serif font-bold text-white">
                    Premium Hollandais &amp; French Beaded Lace
                  </div>
                  <div className="text-xs text-stone-300 flex items-center justify-between mt-1">
                    <span>From ₦24,500 per bundle</span>
                    <button
                      onClick={onOpenEstimator}
                      className="underline text-amber-300 hover:text-white"
                    >
                      Need yard estimation?
                    </button>
                  </div>
                </div>
              </div>

              {/* Sub-banner inside card */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-stone-900/80 p-2.5 rounded-lg border border-stone-700">
                  <div className="text-[10px] text-stone-400">Lagos Island Store</div>
                  <div className="font-semibold text-amber-300">Balogun Central Plaza</div>
                </div>
                <div className="bg-stone-900/80 p-2.5 rounded-lg border border-stone-700">
                  <div className="text-[10px] text-stone-400">Waybill Partners</div>
                  <div className="font-semibold text-stone-200">GIGM, Peace &amp; ABC</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
