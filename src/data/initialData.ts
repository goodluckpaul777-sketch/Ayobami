import { Category, FabricProduct, StoreSettings, SectionCategoryInfo, TailoringYardGuide, CustomerTestimonial } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-machines-irons', name: 'Tailoring Irons & Equipment', slug: 'tailoring-irons', mainSection: 'tailoring-machine', description: 'Heavy-duty tailor pressing irons and tools', itemCount: 1 },
  { id: 'cat-machines-industrial', name: 'Industrial Sewing Machines', slug: 'industrial-machines', mainSection: 'tailoring-machine', description: 'Direct drive industrial tailoring machines', itemCount: 0 },
  { id: 'cat-cloths-ankara', name: 'Ankara Prints', slug: 'ankara', mainSection: 'cloths', description: 'Original vibrant African wax prints', itemCount: 0 },
  { id: 'cat-cloths-lace', name: 'Swiss Voile Lace', slug: 'lace', mainSection: 'cloths', description: 'Luxury party and owambe lace fabrics', itemCount: 0 },
  { id: 'cat-cloths-senator', name: 'Senator Suiting', slug: 'senator', mainSection: 'cloths', description: 'Super 150s wool cashmere suitings', itemCount: 0 },
  { id: 'cat-shoes-loafers', name: 'Men Loafers', slug: 'loafers', mainSection: 'shoes', description: 'Handcrafted genuine leather loafers', itemCount: 0 },
  { id: 'cat-shoes-matching-sets', name: 'Matching Shoe & Bag Sets', slug: 'matching-sets', mainSection: 'shoes', description: 'Coordinated 2-in-1 party sets', itemCount: 0 },
];

export const INITIAL_PRODUCTS: FabricProduct[] = [
  {
    id: 'prod-peacock-iron',
    name: 'Peacock Iron',
    mainSection: 'tailoring-machine',
    category: 'Tailoring Irons & Equipment',
    categorySlug: 'tailoring-irons',
    description: 'Original heavy-duty Peacock tailoring pressing iron. Features solid cast metal construction, superior heat retention, ergonomic heat-resistant wooden handle, and smooth heavy pressing base. Perfect for creating razor-sharp creases on Senator native suits, Agbada folds, Ankara dresses, and heavy tailoring fabrics.',
    availableStock: 30,
    minimumOrder: 1,
    unitLabel: 'piece',
    image: '/peacock-iron.jpeg',
    galleryImages: ['/peacock-iron.jpeg'],
    colors: ['Original Silver Metal'],
    fabricType: 'Heavy-Duty Solid Cast Metal Pressing Iron',
    isNewArrival: true,
    isFeatured: true,
    inStock: true,
    rating: 5.0,
    reviewCount: 42,
    suitableFor: [
      'Senator Native Suit Creasing',
      'Agbada & Buba Pressing',
      'Lace & Ankara Starch Finishing',
      'Professional Tailoring Workshops',
      'Commercial Dry Cleaning & Pressing'
    ],
    textureNote: 'Solid heavy-gauge iron base with superior heat conductivity for razor-sharp tailoring creases.',
    origin: 'Original Peacock Brand',
    isWholesaleAvailable: true,
    wholesaleNote: 'Bulk carton wholesale pricing available for tailoring institutes and merchants nationwide.',
    badge: 'Tailor Choice'
  }
];

