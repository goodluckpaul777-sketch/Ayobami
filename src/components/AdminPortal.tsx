import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Check, 
  Camera,
  Loader2,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Layers,
  CheckCircle2,
  Image as ImageIcon,
  RefreshCw
} from 'lucide-react';
import { Product, CategoryId } from '../types';
import { formatNaira, generateId } from '../utils/formatters';
import { StoreService } from '../services/storeService';
import { firebaseConfig } from '../firebase';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductsUpdated: (products: Product[]) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  products,
  onProductsUpdated,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');

  // Form State for Adding / Editing Product
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<CategoryId>('ankara');
  const [formPrice, setFormPrice] = useState<number>(30000);
  const [formUnit, setFormUnit] = useState('per 6 yards piece');
  const [formDescription, setFormDescription] = useState('Premium quality authentic fabric directly from Balogun Market.');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Status & Loading
  const [isProcessingPhotos, setIsProcessingPhotos] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showApiConfig, setShowApiConfig] = useState(false);

  const handleManualSync = async () => {
    setIsRefreshing(true);
    setFeedbackMessage(null);
    try {
      const res = await StoreService.fetchFirestoreProducts(true);
      if (res.products && res.products.length > 0) {
        onProductsUpdated(res.products);
        setFeedbackMessage({
          text: res.fromCache 
            ? `Loaded ${res.products.length} products from persistent local disk cache.`
            : `✓ Successfully synced ${res.products.length} products live from Firestore Cloud.`,
          type: 'success',
        });
      }
    } catch {
      setFeedbackMessage({ text: 'Cloud is busy or quota limit reached. Serving from persistent cache.', type: 'error' });
    } finally {
      setIsRefreshing(false);
    }
  };

  const resetForm = () => {
    setEditingProductId(null);
    setFormName('');
    setFormCategory('ankara');
    setFormPrice(30000);
    setFormUnit('per 6 yards piece');
    setFormDescription('Premium quality authentic fabric directly from Balogun Market.');
    setFormImages([]);
    setImageUrlInput('');
  };

  // Handle Photo File Selection (Immediate & Local)
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingPhotos(true);
    setFeedbackMessage(null);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedUrl = await StoreService.uploadImage(file);
        if (compressedUrl) {
          newUrls.push(compressedUrl);
        }
      }
      setFormImages((prev) => [...prev, ...newUrls]);
      setFeedbackMessage({
        text: `✓ ${newUrls.length} photo(s) added! Fill details and click "Save & Publish".`,
        type: 'success',
      });
    } catch (err) {
      console.error('Photo processing error:', err);
      setFeedbackMessage({
        text: 'Could not process one or more images. Please try another photo.',
        type: 'error',
      });
    } finally {
      setIsProcessingPhotos(false);
      e.target.value = '';
    }
  };

  // Add Image URL manually
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  // Remove Photo from form
  const handleRemovePhoto = (index: number) => {
    setFormImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Save Product (Instant + Syncs to Firestore)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFeedbackMessage({ text: 'Please enter a product name.', type: 'error' });
      return;
    }

    setIsSaving(true);
    setFeedbackMessage(null);

    const categoryLabels: Record<CategoryId, string> = {
      'ankara': 'Ankara Prints',
      'lace': 'Luxury Lace',
      'senator-atiku': 'Senator & Atiku',
      'sewing-machines': 'Sewing Machines & Tools',
      'accessories': 'Shoes, Bags & Accessories',
    };

    const finalImages = formImages.length > 0 
      ? formImages 
      : ['https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'];

    const productPayload: Product = {
      id: editingProductId || generateId('prod'),
      name: formName.trim(),
      category: formCategory,
      categoryLabel: categoryLabels[formCategory] || 'Fabrics',
      price: Number(formPrice) || 30000,
      originalPrice: Math.round((Number(formPrice) || 30000) * 1.15),
      unit: formUnit.trim() || 'per 6 yards piece',
      rating: 5.0,
      reviewsCount: 14,
      description: formDescription.trim(),
      features: ['Authentic Balogun Market Quality', '100% Cotton & Pure Weave', 'Colorfast Guarantee'],
      inStock: true,
      stockCount: 25,
      colors: ['Vibrant Multi-Color'],
      images: finalImages,
    };

    try {
      const updatedList = await StoreService.saveProduct(productPayload);
      onProductsUpdated(updatedList);
      
      setFeedbackMessage({
        text: `✓ "${productPayload.name}" saved and synced to Firebase Cloud!`,
        type: 'success',
      });

      // Reset form and switch to catalog view to see it
      setTimeout(() => {
        resetForm();
        setActiveTab('list');
      }, 700);
    } catch (err) {
      console.error('Failed to save product:', err);
      setFeedbackMessage({
        text: 'Error saving product. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the store?`)) return;
    try {
      const updatedList = await StoreService.deleteProduct(id);
      onProductsUpdated(updatedList);
      setFeedbackMessage({
        text: `Product "${name}" deleted.`,
        type: 'success',
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Edit existing product
  const handleStartEdit = (prod: Product) => {
    setEditingProductId(prod.id);
    setFormName(prod.name);
    setFormCategory(prod.category as CategoryId);
    setFormPrice(prod.price);
    setFormUnit(prod.unit);
    setFormDescription(prod.description);
    setFormImages(prod.images || []);
    setActiveTab('add');
  };

  // Quick photo upload directly for a listed product
  const handleQuickAddPhotoToListed = async (product: Product, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newPhotos: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const compressed = await StoreService.uploadImage(files[i]);
      if (compressed) newPhotos.push(compressed);
    }
    const updatedProd: Product = {
      ...product,
      images: [...newPhotos, ...(product.images || [])],
    };
    const updatedList = await StoreService.saveProduct(updatedProd);
    onProductsUpdated(updatedList);
    setFeedbackMessage({
      text: `✓ Added ${newPhotos.length} photo(s) to "${product.name}"!`,
      type: 'success',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Merchant Store Admin</h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Firebase Cloud Live
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Easily add cloth photos, set prices, and publish live to all customer devices.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 pt-2 gap-2">
          <button
            onClick={() => {
              if (editingProductId) resetForm();
              setActiveTab('add');
            }}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'add'
                ? 'border-amber-600 text-amber-900 bg-white shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Plus className="w-4 h-4 text-amber-600" />
            <span>{editingProductId ? 'Edit Product' : '＋ Add New Cloth Product'}</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'list'
                ? 'border-amber-600 text-amber-900 bg-white shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Store Inventory ({products.length})</span>
          </button>
        </div>

        {/* Global Feedback Alert */}
        {feedbackMessage && (
          <div className={`mx-4 sm:mx-6 mt-3 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
            feedbackMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}>
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <X className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
          {/* TAB 1: ADD / EDIT PRODUCT */}
          {activeTab === 'add' && (
            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* 1. Convenient Photo Upload Box */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-300 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-700" />
                    <span>Cloth Photos (Camera / Gallery) *</span>
                  </label>
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full">
                    {formImages.length} photo(s) selected
                  </span>
                </div>

                {/* Big Drag / Click Uploader */}
                <label className="border-2 border-dashed border-amber-400 hover:border-amber-600 bg-white hover:bg-amber-100/40 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-xs group">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    {isProcessingPhotos ? (
                      <Loader2 className="w-6 h-6 animate-spin text-amber-700" />
                    ) : (
                      <Upload className="w-6 h-6 text-amber-700" />
                    )}
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-stone-900">
                    {isProcessingPhotos ? 'Processing Photos...' : 'Tap to Upload Cloth Photos (Camera / Phone Gallery)'}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-1">
                    Select one or multiple photos from your device. They will be saved to your live store.
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    disabled={isProcessingPhotos}
                    className="hidden"
                  />
                </label>

                {/* Thumbnail Previews */}
                {formImages.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-stone-500 font-semibold block">
                      Selected Photos (First photo will be the main cover):
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                      {formImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-stone-300 shadow-xs group">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white shadow-xs hover:scale-110 transition-transform"
                            title="Remove photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {idx === 0 && (
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-stone-900/80 text-[8px] font-bold text-amber-300">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Or paste link option */}
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Or paste an image web link here..."
                    className="flex-1 p-2 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-2 rounded-xl bg-stone-800 text-white font-semibold text-xs hover:bg-stone-700"
                  >
                    Add Link
                  </button>
                </div>
              </div>

              {/* 2. Product Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Cloth / Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Original Hollandais Wax Ankara"
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Store Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as CategoryId)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-xs focus:border-amber-500"
                  >
                    <option value="ankara">Ankara Prints</option>
                    <option value="lace">Luxury Lace</option>
                    <option value="senator-atiku">Senator &amp; Atiku</option>
                    <option value="sewing-machines">Sewing Machines &amp; Tools</option>
                    <option value="accessories">Shoes, Bags &amp; Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Price in Naira (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Yard Measurement / Unit *
                  </label>
                  <input
                    type="text"
                    required
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="e.g. per 6 yards piece"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-stone-800 text-xs mb-1">
                  Description / Notes
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:border-amber-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                {editingProductId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                  >
                    Cancel Edit
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
                      <span>Saving &amp; Syncing to Cloud...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingProductId ? 'Update Product' : '✓ Save & Publish to Website'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: STORE INVENTORY LIST */}
          {activeTab === 'list' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs text-stone-500 font-medium">
                  Showing all products in your store catalog.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleManualSync}
                    disabled={isRefreshing}
                    className="px-2.5 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all disabled:opacity-60"
                    title="Check for live updates from Firebase Cloud"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-stone-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>{isRefreshing ? 'Syncing...' : 'Sync Cloud'}</span>
                  </button>

                  <button
                    onClick={() => {
                      resetForm();
                      setActiveTab('add');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-amber-700 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>

              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white">
                {products.map((prod) => {
                  const primaryImg = prod.images?.[0] || '/images/products/prod-ankara-01-0.jpg';
                  return (
                    <div key={prod.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <img 
                          src={primaryImg} 
                          alt="" 
                          className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0" 
                        />
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                            {prod.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                            <span className="font-bold text-amber-900 font-serif">
                              {formatNaira(prod.price)}
                            </span>
                            <span>•</span>
                            <span className="text-[11px] bg-stone-100 px-2 py-0.5 rounded-md font-medium">
                              {prod.categoryLabel}
                            </span>
                            <span>•</span>
                            <span className="text-[11px] text-stone-400">
                              {prod.images?.length || 0} photo(s)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons on product row */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {/* Quick Add Photo */}
                        <label 
                          className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                          title="Attach more photos to this cloth"
                        >
                          <Camera className="w-3.5 h-3.5 text-amber-700" />
                          <span>+ Photo</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleQuickAddPhotoToListed(prod, e.target.files)}
                          />
                        </label>

                        {/* Edit Details */}
                        <button
                          onClick={() => handleStartEdit(prod)}
                          className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
                        >
                          Edit
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Cloud Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 text-stone-600 text-[11px] px-4 sm:px-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Cloud DB: <strong>{firebaseConfig.firestoreDatabaseId || 'adebisi-store-live'}</strong></span>
            </div>
            <button
              type="button"
              onClick={() => setShowApiConfig(!showApiConfig)}
              className="text-amber-800 hover:text-amber-950 font-semibold underline"
            >
              {showApiConfig ? 'Hide Cloud Config' : 'View API Key & Config'}
            </button>
          </div>

          {showApiConfig && (
            <div className="p-3 rounded-xl bg-stone-900 text-stone-200 font-mono text-[10px] space-y-1 animate-in fade-in">
              <div className="text-amber-400 font-bold mb-1">Live Firebase Binding Credentials:</div>
              <div><strong>Project ID:</strong> {firebaseConfig.projectId}</div>
              <div><strong>Firestore DB:</strong> {firebaseConfig.firestoreDatabaseId}</div>
              <div><strong>API Key:</strong> {firebaseConfig.apiKey}</div>
              <div><strong>App ID:</strong> {firebaseConfig.appId}</div>
              <div className="text-stone-400 text-[9px] pt-1">
                Config file location: <span className="text-amber-300">/firebase-applet-config.json</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
