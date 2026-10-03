import React from 'react';
import { StoreSettings, MainSectionType } from '../types';
import { Shirt, Footprints, Scissors, MessageCircle, ShieldCheck, ArrowRight, Star, Sparkles, MapPin } from 'lucide-react';
import { OFFICIAL_LOGO_URL } from '../data/initialData';

interface HeroProps {
  settings: StoreSettings;
  onSelectSection: (section: MainSectionType) => void;
  onExploreAll: () => void;
  onContactClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onSelectSection,
  onExploreAll,
  onContactClick,
}) => {
  const logoSrc = settings.logoUrl || OFFICIAL_LOGO_URL;

  return (
    <div className="relative bg-[#0F2E22] text-white pt-10 sm:pt-14 pb-16 sm:pb-24 overflow-hidden border-b-2 border-[#D4AF37]">
      
      {/* Background Subtle Grid Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] z-1"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Open, Bold Top Royal Logo Presentation (No restrictive frame) */}
        <div className="flex flex-col items-center justify-center text-center pt-2 pb-8 sm:pb-12">
          
          <div className="relative group flex flex-col items-center mb-6">
            {/* Ambient Gold Halo Glow */}
            <div className="absolute -inset-8 bg-gradient-to-r from-[#D4AF37]/30 via-[#52B788]/20 to-[#D4AF37]/30 rounded-full blur-2xl opacity-70 group-hover:opacity-100 transition duration-700 pointer-events-none"></div>
            
            {/* Open, Frameless Royal Logo */}
            <img
              src={logoSrc || '/hero-logo.png'}
              alt="Ayobami SAM Ventures Royal Logo"
              className="relative w-24 h-24 sm:w-44 sm:h-44 lg:w-56 lg:h-56 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300"
            />

            <div className="mt-2 space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-[#D4AF37]/60 text-[#D4AF37] text-[9.5px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-lg max-w-[90vw] truncate">
                <Sparkles className="w-3 h-3 text-[#D4AF37] shrink-0" />
                <span className="truncate">Ayobami SAM Ventures • 37/39 Balogun West, Lagos</span>
              </span>
            </div>
          </div>

          {/* Bold Centered Headline & Description */}
          <div className="max-w-4xl space-y-3 sm:space-y-5">
            <h1 className="text-lg sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight px-1">
              PREMIER NIGERIAN HUB FOR <span className="text-[#D4AF37]">CLOTHS</span>, <span className="text-[#E0A96D]">SHOES</span> & <span className="text-[#95D5B2]">TAILORING MACHINES</span>
            </h1>

            <p className="text-[11px] sm:text-sm text-[#E0D6C8] font-medium leading-relaxed max-w-2xl mx-auto px-2">
              Welcome to <strong>{settings.storeName}</strong> at <strong>37/39 Balogun West, Molake House, Lagos</strong>. We supply authentic native wear, handcrafted Italian native leather shoes, and heavy-duty industrial sewing machines across Nigeria and overseas.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hello ${settings.storeName}, I would like to inquire about your products (Cloths, Shoes, or Tailoring Machines).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl sm:rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs sm:text-base flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                <span>INQUIRE & ORDER ON WHATSAPP</span>
              </a>

              <button
                onClick={onExploreAll}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs sm:text-base border-2 border-[#D4AF37]/60 flex items-center justify-center gap-2 transition-all backdrop-blur-md"
              >
                <span>Browse Catalogue</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-3 max-w-xl mx-auto border-t border-white/15 text-center text-xs">
              <div className="p-2">
                <span className="text-base sm:text-lg font-black text-[#D4AF37] block">100%</span>
                <span className="text-gray-300 font-bold">Genuine Quality</span>
              </div>
              <div className="p-2 border-x border-white/15">
                <span className="text-base sm:text-lg font-black text-[#D4AF37] block">24/7</span>
                <span className="text-gray-300 font-bold">Available 24/7</span>
              </div>
              <div className="p-2">
                <span className="text-base sm:text-lg font-black text-[#D4AF37] block">Direct</span>
                <span className="text-gray-300 font-bold">Retail & Wholesale</span>
              </div>
            </div>

          </div>

        </div>

        {/* 3 CORE SECTIONS INTERACTIVE CARDS (Spacious & Distinctive) */}
        <div className="pt-8">
          <div className="text-center mb-6">
            <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37] bg-white/10 px-3.5 py-1 rounded-full border border-[#D4AF37]/30">
              EXPLORE OUR 3 MAIN DEPARTMENTS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* SECTION 1: CLOTHS */}
            <div
              onClick={() => onSelectSection('cloths')}
              className="group bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-900/20 hover:border-emerald-700 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between transform hover:-translate-y-2"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black shadow-sm group-hover:scale-110 transition-transform">
                  <Shirt className="w-7 h-7 text-emerald-800" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-[#D4AF37] tracking-wider block">Department 01</span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0F2E22] mt-0.5">
                    CLOTHS & FABRICS
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                  Authentic native wear, crisp cashmere Senator materials, polished Atiku, and royal Aso-Oke by the yard and wholesale rolls.
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-xs font-black text-emerald-900">
                <span>View Cloth Collections</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* SECTION 2: SHOES */}
            <div
              onClick={() => onSelectSection('shoes')}
              className="group bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-800/20 hover:border-amber-700 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between transform hover:-translate-y-2"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black shadow-sm group-hover:scale-110 transition-transform">
                  <Footprints className="w-7 h-7 text-amber-800" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-[#D4AF37] tracking-wider block">Department 02</span>
                  <h3 className="text-xl sm:text-2xl font-black text-amber-950 mt-0.5">
                    SHOES & BAGS
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                  Handcrafted Italian leather native loafers, women’s luxury Owambe crystal party heels, leather slippers, and matching bag sets for events.
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-xs font-black text-amber-900">
                <span>View Shoe Collections</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* SECTION 3: TAILORING MACHINES */}
            <div
              onClick={() => onSelectSection('tailoring-machine')}
              className="group bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-900/20 hover:border-blue-800 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between transform hover:-translate-y-2"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-black shadow-sm group-hover:scale-110 transition-transform">
                  <Scissors className="w-7 h-7 text-blue-800" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-[#D4AF37] tracking-wider block">Department 03</span>
                  <h3 className="text-xl sm:text-2xl font-black text-blue-950 mt-0.5">
                    TAILORING MACHINES
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                  Heavy-duty direct-drive industrial lockstitch machines, high-speed 4-thread overlock interlockers, domestic Butterfly machines, and notions.
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-xs font-black text-blue-900">
                <span>View Sewing Machines</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