export const STORE_SETTINGS: StoreSettings = {
  storeName: 'Ayobami SAM Ventures',
  tagline: 'Premium Fabrics, Bespoke Shoes & Bags, and Tailoring Equipment',
  address: '37/39 Balogun West, Molake House, Lagos Island, Nigeria',
  marketLocation: '37/39 Balogun West, Molake House, Lagos Island',
  city: 'Lagos Island',
  state: 'Lagos State',
  country: 'Nigeria',
  phone: '08033810865',
  phoneNumbers: ['08033810865', '+234 803 381 0865'],
  secondaryPhone: '+234 803 381 0865',
  whatsapp: '2348033810865',
  email: '',
  announcement: '✨ Welcome to Ayobami SAM Ventures! Direct Wholesale & Retail for Fabrics, Shoes, Matching Bags & Tailoring Machines. Click any product to order directly on WhatsApp!',
  themeColor: '#0F2E22',
  logoUrl: '/hero-logo.png',
  aboutText: 'Ayobami SAM Ventures (ASV) is your trusted Nigerian merchant for authentic Swiss Voile Laces, Dutch Wax Ankara, Cashmere Senator suitings, Atiku Brocades, handcrafted Italian native shoes, coordinated 2-in-1 matching shoe and bag sets, and industrial sewing equipment. Serving retail fashion enthusiasts and wholesale merchants nationwide.',
  businessType: 'Wholesale & Retail Merchant',
  customerReach: 'Nationwide & International Diaspora Delivery',
  openingHours: 'Open 24/7 (Always Open for Orders & Inquiries)',
  bankDetails: {
    bankName: '',
    accountNumber: '',
    accountName: ''
  },
  stateDeliveryRates: {
    'Lagos State': { name: 'Lagos State', rate: 2500, deliveryDays: '24 - 48 Hours' },
    'Oyo State (Ibadan)': { name: 'Oyo State (Ibadan)', rate: 1500, deliveryDays: 'Same Day / 24 Hours' },
    'Ogun State': { name: 'Ogun State', rate: 3000, deliveryDays: '24 - 48 Hours' },
    'Osun State': { name: 'Osun State', rate: 3000, deliveryDays: '24 - 48 Hours' },
    'Ondo State': { name: 'Ondo State', rate: 3500, deliveryDays: '2 - 3 Days' },
    'Ekiti State': { name: 'Ekiti State', rate: 3500, deliveryDays: '2 - 3 Days' },
    'FCT Abuja': { name: 'FCT Abuja', rate: 4500, deliveryDays: '2 - 3 Days' },
    'Rivers State (Port Harcourt)': { name: 'Rivers State (Port Harcourt)', rate: 5000, deliveryDays: '2 - 4 Days' },
    'Kano / Kaduna State': { name: 'Kano / Kaduna State', rate: 5500, deliveryDays: '3 - 5 Days' },
    'Other States / Nationwide Interstate': { name: 'Other States / Nationwide Interstate', rate: 4500, deliveryDays: '2 - 4 Days via Interstate Park / Courier' }
  },
  freeDeliveryThreshold: 100000,
  enableWhatsAppDirect: true
};

export const INITIAL_STORE_SETTINGS = STORE_SETTINGS;

export const OFFICIAL_LOGO_URL = '/hero-logo.png';

export const CATEGORIES = INITIAL_CATEGORIES;

export const MAIN_SECTIONS: SectionCategoryInfo[] = [
  {
    id: 'cloths',
    name: 'Fabrics & Textiles',
    slug: 'cloths',
    subtitle: 'Laces, Ankara & Senator Suitings',
    description: 'Authentic Swiss Voile Laces, Dutch Wax Ankara, Guinea Brocade, and Super 150s Cashmere Senator materials.',
    image: '/shop-location.jpg',
    subcategories: ['Ankara Prints', 'Swiss Voile Lace', 'Senator Cashmere', 'Atiku Brocade'],
    features: ['100% Pure Cotton', 'Original Dutch Wax', 'Direct Wholesale Cuts', 'Aso-Ebi Uniform Bundles']
  },
  {
    id: 'shoes',
    name: 'Shoes, Bags & Sets',
    slug: 'shoes',
    subtitle: 'Handcrafted Italian Shoes & Matching Sets',
    description: 'Bespoke Italian native loafers, formal monk straps, and luxury coordinated 2-in-1 matching shoe & clutch bag sets.',
    image: '/logo.png',
    subcategories: ['Men Native Loafers', '2-in-1 Matching Sets', 'Luxury Handbags', 'Monk Strap Shoes'],
    features: ['Genuine Italian Leather', 'Coordinated Color Sets', 'Comfort Cushion Soles', 'Bespoke Sizing']
  },
  {
    id: 'tailoring-machine',
    name: 'Tailoring Machines & Equipment',
    slug: 'tailoring-machine',
    subtitle: 'Industrial, Domestic & Pressing Gear',
    description: 'Commercial direct-drive sewing machines, Peacock heavy-duty pressing irons, overlock machines, and tailoring workshop equipment.',
    image: '/peacock-iron.jpeg',
    subcategories: ['Tailoring Irons & Equipment', 'Industrial Machines', 'Domestic Sewing', 'Overlock Weaving'],
    features: ['Heavy Duty Durability', 'Superior Heat Retention', 'Smooth Flat Pressing', 'Workshop Ready']
  }
];

