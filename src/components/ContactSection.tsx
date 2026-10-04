import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Mail, 
  Clock, 
  Building, 
  Copy, 
  Check,
  Send
} from 'lucide-react';
import { STORE_INFO } from '../data/initialData';

export const ContactSection: React.FC = () => {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURI(
      `Hello Ayobami SAM Venture, I have an inquiry:\n` +
      `👤 *Name:* ${inquiryName}\n` +
      `📞 *Phone:* ${inquiryPhone}\n` +
      `💬 *Message:* ${inquiryMessage}`
    );
    window.open(`https://wa.me/${STORE_INFO.whatsapp.replace('+', '')}?text=${msg}`, '_blank');
  };

  const copyAccount = () => {
    navigator.clipboard.writeText(STORE_INFO.accountDetails.accountNumber);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  return (
    <section id="contact" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t border-stone-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Info Column */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/60 px-2.5 py-0.5 rounded-full">
              Physical Location &amp; Merchant Support
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
              Visit Us in Balogun Market or Chat on WhatsApp
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Have questions about fabric rolls, sewing machine motor installation, or custom Aso-Ebi orders? Reach out directly.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Physical Shop Address</h4>
                <p className="text-stone-600 mt-0.5 leading-relaxed">{STORE_INFO.address}</p>
                <p className="text-[11px] text-amber-800 font-medium mt-1">Landmark: {STORE_INFO.landmark}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-stone-900 text-sm">Direct Phone &amp; WhatsApp</h4>
                <p className="text-stone-600 mt-0.5">{STORE_INFO.phone}</p>
                <div className="flex gap-2 mt-2">
                  <a
                    href={`https://wa.me/${STORE_INFO.whatsapp.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1 shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Chat</span>
                  </a>
                  <a
                    href={`tel:${STORE_INFO.whatsapp}`}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-[11px] flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Store</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Working Hours</h4>
                <p className="text-stone-600 mt-0.5">{STORE_INFO.businessHours}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">Sunday: Closed (Church &amp; Family rest)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Inquiry Form */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-md">
          <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">
            Send an Inquiry or Aso-Ebi Quote Request
          </h3>
          <p className="text-xs text-stone-500 mb-5">
            Get an instant response from our sales and waybill team.
          </p>

          <form onSubmit={handleSendInquiry} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={inquiryName}
                onChange={(e) => setInquiryName(e.target.value)}
                placeholder="e.g. Chief Adeleke / Mrs. Johnson"
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Phone / WhatsApp *</label>
              <input
                type="tel"
                required
                value={inquiryPhone}
                onChange={(e) => setInquiryPhone(e.target.value)}
                placeholder="e.g. 08146243747"
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Inquiry / Custom Fabric Specification *</label>
              <textarea
                rows={3}
                required
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="Tell us what fabric pattern, sewing machine brand, or Aso-Ebi quantity you need..."
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Send Inquiry via WhatsApp</span>
            </button>
          </form>

          {/* Quick Bank Details Reminder */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600 bg-stone-50 p-3 rounded-xl">
            <div>
              <span className="text-[10px] text-stone-400 block">Bank Account:</span>
              <span className="font-bold text-stone-900">{STORE_INFO.accountDetails.accountNumber}</span> • {STORE_INFO.accountDetails.accountName}
            </div>
            <button
              onClick={copyAccount}
              className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:text-amber-800"
              title="Copy account number"
            >
              {copiedBank ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
