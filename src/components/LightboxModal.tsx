import React from 'react';
import { X, ZoomIn } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2.5 rounded-full bg-stone-800/80 hover:bg-stone-800 text-white transition-all z-10"
      >
        <X className="w-6 h-6" />
      </button>

      <div 
        className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={title}
          className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl border border-stone-800"
        />
        <div className="mt-3 text-center text-xs sm:text-sm text-stone-200 font-medium bg-stone-900/80 px-4 py-1.5 rounded-full">
          {title}
        </div>
      </div>
    </div>
  );
};