export const TAILORING_YARD_GUIDES: TailoringYardGuide[] = [
  {
    outfitName: 'Full 3-Piece Grand Agbada with Buba & Sokoto',
    gender: 'Men',
    recommendedYards: 10,
    yardRange: '8 - 10 Yards',
    suggestedFabrics: ['Atiku Cotton', 'Guinea Brocade (Bazin Riche)', 'Senator Cashmere'],
    description: 'Generous 10-yard cut provides ample fullness for royal drape and high-cap sleeve folds.'
  },
  {
    outfitName: 'Classic Senator Native Suit (Top & Trouser)',
    gender: 'Men',
    recommendedYards: 4,
    yardRange: '4 Yards',
    suggestedFabrics: ['Super 150s Wool Cashmere', 'Wool Blend Suiting'],
    description: 'Standard 4 yards allows full shirt length with chest pockets and tailored trouser cuts.'
  },
  {
    outfitName: 'Long Owambe Fitted Corset Gown with Train',
    gender: 'Women',
    recommendedYards: 5,
    yardRange: '5 - 6 Yards',
    suggestedFabrics: ['Swiss Voile Lace', 'French Beaded Net Lace', 'Sequined Lace'],
    description: '5 yards is the standard Nigerian bundle size for floor-length luxury gowns.'
  },
  {
    outfitName: 'Six-Piece Mermaid Skirt and Peplum Blouse',
    gender: 'Women',
    recommendedYards: 6,
    yardRange: '6 Yards (1 Bundle)',
    suggestedFabrics: ['Dutch Wax Ankara', 'African Wax Cotton'],
    description: 'Full 6-yard bundle allows perfect pattern alignment on flared panels and peplum pleats.'
  },
  {
    outfitName: 'Simple Kaftan / Short-Sleeve Daily Native',
    gender: 'General',
    recommendedYards: 3.5,
    yardRange: '3 - 3.5 Yards',
    suggestedFabrics: ['Cotton Atiku', 'Lightweight Senator Wool'],
    description: 'Ideal economic cut for casual weekday or Friday native shirts and trousers.'
  }
];

export const CUSTOMER_TESTIMONIALS: CustomerTestimonial[] = [
  {
    id: 'rev-01',
    customerName: 'Alhaja Kudirat Adeleke',
    location: 'Bodija, Ibadan',
    title: 'Aso-Ebi Lead Organizer',
    comment: 'We ordered 85 bundles of Swiss Voile Lace and matching shoe/bag sets for my daughter wedding. Everything arrived exactly as pictured and the quality was top tier. Our guests were thrilled!',
    rating: 5,
    date: '3 weeks ago',
    verifiedBuyer: true,
    fabricBought: 'Swiss Voile Lace & Matching Shoe/Bag Set'
  },
  {
    id: 'rev-02',
    customerName: 'Chief Babatunde Ogundimu',
    location: 'Victoria Island, Lagos',
    title: 'VIP Senator Client',
    comment: 'The Italian burnished loafers and Super 150s cashmere senator material were delivered promptly. The leather is soft, durable, and comfortable all day during chieftaincy meetings.',
    rating: 5,
    date: '1 month ago',
    verifiedBuyer: true,
    fabricBought: 'Super 150s Cashmere & Italian Loafers'
  },
  {
    id: 'rev-03',
    customerName: 'Mrs. Funmilayo Bakare',
    location: 'Garki, Abuja',
    title: 'Fashion Academy Director',
    comment: 'We purchased 6 industrial direct-drive sewing machines and Butterfly sets for our tailoring training institute. Smooth silent operation, fast delivery, and very responsive customer support on WhatsApp.',
    rating: 5,
    date: '2 months ago',
    verifiedBuyer: true,
    fabricBought: 'Industrial Direct-Drive Machines'
  }
];
