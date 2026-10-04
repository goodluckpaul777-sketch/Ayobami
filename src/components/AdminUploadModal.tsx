import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  Check, 
  Image as ImageIcon, 
  Trash2, 
  Plus, 
  Sparkles, 
  Layers, 
  AlertCircle,
  FolderOpen,
  ArrowRight
} from 'lucide-react';
import { Product } from '../types';
import { ProductStorage, UploadedImageFile } from '../services/productStorage';
import { compressImageFile } from '../utils/imageCompressor';
import { formatNaira } from '../utils/formatters';

interface AdminUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductsUpdated: (updated: Product[]) => void;
}

export const AdminUploadModal: React.FC<AdminUploadModalProps> = ({
  isOpen,
  onClose,
  products,
  onProductsUpdated
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'upload' | 'assign' | 'new-product'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedList, setUploadedList] = useState<UploadedImageFile[]>(() => ProductStorage.getUploadedImages());
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [notification, setNotification] = useState<string | null>(null);

  // New Product Form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Product['category']>('ankara');
  const [newProdPrice, setNewProdPrice] = useState<number>(35000);
  const [newProdUnit, setNewProdUnit] = useState('per 6 yards piece');
  const [newProdMaterial, setNewProdMaterial] = useState('100% Combed Cotton');
  const [newProdDescription, setNewProdDescription] = useState('Vibrant premium quality African textile directly from Balogun market.');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showSuccess = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    const newItems: UploadedImageFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // Compress image to ensure lightweight storage
        const compressedDataUrl = await compressImageFile(file, 900, 0.8);
        const item: UploadedImageFile = {
          id: `img-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          dataUrl: compressedDataUrl,
          size: file.size,
          uploadedAt: new Date().toLocaleTimeString(),
          categorySuggestion: file.name.toLowerCase().includes('lace') ? 'lace' : 'ankara'
        };
        newItems.push(item);
        ProductStorage.addUploadedImage(item);
      } catch (err) {
        console.error('Error processing image:', file.name, err);
      }
    }

    const updatedList = ProductStorage.getUploadedImages();
    setUploadedList(updatedList);
    setIsProcessing(false);
    showSuccess(`Successfully processed and loaded ${newItems.length} cloth image(s)!`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleAttachImageToSelectedProduct = (imgUrl: string) => {
    if (!selectedProductId) return;
    const targetProduct = products.find(p => p.id === selectedProductId);
    const updated = ProductStorage.attachImageToProduct(selectedProductId, imgUrl);
    onProductsUpdated(updated);
    showSuccess(`Image attached to "${targetProduct?.name || 'Selected Product'}"!`);
  };

  const handleAttachAllToSelectedProduct = () => {
    if (!selectedProductId || uploadedList.length === 0) return;
    let currentProds = products;
    const targetProduct = products.find(p => p.id === selectedProductId);

    uploadedList.forEach(item => {
      currentProds = ProductStorage.attachImageToProduct(selectedProductId, item.dataUrl);
    });

    onProductsUpdated(currentProds);
    showSuccess(`All ${uploadedList.length} image(s) attached to "${targetProduct?.name}"!`);
  };

  const handleBatchCreateProductsFromImages = () => {
    if (uploadedList.length === 0) {
      alert('Please upload images first!');
      return;
    }

    let updatedProds = products;
    let count = 0;

    uploadedList.forEach((item, index) => {
      // derive name cleanly from filename
      const cleanFileName = item.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      const newProduct: Product = {
        id: `cloth-upload-${Date.now()}-${index}`,
        name: `Authentic Fabric — ${cleanFileName.toUpperCase()}`,
        category: 'ankara',
        categoryLabel: 'Ankara Prints',
        price: 36000,
        originalPrice: 42000,
        unit: 'per 6 yards piece',
        rating: 5.0,
        reviewsCount: 12,
        description: `Premium grade African textile pattern (${item.name}). Sourced directly from Balogun market, Lagos with 100% color fastness and breathable weave.`,
        features: ['100% Combed Cotton Base', '6 Full Yards Cut', 'No Fading / Bleeding', 'Lagos Express Dispatch'],
        inStock: true,
        stockCount: 15,
        isNewArrival: true,
        images: [item.dataUrl],
        material: 'Premium African Wax Cotton',
        colors: ['Multicolor Print']
      };

      updatedProds = ProductStorage.addProduct(newProduct);
      count++;
    });

    onProductsUpdated(updatedProds);
    showSuccess(`Created ${count} new cloth products directly from your uploaded images!`);
  };

  const handleCreateSingleProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    // Grab first uploaded image if available
    const initialImages = uploadedList.length > 0 ? [uploadedList[0].dataUrl] : [];

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      category: newProdCategory,
      categoryLabel: newProdCategory === 'ankara' ? 'Ankara Prints' :
                     newProdCategory === 'lace' ? 'Luxury Lace' :
                     newProdCategory === 'senator-atiku' ? 'Senator & Atiku' :
                     newProdCategory === 'sewing-machines' ? 'Sewing Machines' : 'Fashion Accessories',
      price: newProdPrice,
      originalPrice: Math.round(newProdPrice * 1.15),
      unit: newProdUnit,
      rating: 5.0,
      reviewsCount: 5,
      description: newProdDescription,
      features: ['High durability', 'Authentic merchant quality', 'Checked in Lagos showroom'],
      inStock: true,
      stockCount: 20,
      isNewArrival: true,
      images: initialImages.length > 0 ? initialImages : [
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80'
      ],
      material: newProdMaterial
    };

    const updated = ProductStorage.addProduct(newProd);
    onProductsUpdated(updated);
    showSuccess(`"${newProd.name}" added to store catalog!`);
    setNewProdName('');
  };

  const handleClearAllUploaded = () => {
    ProductStorage.saveUploadedImages([]);
    setUploadedList([]);
    showSuccess('Uploaded images cleared.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Cloth Image & Product Manager</span>
                <span className="text-xs bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded-full">
                  Lagos Merchant Studio
                </span>
              </h2>
              <p className="text-xs text-stone-300">
                Bulk upload WhatsApp photos (IMG-*.jpg) or create custom cloth products for your catalog
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success / Notification Banner */}
        {notification && (
          <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 flex items-center gap-2 shrink-0 animate-in slide-in-from-top">
            <Check className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-stone-100 border-b border-stone-200 px-5 pt-3 flex gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'upload'
                ? 'border-amber-600 text-amber-700 font-extrabold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            1. Upload & Bulk Process Images ({uploadedList.length})
          </button>

          <button
            onClick={() => setActiveTab('assign')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'assign'
                ? 'border-amber-600 text-amber-700 font-extrabold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            2. Assign to Existing Products
          </button>

          <button
            onClick={() => setActiveTab('new-product')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'new-product'
                ? 'border-amber-600 text-amber-700 font-extrabold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            3. Add Custom Cloth Product
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: UPLOAD & BULK IMPORT */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              {/* Drag & Drop Area */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50 rounded-2xl p-8 text-center cursor-pointer transition-all group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
                
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform mb-3 shadow-xs">
                  <UploadCloud className="w-7 h-7" />
                </div>
                
                <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                  Click or Drag & Drop Images Here
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                  Select your photos (such as <span className="font-mono font-bold text-stone-700">IMG-20260927-WA0008.jpg</span> through <span className="font-mono font-bold text-stone-700">IMG-20260927-WA0299.jpg</span>). You can select 10, 20, or 30+ files at once!
                </p>
                
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-xs group-hover:bg-amber-400">
                  <FolderOpen className="w-4 h-4" />
                  <span>Browse Device Files</span>
                </div>

                {isProcessing && (
                  <div className="mt-3 text-xs text-amber-800 font-semibold animate-pulse">
                    Processing and optimizing image files for instant display...
                  </div>
                )}
              </div>

              {/* Uploaded Gallery Grid */}
              {uploadedList.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2">
                    <div>
                      <h4 className="font-bold text-stone-800 text-sm">
                        Uploaded Photos ({uploadedList.length})
                      </h4>
                      <p className="text-xs text-stone-500">
                        Choose whether to convert each photo into a new product or attach them to existing inventory
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleBatchCreateProductsFromImages}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Convert All to New Cloth Products</span>
                      </button>

                      <button
                        onClick={handleClearAllUploaded}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg"
                        title="Clear list"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto p-1">
                    {uploadedList.map((img) => (
                      <div 
                        key={img.id} 
                        className="bg-stone-50 rounded-xl border border-stone-200 overflow-hidden relative group"
                      >
                        <div className="aspect-square bg-stone-200 relative overflow-hidden">
                          <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-2 text-[11px] truncate">
                          <p className="font-semibold text-stone-800 truncate" title={img.name}>
                            {img.name}
                          </p>
                          <button
                            onClick={() => handleAttachImageToSelectedProduct(img.dataUrl)}
                            className="mt-1 w-full py-1 px-1.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] text-center block transition-colors"
                          >
                            + Attach to Selected
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-2">
                  <ImageIcon className="w-8 h-8 text-stone-400 mx-auto" />
                  <p className="text-xs font-semibold text-stone-600">
                    No custom images uploaded yet in this session.
                  </p>
                  <p className="text-[11px] text-stone-400 max-w-md mx-auto">
                    Upload your cloth product photos above to make them instantly viewable and orderable by your customers!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ASSIGN TO EXISTING PRODUCTS */}
          {activeTab === 'assign' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <label className="block text-xs font-bold text-amber-900">
                  Select Target Cloth Product to Receive Images:
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.categoryLabel}] {p.name} — {formatNaira(p.price)} ({p.images?.length || 0} images)
                    </option>
                  ))}
                </select>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleAttachAllToSelectedProduct}
                    disabled={uploadedList.length === 0}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Attach All {uploadedList.length} Uploaded Images to This Product</span>
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Current Live Inventory ({products.length} Products)
                </h4>
                <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto border border-stone-200 rounded-2xl">
                  {products.map((prod) => (
                    <div key={prod.id} className="p-3 flex items-center justify-between gap-3 hover:bg-stone-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=100&q=80'}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 truncate">
                            {prod.name}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-stone-500">
                            <span className="font-semibold text-amber-700">{formatNaira(prod.price)}</span>
                            <span>•</span>
                            <span>{prod.images?.length || 0} photo(s)</span>
                            <span>•</span>
                            <span className="capitalize">{prod.category}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedProductId(prod.id);
                          if (uploadedList.length > 0) {
                            handleAttachImageToSelectedProduct(uploadedList[0].dataUrl);
                          } else {
                            showSuccess(`Selected "${prod.name}". Upload or pick a photo to attach.`);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-amber-100 text-stone-800 hover:text-amber-900 shrink-0 border border-stone-200 transition-colors"
                      >
                        Select
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ADD NEW CLOTH PRODUCT */}
          {activeTab === 'new-product' && (
            <form onSubmit={handleCreateSingleProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Fabric / Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Luxury Velvet Sequin Lace or High Target Ankara"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as Product['category'])}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="ankara">Ankara Prints</option>
                    <option value="lace">Luxury Lace</option>
                    <option value="senator-atiku">Senator & Atiku</option>
                    <option value="sewing-machines">Sewing Machines & Irons</option>
                    <option value="accessories">Shoes, Bags & Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Price in Naira (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Measurement Unit *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    placeholder="e.g. per 6 yards piece, per 5 yards bundle, per yard"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Material / Texture
                  </label>
                  <input
                    type="text"
                    value={newProdMaterial}
                    onChange={(e) => setNewProdMaterial(e.target.value)}
                    placeholder="e.g. 100% Combed Cotton, Cord Lace, Cashmere Wool"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newProdDescription}
                    onChange={(e) => setNewProdDescription(e.target.value)}
                    placeholder="Short description for customers"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {uploadedList.length > 0 && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold">Image Attachment:</span> Will automatically attach your first uploaded photo (<span className="font-mono">{uploadedList[0].name}</span>) to this new product!
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Save and Publish New Cloth Product</span>
              </button>
            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0 text-xs text-stone-500">
          <span>Ayobami SAM Venture Catalog Sync • Balogun Market, Lagos</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
