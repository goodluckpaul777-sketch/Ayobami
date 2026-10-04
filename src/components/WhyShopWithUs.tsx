import React from 'react';
import { ShieldCheck, Truck, Video, Award, Sparkles, Clock } from 'lucide-react';
import { STORE_INFO } from '../data/initialData';

export const WhyShopWithUs: React.FC = () => {
  return (
    <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl mb-8">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
            The Ayobami SAM Venture Standard
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-3">
            Why Discerning Tailors &amp; Owambe Planners Choose Us
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-2 font-light">
            We operate physically in the heart of Balogun Market, Lagos Island. No dropshipping, no counterfeit fabrics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">100% Genuine Fabrics</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Every yard of Hollandais Wax, Swiss Voile, and Austrian Guinea Brocade is vetted for authentic weight, fiber purity, and dye color-fastness.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Live WhatsApp Video Inspection</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Clients outside Lagos can request a live WhatsApp video call to inspect fabric texture, color under natural daylight, and machine operation before dispatch.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Interstate Waybill to All 36 States</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              We partner with GIGM, Peace Mass Transit, Young Shall Grow, and ABC Transport for prompt delivery to any state capital in Nigeria within 24–48 hours.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Direct Importer Wholesale Rates</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Enjoy substantial bulk savings for Aso-Ebi groups, wedding families, and fashion design academies purchasing in bundles.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Tested Sewing Equipment</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Industrial sewing machines and gravity steam irons are assembled, oiled, and test-run by seasoned technicians before hand-over.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Same-Day Dispatch in Lagos</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Fast bike and dispatch courier coverage across Lagos Island, Ikoyi, Victoria Island, Ikeja, Surulere, and Lekki.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
