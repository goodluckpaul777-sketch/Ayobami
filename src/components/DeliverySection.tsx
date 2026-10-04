import React from 'react';
import { Truck, MapPin, Globe, CheckCircle2, PhoneCall } from 'lucide-react';
import { STORE_INFO } from '../data/initialData';

export const DeliverySection: React.FC = () => {
  return (
    <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/60 px-2.5 py-0.5 rounded-full">
          Waybill &amp; Delivery Logistics
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
          From Balogun Market to Your Doorstep
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Whether you need a 6-yard Ankara piece in Ikeja or 10 sewing machines waybilled to Abuja, we deliver with speed and care.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lagos Delivery */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Lagos Metropolis Dispatch
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Same-day or next-day direct motorcycle and van dispatch across Lagos Island, Ikoyi, Victoria Island, Lekki, Ikeja, Surulere, and Yaba.
            </p>
            <ul className="text-xs text-stone-600 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Standard Flat Rate: ₦3,500</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant dispatch tracking via WhatsApp</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-stone-400">
            Dispatch Hours: 9:00 AM – 5:00 PM Daily
          </div>
        </div>

        {/* Interstate Waybill */}
        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-300 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
            All 36 States
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-amber-950">
              Interstate Bus Waybill
            </h3>
            <p className="text-xs text-amber-950/80 leading-relaxed">
              Safe packing in waterproof sacks and heavy cartons. Handed over directly to reputable interstate logistics parks in Lagos (Ojuelegba, Jibowu, Maza-Maza).
            </p>
            <ul className="text-xs text-amber-950/90 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>GIG Logistics, Peace Mass, Young Shall Grow, ABC</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Estimated Transit: 24 to 48 hours</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-200 text-[11px] text-amber-800">
            Motor Park Waybill Receipt sent instantly to your WhatsApp
          </div>
        </div>

        {/* International Diaspora Shipping */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              International Express (Diaspora)
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              For Nigerians in the UK, USA, Canada, and Europe ordering traditional Aso-Ebi for weddings and milestones.
            </p>
            <ul className="text-xs text-stone-600 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>DHL Express / FedEx Air Cargo</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Delivered to overseas doors in 4–7 business days</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-stone-400">
            Custom invoice and export documentation prepared
          </div>
        </div>
      </div>
    </section>
  );
};
