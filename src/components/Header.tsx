import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Calculator, 
  Settings, 
  Phone, 
  MapPin, 
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { STORE_INFO, CATEGORIES } from '../data/initialData';
import { CategoryId } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenEstimator: () => void;
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onOpenEstimator,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] sm:text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Wholesale & Retail
            </span>
            <span className="text-stone-300 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              Balogun Market, Lagos Island • Nationwide Waybill Across Nigeria
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href={`https://wa.me/${STORE_INFO.whatsapp.replace('+', '')}?text=Hello%20Ayobami%20SAM%20Venture,%20I%20want%20to%20inquire%20about%20your%20fabrics%20and%20sewing%20machines`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-medium text-amber-300 hover:text-white transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
              WhatsApp: {STORE_INFO.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onSelectCategory('all')} 
              className="text-left group flex items-center gap-2.5"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <div className="text-base sm:text-lg font-bold tracking-tight text-stone-900 font-serif group-hover:text-amber-700 transition-colors">
                  Ayobami SAM Venture
                </div>
                <div className="text-[10px] sm:text-xs text-stone-500 font-medium tracking-wide">
                  Fabrics, Machines & Accessories • Lagos
                </div>
              </div>
            </button>
          </div>

          {/* Search Input - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Ankara, Lace, Atiku, Sewing Machines, Shoes..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-stone-100 hover:bg-stone-50 focus:bg-white border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all placeholder:text-stone-400"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Yard Estimator Button */}
            <button
              onClick={onOpenEstimator}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl transition-colors"
              title="Tailoring Yard Estimator"
            >
              <Calculator className="w-4 h-4 text-amber-700" />
              <span>Yard Estimator</span>
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdmin}
              className="p-2 sm:px-3 sm:py-2 text-xs font-semibold text-stone-700 hover:text-amber-800 bg-stone-100 hover:bg-stone-200/80 rounded-xl border border-stone-200 transition-colors flex items-center gap-1.5"
              title="Manage Products & Upload Images"
            >
              <Settings className="w-4 h-4 text-stone-600" />
              <span className="hidden sm:inline">Admin / Uploads</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-3.5 py-2 rounded-xl font-medium text-xs sm:text-sm shadow-sm transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-stone-900 text-amber-300 text-[11px] font-bold flex items-center justify-center -ml-0.5">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-2.5 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Ankara, Lace, Atiku, Machines..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-100 focus:bg-white border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Nav Strip (Desktop & Scrollable on Mobile) */}
        <nav className="mt-3 pt-2.5 border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <span>{cat.name}</span>
                {cat.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider font-bold ${
                    isActive ? 'bg-amber-800 text-amber-200' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-3">
          <button
            onClick={() => {
              onOpenEstimator();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-50 text-amber-900 text-xs font-semibold"
          >
            <span className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-700" />
              Tailoring Yard Estimator
            </span>
            <span className="text-[10px] text-amber-700">Calculate Fabric</span>
          </button>
          
          <div className="pt-2 text-xs text-stone-500 space-y-1">
            <p className="font-semibold text-stone-800">Shop Address:</p>
            <p>{STORE_INFO.address}</p>
            <p className="pt-1 flex items-center gap-1 text-stone-700">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>Call / WhatsApp: {STORE_INFO.phone}</span>
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
