import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  Cloud, 
  Check, 
  AlertCircle, 
  Image as ImageIcon,
  Save,
  Download,
  FolderOpen,
  Sparkles,
  Layers,
  Database
} from 'lucide-react';
import { Product } from '../types';
import { formatNaira, generateId } from '../utils/formatters';
import { compressImageFile } from '../utils/imageCompressor';
import { StoreService } from '../services/storeService';
import { testFirestoreConnection, firebaseConfig } from '../firebase';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductsUpdated: (updated: Product[]) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  products,
  onProductsUpdated,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'upload' | 'catalog' | 'cloud'>('upload');
  
  // Image Upload state
  const [selectedProductId, setSelectedProductId] = useState<string>(
    products.length > 0 ? products[0].id : ''
  );
  const [newImageUrls, setNewImageUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New/Edit Product Form state
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'ankara' | 'lace' | 'senator-atiku' | 'sewing-machines' | 'accessories'>('ankara');
  const [formPrice, setFormPrice] = useState<number>(30000);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(35000);
  const [formUnit, setFormUnit] = useState('per 6 yards piece');
  const [formDescription, setFormDescription] = useState('');
  const [formStock, setFormStock] = useState<number>(20);
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formFeatures, setFormFeatures] = useState<string>('100% Cotton, 6 Full Yards, Fade-resistant');
  const [formColors, setFormColors] = useState<string>('Royal Blue, Emerald Green, Gold');

  // Cloud Sync state
  const [cloudStatus, setCloudStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Handle local image file uploads (with auto-compression)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingImages(true);
    setUploadMessage(null);

    const uploadedUrls: string[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedUrl = await StoreService.uploadImage(file);
        uploadedUrls.push(uploadedUrl);
      }
      setNewImageUrls((prev) => [...prev, ...uploadedUrls]);
      setUploadMessage({
        text: `Successfully processed ${uploadedUrls.length} image(s)! Click "Save to Product" to publish to all devices.`,
        type: 'success',
      });
    } catch (err) {
      console.error(err);
      setUploadMessage({
        text: 'Error processing image files. Please check file format.',
        type: 'error',
      });
    } finally {
      setIsProcessingImages(false);
      // Reset input value so same files can be re-selected if desired
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!urlInput.trim()) return;
    setNewImageUrls((prev) => [...prev, urlInput.trim()]);
    setUrlInput('');
  };

  const handleRemoveNewImage = (idx: number) => {
    setNewImageUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  // Save uploaded images to the selected product
  const handleSaveImagesToProduct = async () => {
    if (!selectedProductId) {
      setUploadMessage({ text: 'Please select a cloth product first.', type: 'error' });
      return;
    }
    if (newImageUrls.length === 0) {
      setUploadMessage({ text: 'Please upload or add at least one image.', type: 'error' });
      return;
    }

    const targetProduct = products.find((p) => p.id === selectedProductId);
    if (!targetProduct) return;

    const updatedProduct: Product = {
      ...targetProduct,
      images: [...newImageUrls, ...(targetProduct.images || [])],
    };

    const updatedCatalog = await StoreService.saveProduct(updatedProduct);
    onProductsUpdated(updatedCatalog);
    setNewImageUrls([]);
    setUploadMessage({
      text: `Images successfully uploaded & saved to "${targetProduct.name}"!`,
      type: 'success',
    });
  };

  // Start creating new product
  const handleStartCreateProduct = () => {
    setEditingId(null);
    setFormName('');
    setFormCategory('ankara');
    setFormPrice(30000);
    setFormOriginalPrice(35000);
    setFormUnit('per 6 yards piece');
    setFormDescription('High-quality authentic fabric directly sourced from Balogun Market.');
    setFormStock(25);
    setFormImages([]);
    setFormFeatures('100% Premium Cotton, 6 Full Yards, Rich Colors');
    setFormColors('Blue, Gold, Wine');
    setIsEditingProduct(true);
  };

  // Start editing existing product
  const handleStartEditProduct = (prod: Product) => {
    setEditingId(prod.id);
    setFormName(prod.name);
    setFormCategory(prod.category as any);
    setFormPrice(prod.price);
    setFormOriginalPrice(prod.originalPrice || prod.price);
    setFormUnit(prod.unit);
    setFormDescription(prod.description);
    setFormStock(prod.stockCount);
    setFormImages(prod.images || []);
    setFormFeatures((prod.features || []).join(', '));
    setFormColors((prod.colors || []).join(', '));
    setIsEditingProduct(true);
  };

  // Save product from form
  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const categoryLabels: Record<string, string> = {
      'ankara': 'Ankara Prints',
      'lace': 'Luxury Lace',
      'senator-atiku': 'Senator & Atiku',
      'sewing-machines': 'Sewing Machines & Tools',
      'accessories': 'Shoes, Bags & Accessories',
    };

    const productPayload: Product = {
      id: editingId || generateId('prod'),
      name: formName,
      category: formCategory,
      categoryLabel: categoryLabels[formCategory] || 'Fabrics',
      price: Number(formPrice),
      originalPrice: Number(formOriginalPrice),
      unit: formUnit,
      rating: 5.0,
      reviewsCount: 12,
      description: formDescription,
      features: formFeatures.split(',').map((s) => s.trim()).filter(Boolean),
      inStock: formStock > 0,
      stockCount: Number(formStock),
      colors: formColors.split(',').map((s) => s.trim()).filter(Boolean),
      images: formImages.length > 0 ? formImages : ['https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'],
    };

    const updatedList = await StoreService.saveProduct(productPayload);
    onProductsUpdated(updatedList);
    setIsEditingProduct(false);
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const updated = await StoreService.deleteProduct(id);
    onProductsUpdated(updated);
  };

  // Test Firestore Connection
  const handleTestConnection = async () => {
    setCloudStatus('Testing Firestore connection to database "adebisi-store-live"...');
    const res = await testFirestoreConnection();
    setCloudStatus(res.message);
  };

  // Sync all products to Firestore
  const handleSyncToFirestore = async () => {
    setIsSyncing(true);
    setCloudStatus('Syncing catalog to Firestore database "adebisi-store-live"...');
    const res = await StoreService.syncAllToFirestore(products);
    setIsSyncing(false);
    if (res.success) {
      setCloudStatus(`Successfully synced ${res.count} products to Firestore!`);
    } else {
      setCloudStatus('Sync encountered an issue or client is offline.');
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `ayobami_sam_catalog_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                Merchant Admin &amp; Cloth Product Uploader
              </h2>
              <p className="text-xs text-stone-500">
                Manage cloth products, attach photos, and sync with Firestore database.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 px-4 sm:px-6 bg-white gap-2">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'upload'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Upload Images to Cloth Products</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'catalog'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Product Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cloud')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'cloud'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Firebase &amp; Database Sync</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: Upload Images to Cloth Products */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              {uploadMessage && (
                <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
                  uploadMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-red-50 text-red-900 border border-red-200'
                }`}>
                  {uploadMessage.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{uploadMessage.text}</span>
                </div>
              )}

              {/* Step 1: Select Target Product */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  1. Select Cloth Product to receive images:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ({p.categoryLabel})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleStartCreateProduct}
                    className="p-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs border border-amber-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-amber-700" />
                    <span>Create Brand New Cloth Product</span>
                  </button>
                </div>
              </div>

              {/* Step 2: Choose / Drop Images */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  2. Choose / Upload Photos (IMG-WA*.jpg, camera, or screenshots):
                </label>

                {/* Drag and Drop Zone */}
                <label className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/80 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-xs sm:text-sm text-stone-900">
                    Click to browse or drag and drop WhatsApp cloth photos here
                  </span>
                  <span className="text-[11px] text-stone-500 mt-1">
                    Supports multiple files (JPG, PNG, WebP). Automatically resized &amp; optimized for rapid loading.
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Direct URL input alternative */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Or paste an image web URL here..."
                    className="flex-1 p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-semibold text-xs"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Step 3: Pending Images Preview & Action */}
              {newImageUrls.length > 0 && (
                <div className="space-y-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800">
                      Pending Images to be uploaded ({newImageUrls.length}):
                    </span>
                    <button
                      onClick={() => setNewImageUrls([])}
                      className="text-stone-400 hover:text-red-600 text-[11px]"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {newImageUrls.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-stone-300 group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleRemoveNewImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white shadow-xs opacity-80 hover:opacity-100 transition-opacity"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSaveImagesToProduct}
                    disabled={isProcessingImages}
                    className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save {newImageUrls.length} Image(s) to Selected Product</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Product Catalog & CRUD */}
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  Manage all products currently in store catalog.
                </span>
                <button
                  onClick={handleStartCreateProduct}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {isEditingProduct ? (
                /* Form to Add / Edit Product */
                <form onSubmit={handleSaveProductForm} className="p-4 sm:p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-bold text-stone-900 text-sm">
                      {editingId ? 'Edit Product' : 'Create New Cloth / Equipment Product'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingProduct(false)}
                      className="text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Product Name *</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Original Hollandais Wax Ankara"
                        className="w-full p-2 rounded-lg border border-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Category *</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as any)}
                        className="w-full p-2 rounded-lg border border-stone-300 bg-white"
                      >
                        <option value="ankara">Ankara Prints</option>
                        <option value="lace">Luxury Lace</option>
                        <option value="senator-atiku">Senator &amp; Atiku</option>
                        <option value="sewing-machines">Sewing Machines &amp; Tools</option>
                        <option value="accessories">Shoes, Bags &amp; Accessories</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Price (NGN ₦) *</label>
                      <input
                        type="number"
                        required
                        value={formPrice}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Original Price (Strikeout ₦)</label>
                      <input
                        type="number"
                        value={formOriginalPrice}
                        onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Unit Description *</label>
                      <input
                        type="text"
                        required
                        value={formUnit}
                        onChange={(e) => setFormUnit(e.target.value)}
                        placeholder="e.g. per 6 yards piece"
                        className="w-full p-2 rounded-lg border border-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Stock Quantity</label>
                      <input
                        type="number"
                        value={formStock}
                        onChange={(e) => setFormStock(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-stone-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 text-xs mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full p-2 rounded-lg border border-stone-300 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Colors (comma separated)</label>
                      <input
                        type="text"
                        value={formColors}
                        onChange={(e) => setFormColors(e.target.value)}
                        className="w-full p-2 rounded-lg border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Features (comma separated)</label>
                      <input
                        type="text"
                        value={formFeatures}
                        onChange={(e) => setFormFeatures(e.target.value)}
                        className="w-full p-2 rounded-lg border border-stone-300"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProduct(false)}
                      className="px-4 py-2 rounded-xl bg-stone-200 text-stone-800 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                    >
                      Save Product
                    </button>
                  </div>
                </form>
              ) : (
                /* Products list */
                <div className="divide-y divide-stone-100 border rounded-2xl overflow-hidden">
                  {products.map((p) => {
                    const img = p.images?.[0] || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=200&q=80';
                    return (
                      <div key={p.id} className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-stone-50">
                        <div className="flex items-center gap-3">
                          <img src={img} alt="" className="w-12 h-12 rounded-xl object-cover border" />
                          <div>
                            <div className="font-semibold text-xs sm:text-sm text-stone-900 line-clamp-1">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-stone-500">
                              {formatNaira(p.price)} • {p.categoryLabel} • {p.images?.length || 0} images • Stock: {p.stockCount}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleStartEditProduct(p)}
                            className="p-2 rounded-lg text-stone-500 hover:text-amber-800 hover:bg-amber-50"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Firebase & Database Sync */}
          {activeTab === 'cloud' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <Database className="w-4 h-4 text-amber-700" />
                  <span>Configured Firebase Project</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-700">
                  <div><strong>Project ID:</strong> {firebaseConfig.projectId}</div>
                  <div><strong>Firestore DB:</strong> {firebaseConfig.firestoreDatabaseId || 'adebisi-store-live'}</div>
                  <div><strong>Storage Bucket:</strong> {firebaseConfig.storageBucket}</div>
                  <div><strong>Auth Domain:</strong> {firebaseConfig.authDomain}</div>
                </div>
              </div>

              {cloudStatus && (
                <div className="p-3 rounded-xl bg-stone-100 border text-xs text-stone-800 flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-amber-600" />
                  <span>{cloudStatus}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleTestConnection}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-amber-400 bg-white hover:bg-stone-50 text-left text-xs transition-all"
                >
                  <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-amber-700" />
                    <span>Test Firestore Connection</span>
                  </div>
                  <div className="text-stone-500">
                    Verify that your app connects to database instance <strong>adebisi-store-live</strong>.
                  </div>
                </button>

                <button
                  onClick={handleSyncToFirestore}
                  disabled={isSyncing}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-amber-400 bg-white hover:bg-stone-50 text-left text-xs transition-all"
                >
                  <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                    <Cloud className="w-4 h-4 text-amber-700" />
                    <span>{isSyncing ? 'Syncing...' : 'Sync All Products to Firestore'}</span>
                  </div>
                  <div className="text-stone-500">
                    Push the full catalog of {products.length} products to the cloud database.
                  </div>
                </button>
              </div>

              <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handleExportJSON}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-semibold text-xs flex items-center gap-2 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup (JSON)</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Reset store catalog to standard initial Balogun market collection?')) {
                      const initial = StoreService.resetToDefault();
                      onProductsUpdated(initial);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl text-stone-600 hover:text-red-700 text-xs font-semibold"
                >
                  Reset Catalog to Default
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
