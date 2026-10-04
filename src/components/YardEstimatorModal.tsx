import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  Check, 
  ArrowRight, 
  Scissors, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { CategoryId } from '../types';

interface YardEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterCategory: (cat: CategoryId) => void;
}

interface StyleGuide {
  id: string;
  name: string;
  recommendedYards: number;
  description: string;
  targetCategory: CategoryId;
  categoryLabel: string;
  badge?: string;
}

const STYLE_GUIDES: StyleGuide[] = [
  {
    id: 'senator',
    name: 'Executive Senator / Kaftan (Top & Trousers)',
    recommendedYards: 4,
    description: 'Standard tailored Nigerian Kaftan with matching trousers. Requires 4 yards for average adult build (up to 4.5 yards for tall/broad size).',
    targetCategory: 'senator-atiku',
    categoryLabel: 'Senator & Atiku',
    badge: 'Popular',
  },
  {
    id: 'agbada',
    name: 'Grand Agbada 3-Piece (Outer Gown + Buba + Sokoto)',
    recommendedYards: 8,
    description: 'Regal Yoruba / Hausa traditional flowing agbada ensemble. 7–8 yards ensures rich pleats, full wingspan, and matching trousers.',
    targetCategory: 'senator-atiku',
    categoryLabel: 'Austrian Guinea Brocade',
  },
  {
    id: 'iro-buba',
    name: 'Traditional Iro & Buba + Gele / Ipele',
    recommendedYards: 6,
    description: 'Complete 6-yard standard piece. 4 yards for wrap-around Iro (wrapper) & blouse (Buba), plus 2 yards for head-tie (Gele) and shoulder sash (Ipele).',
    targetCategory: 'lace',
    categoryLabel: 'Luxury Lace / Ankara',
    badge: 'Classic Owambe',
  },
  {
    id: 'female-gown',
    name: 'Fitted Fishtail / Corset 6-Piece Gown',
    recommendedYards: 5,
    description: 'Glamorous wedding guest or bridal reception gown. 5–6 yards provides adequate fabric for mermaid flares, train, and corset panelling.',
    targetCategory: 'lace',
    categoryLabel: 'French Beaded Lace',
  },
  {
    id: 'ankara-casual',
    name: 'Ankara Jumpsuit / Midi Flare Dress / Kimono Jacket',
    recommendedYards: 3,
    description: 'Modern ready-to-wear casual or party piece. 3 yards for a chic blazer/kimono, pencil skirt, or jumpsuit.',
    targetCategory: 'ankara',
    categoryLabel: 'Hollandais / High Target',
  },
  {
    id: 'couple',
    name: 'Couple Matching Outfit (His Senator + Her Gown)',
    recommendedYards: 10,
    description: 'Coordinated couple celebration outfit. 4 yards for his Kaftan set and 6 yards for her matching owambe dress.',
    targetCategory: 'ankara',
    categoryLabel: 'Ankara Prints & Brocade',
    badge: 'Couples',
  },
];

export const YardEstimatorModal: React.FC<YardEstimatorModalProps> = ({
  isOpen,
  onClose,
  onFilterCategory,
}) => {
  if (!isOpen) return null;

  const [selectedStyleId, setSelectedStyleId] = useState<string>('senator');
  const [numberOfPersons, setNumberOfPersons] = useState<number>(1);

  const currentStyle = STYLE_GUIDES.find((s) => s.id === selectedStyleId) || STYLE_GUIDES[0];
  const totalYardsNeeded = currentStyle.recommendedYards * numberOfPersons;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-5 sm:p-8 my-6 border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
              Tailoring Calculator
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Fabric Yard Estimator
            </h2>
          </div>
        </div>

        <p className="text-xs text-stone-500 mb-6">
          Wondering how many yards of Ankara, Lace, or Atiku you need for your tailor? Select your desired Nigerian style below.
        </p>

        {/* Style Selection Grid */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            1. Select Outfit Style:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto no-scrollbar pr-1">
            {STYLE_GUIDES.map((style) => {
              const isSelected = style.id === selectedStyleId;
              return (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyleId(style.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-xs'
                      : 'border-stone-200 hover:border-amber-300 text-stone-700 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs line-clamp-1">{style.name}</span>
                    {style.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-900 shrink-0">
                        {style.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-500 line-clamp-1">
                    {style.recommendedYards} yards / person
                  </div>
                </button>
              );
            })}
          </div>

          {/* Number of Persons (Aso-Ebi) */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              2. Number of Outfits / Persons (Aso-Ebi Group):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="20"
                value={numberOfPersons}
                onChange={(e) => setNumberOfPersons(Number(e.target.value))}
                className="flex-1 accent-amber-600"
              />
              <span className="w-16 text-center font-bold text-xs bg-stone-100 p-2 rounded-xl border">
                {numberOfPersons} {numberOfPersons === 1 ? 'person' : 'persons'}
              </span>
            </div>
          </div>

          {/* Calculated Output Card */}
          <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-2 mt-4">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Selected Outfit:</span>
              <span className="text-amber-300 font-semibold">{currentStyle.name}</span>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              {currentStyle.description}
            </p>
            <div className="pt-2 border-t border-stone-800 flex items-baseline justify-between">
              <span className="text-xs text-stone-300">Total Recommended Yards:</span>
              <span className="font-serif font-bold text-xl sm:text-2xl text-amber-400">
                {totalYardsNeeded} Yards
              </span>
            </div>
          </div>

          {/* Direct CTA */}
          <button
            onClick={() => {
              onFilterCategory(currentStyle.targetCategory);
              onClose();
            }}
            className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop Fabrics for this Style ({currentStyle.categoryLabel})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
