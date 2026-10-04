import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { INITIAL_REVIEWS } from '../data/initialData';

export const CustomerReviews: React.FC = () => {
  return (
    <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t border-stone-200">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/60 px-2.5 py-0.5 rounded-full">
          Customer Testimonials
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
          Trusted by Tailors, Brides &amp; Merchants Across Nigeria
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Read what our clients say about our fabric textures, sewing machines, and express waybill dispatch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {INITIAL_REVIEWS.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-amber-300 group-hover:text-amber-500 transition-colors" />
              </div>

              <p className="text-xs text-stone-700 italic leading-relaxed line-clamp-4">
                "{rev.comment}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100">
              <div className="font-semibold text-xs text-stone-900 flex items-center justify-between">
                <span>{rev.author}</span>
                {rev.verifiedPurchase && (
                  <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-normal">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                )}
              </div>
              <div className="text-[11px] text-stone-500 flex justify-between items-center mt-0.5">
                <span>{rev.location}</span>
                <span className="text-[10px] text-stone-400">{rev.date}</span>
              </div>
              <div className="text-[10px] text-amber-800 font-medium mt-1 truncate">
                Purchased: {rev.productName}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
