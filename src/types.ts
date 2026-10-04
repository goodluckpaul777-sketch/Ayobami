export interface Product {
  id: string;
  name: string;
  category: 'ankara' | 'lace' | 'senator-atiku' | 'sewing-machines' | 'accessories' | string;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  unit: string;
  rating: number;
  reviewsCount: number;
  description: string;
  features: string[];
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  sku?: string;
  material?: string;
  colors?: string[];
  wholesalePrice?: number;
  wholesaleMinYards?: number;
  images: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  productName: string;
}

export interface OrderDetails {
  customerName: string;
  phoneNumber: string;
  email?: string;
  deliveryAddress: string;
  stateOrCity: string;
  paymentMethod: 'whatsapp' | 'bank_transfer' | 'pickup';
  notes?: string;
  items: {
    productId: string;
    productName: string;
    unit: string;
    price: number;
    quantity: number;
    color?: string;
  }[];
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
  createdAt?: string;
}

export type CategoryId = 'all' | 'ankara' | 'lace' | 'senator-atiku' | 'sewing-machines' | 'accessories';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  description: string;
  iconName: string;
  badge?: string;
}
