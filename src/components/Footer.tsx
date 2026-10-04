import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  Heart,
  Store
} from 'lucide-react';
import { STORE_INFO, CATEGORIES } from '../data/initialData';
import { CategoryId } from '../types';

interface FooterProps {
  onSelectCategory: (cat: CategoryId) => void;
  onOpenEstimator: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenEstimator,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-stone-950 text-white pt-14 pb-8 px-4 sm:px-6 border-t border-amber-900/40">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-stone-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <div className="text-lg font-bold font-serif text-white tracking-tight">
                  {STORE_INFO.name}
                </div>
                <div className="text-xs text-amber-400 font-medium">
                  {STORE_INFO.tagline}
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Authentic Nigerian and imported textile merchant located in Balogun Market, Lagos Island. Wholesale &amp; retail supply of Hollandais Ankara, French Lace, Guinea Brocade, and industrial sewing machines with reliable nationwide waybill.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-stone-300">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Store className="w-4 h-4" />
                <span>Balogun Central Plaza</span>
              </span>
              <span>•</span>
              <span className="text-emerald-400">RC Registered</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm text-amber-400 uppercase tracking-wider">
              Product Categories
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-amber-300 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={onOpenEstimator}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                >
                  ✂ Tailoring Yard Estimator
                </button>
              </li>
            </ul>
          </div>

          {/* Store Location & Contacts */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm text-amber-400 uppercase tracking-wider">
              Balogun Market Store
            </h4>
            <div className="space-y-2 text-xs text-stone-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{STORE_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{STORE_INFO.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${STORE_INFO.whatsapp.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp Orders: {STORE_INFO.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{STORE_INFO.email}</span>
              </p>
            </div>
          </div>

          {/* Business & Admin */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-sm text-amber-400 uppercase tracking-wider">
              Merchant Admin
            </h4>
            <div className="space-y-2 text-xs text-stone-300">
              <p className="text-[11px] text-stone-400 leading-normal">
                Upload product photos, manage inventory, and sync database.
              </p>
              <button
                onClick={onOpenAdmin}
                className="w-full py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-semibold text-xs border border-stone-700 transition-colors text-left flex items-center justify-between"
              >
                <span>Admin &amp; Uploads</span>
                <span>→</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Ayobami SAM Venture. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Secure Payments</span>
            <span>•</span>
            <span>Nationwide Waybill</span>
            <span>•</span>
            <span>Balogun Market Lagos</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
