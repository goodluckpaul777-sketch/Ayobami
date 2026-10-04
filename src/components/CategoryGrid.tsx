import React from 'react';
import { CATEGORIES } from '../data/initialData';
import { CategoryId } from '../types';
import { 
  Palette, 
  Crown, 
  Shirt, 
  Wrench, 
  ShoppingBag, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface CategoryGridProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  productCounts: Record<string, number>;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
  productCounts,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Palette':
        return <Palette className="w-5 h-5 text-amber-600" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-amber-600" />;
      case 'Shirt':
        return <Shirt className="w-5 h-5 text-amber-600" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5 text-amber-600" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-amber-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2.5 py-0.5 rounded-full">
            Balogun Market Categories
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1">
            Browse by Department
          </h2>
        </div>
        <p className="text-xs text-stone-500 mt-1 sm:mt-0">
          Wholesale bundles and retail cuts available with custom delivery
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = cat.id === 'all' 
            ? Object.values(productCounts).reduce((a, b) => a + b, 0)
            : (productCounts[cat.id] || 0);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between group relative overflow-hidden ${
                isSelected
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-[1.02]'
                  : 'bg-white hover:bg-stone-50 text-stone-900 border-stone-200/90 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl transition-colors ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-amber-50 group-hover:bg-amber-100'
                }`}>
                  {getIcon(cat.iconName)}
                </div>
                {cat.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isSelected ? 'bg-amber-800 text-amber-200' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {cat.badge}
                  </span>
                )}
              </div>

              <div>
                <h3 className={`font-semibold text-xs sm:text-sm line-clamp-1 ${
                  isSelected ? 'text-white' : 'text-stone-900 group-hover:text-amber-800'
                }`}>
                  {cat.name}
                </h3>
                <div className={`text-[11px] mt-0.5 flex items-center justify-between ${
                  isSelected ? 'text-amber-100' : 'text-stone-500'
                }`}>
                  <span>{count} {count === 1 ? 'item' : 'items'}</span>
                  <ArrowRight className={`w-3 h-3 transition-transform group-hover:translate-x-0.5 ${
                    isSelected ? 'text-white' : 'text-stone-400 group-hover:text-amber-600'
                  }`} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
