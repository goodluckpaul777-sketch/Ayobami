import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const STORAGE_KEY = 'ayobami_sam_products_v2';
const CUSTOM_IMAGES_KEY = 'ayobami_sam_uploaded_images_v2';

export interface UploadedImageFile {
  id: string;
  name: string;
  dataUrl: string;
  size: number;
  uploadedAt: string;
  assignedProductId?: string;
  categorySuggestion?: Product['category'];
}

export const ProductStorage = {
  getProducts(): Product[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load products from storage:', e);
    }
    return INITIAL_PRODUCTS;
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn('LocalStorage limit reached while saving products, attempting cleanup', e);
      // If quota exceeded, save essential product data
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products.slice(0, 50)));
      } catch (inner) {
        console.error('Cannot save to local storage', inner);
      }
    }
  },

  addProduct(product: Product): Product[] {
    const current = this.getProducts();
    const updated = [product, ...current];
    this.saveProducts(updated);
    return updated;
  },

  updateProduct(updatedProduct: Product): Product[] {
    const current = this.getProducts();
    const updated = current.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    this.saveProducts(updated);
    return updated;
  },

  deleteProduct(productId: string): Product[] {
    const current = this.getProducts();
    const updated = current.filter(p => p.id !== productId);
    this.saveProducts(updated);
    return updated;
  },

  resetToDefault(): Product[] {
    this.saveProducts(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  },

  // Uploaded images repository
  getUploadedImages(): UploadedImageFile[] {
    try {
      const stored = localStorage.getItem(CUSTOM_IMAGES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load uploaded images:', e);
    }
    return [];
  },

  saveUploadedImages(images: UploadedImageFile[]): void {
    try {
      localStorage.setItem(CUSTOM_IMAGES_KEY, JSON.stringify(images));
    } catch (e) {
      console.warn('Storage limit when saving uploaded images', e);
    }
  },

  addUploadedImage(image: UploadedImageFile): void {
    const images = this.getUploadedImages();
    // avoid exact duplicate IDs
    const filtered = images.filter(img => img.id !== image.id);
    const updated = [image, ...filtered];
    this.saveUploadedImages(updated.slice(0, 40)); // keep top 40 images
  },

  attachImageToProduct(productId: string, imageUrl: string): Product[] {
    const current = this.getProducts();
    const updated = current.map(prod => {
      if (prod.id === productId) {
        const existingImages = prod.images || [];
        if (!existingImages.includes(imageUrl)) {
          return {
            ...prod,
            images: [imageUrl, ...existingImages]
          };
        }
      }
      return prod;
    });
    this.saveProducts(updated);
    return updated;
  }
};
