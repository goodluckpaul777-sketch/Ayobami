import { Product, CustomerReview, CategoryInfo } from '../types';
import { PRODUCTS } from './products';

export const STORE_INFO = {
  name: 'Ayobami SAM Venture',
  tagline: 'Fabrics, Sewing Machines & Fashion Accessories',
  subtitle: 'Direct Balogun Market Lagos Merchant • Wholesale & Retail',
  address: 'Shop 14, Balogun Central Plaza, Balogun Market, Lagos Island, Lagos State, Nigeria',
  landmark: 'Adjacent Oluwole Complex, Lagos Island',
  phone: '+234 814 624 3747',
  whatsapp: '+2348146243747',
  email: 'goodluckolatomide406@gmail.com',
  businessHours: 'Mon - Sat: 8:00 AM – 6:00 PM (West Africa Time)',
  accountDetails: {
    bankName: 'Moniepoint / OPay / Commercial Merchant Bank',
    accountName: 'Ayobami SAM Venture',
    accountNumber: '0814624374',
    accountType: 'Verified Business Account',
  },
  deliveryInfo: {
    lagosSameDay: 'Same-day or next-day bike & dispatch delivery across Lagos Island, Ikeja, Surulere, Lekki, etc.',
    interstate: 'Nationwide interstate bus waybill (God Is Good, Peace Mass, Young Shall Grow, ABC Transport) within 24–48 hours.',
    international: 'DHL / FedEx international express shipping for diaspora orders (UK, USA, Canada, Europe).',
  }
};

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'all',
    name: 'All Collections',
    description: 'Explore our complete wholesale & retail collection',
    iconName: 'Sparkles',
  },
  {
    id: 'ankara',
    name: 'Ankara Prints',
    description: 'Hollandais, High Target, English Wax, Hitarget & Aso-Ebi Uniforms',
    iconName: 'Palette',
    badge: 'Hot Seller',
  },
  {
    id: 'lace',
    name: 'Luxury Lace',
    description: 'French Beaded, Swiss Voile, Cord Lace, Sequence & Net Gowns',
    iconName: 'Crown',
    badge: 'Luxury',
  },
  {
    id: 'senator-atiku',
    name: 'Senator & Atiku',
    description: 'Austrian Guinea Brocade, Italian Wool, Bazin Riche & Cashmere',
    iconName: 'Shirt',
  },
  {
    id: 'sewing-machines',
    name: 'Sewing Machines & Tools',
    description: 'Direct Drive Industrial, Overlock, Domestic & Gravity Steam Irons',
    iconName: 'Wrench',
    badge: 'Heavy Duty',
  },
  {
    id: 'accessories',
    name: 'Shoes, Bags & Accessories',
    description: 'Matching Italian Shoes & Bag Sets, Rhinestone Clutches & Millinery',
    iconName: 'ShoppingBag',
  },
];

// Connected to src/data/products.ts - safe synchronized local source
export const INITIAL_PRODUCTS: Product[] = PRODUCTS;

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    author: "Alhaja Folashade B.",
    location: "Ikeja, Lagos",
    rating: 5,
    date: "2 days ago",
    comment: "I ordered 45 pieces of the Royal Peacock Hollandais for my daughter's introduction ceremony. The quality is authentic, colors didn’t bleed after washing, and delivery to our hotel in Ikeja was same-day! God bless Ayobami SAM Venture.",
    verifiedPurchase: true,
    productName: "Original Hollandais Wax Ankara"
  },
  {
    id: "rev-2",
    author: "Engr. Emeka Okafor",
    location: "Port Harcourt, Rivers",
    rating: 5,
    date: "1 week ago",
    comment: "The direct drive industrial machine arrived in Port Harcourt within 48 hours via interstate logistics. Smooth, very silent, and doesn’t consume high generator fuel. Best dealer in Lagos.",
    verifiedPurchase: true,
    productName: "Direct Drive Industrial Sewing Machine"
  },
  {
    id: "rev-3",
    author: "Mrs. Titilayo Adebisi",
    location: "Surulere, Lagos",
    rating: 5,
    date: "2 weeks ago",
    comment: "The French Beaded Lace is simply breath-taking! My tailor in Surulere said the stones are firmly fixed and didn’t break his needle. Everyone at the party was asking where I got it.",
    verifiedPurchase: true,
    productName: "French Beaded Cord Lace"
  },
  {
    id: "rev-4",
    author: "Pastor Babatunde A.",
    location: "Abuja, FCT",
    rating: 5,
    date: "3 weeks ago",
    comment: "The Austrian Guinea Brocade is top tier. Crisp sound, luxurious shine, exactly what you expect from Balogun market wholesale merchants.",
    verifiedPurchase: true,
    productName: "Authentic Austrian Guinea Brocade"
  }
];
