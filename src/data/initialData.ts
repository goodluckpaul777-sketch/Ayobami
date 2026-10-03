import { Category, FabricProduct, StoreSettings, SectionCategoryInfo, TailoringYardGuide, CustomerTestimonial } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-machines-irons', name: 'Tailoring Irons & Equipment', slug: 'tailoring-irons', mainSection: 'tailoring-machine', description: 'Heavy-duty tailor pressing irons and tools', itemCount: 1 },
  { id: 'cat-machines-industrial', name: 'Industrial Sewing Machines', slug: 'industrial-machines', mainSection: 'tailoring-machine', description: 'Direct drive industrial tailoring machines', itemCount: 2 },
  { id: 'cat-cloths-ankara', name: 'Ankara Prints', slug: 'ankara', mainSection: 'cloths', description: 'Original vibrant African wax prints', itemCount: 1 },
  { id: 'cat-cloths-lace', name: 'Swiss Voile Lace', slug: 'lace', mainSection: 'cloths', description: 'Luxury party and owambe lace fabrics', itemCount: 1 },
  { id: 'cat-cloths-senator', name: 'Senator Suiting', slug: 'senator', mainSection: 'cloths', description: 'Super 150s wool cashmere suitings', itemCount: 1 },
  { id: 'cat-shoes-loafers', name: 'Men Loafers', slug: 'loafers', mainSection: 'shoes', description: 'Handcrafted genuine leather loafers', itemCount: 1 },
  { id: 'cat-shoes-matching-sets', name: 'Matching Shoe & Bag Sets', slug: 'matching-sets', mainSection: 'shoes', description: 'Coordinated 2-in-1 party sets', itemCount: 1 },
];

export const INITIAL_PRODUCTS: FabricProduct[] = [
  // --- TAILORING MACHINES & EQUIPMENT (PEACOCK IRON & WORKSHOP GEAR) ---
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
    colors: ['Original Silver Cast Metal'],
    fabricType: 'Heavy-Duty Solid Cast Metal Pressing Iron',
    isNewArrival: true,
    isFeatured: true,
    inStock: true,
    rating: 5.0,
    reviewCount: 48,
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
  },
  {
    id: 'prod-industrial-direct-drive',
    name: 'Industrial Direct-Drive Lockstitch Sewing Machine',
    mainSection: 'tailoring-machine',
    category: 'Industrial Sewing Machines',
    categorySlug: 'industrial-machines',
    description: 'High-speed commercial lockstitch tailoring machine with energy-saving direct-drive servo motor, automatic needle positioning, built-in LED needle illumination, and whisper-quiet operation. Built for continuous production on senator materials, denim, lace, and heavy textiles.',
    availableStock: 12,
    minimumOrder: 1,
    unitLabel: 'machine',
    image: 'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Industrial White / Blue'],
    fabricType: 'Heavy Duty Commercial Grade Direct-Drive System',
    isNewArrival: true,
    isFeatured: true,
    inStock: true,
    rating: 4.9,
    reviewCount: 35,
    suitableFor: [
      'Commercial Tailoring Workshops',
      'Senator Suits & Trouser Making',
      'Heavy Fabric Seaming',
      'High-Speed Garment Production'
    ],
    textureNote: 'Direct-drive servo motor with adjustable digital speed controls up to 5,000 RPM.',
    origin: 'Commercial Import',
    isWholesaleAvailable: true,
    wholesaleNote: 'Complete with stand, table, and accessories pack. Direct workshop delivery.',
    badge: 'Workshop Standard'
  },
  {
    id: 'prod-overlock-weaving',
    name: 'Heavy-Duty 4-Thread Overlock Weaving Machine',
    mainSection: 'tailoring-machine',
    category: 'Industrial Sewing Machines',
    categorySlug: 'industrial-machines',
    description: 'Professional high-speed 4-thread overlock interlock weaving machine. Delivers clean, fray-proof edge finishing for native attires, knitwear, silks, and tailored trousers. Includes built-in trim knife and smooth differential feed.',
    availableStock: 8,
    minimumOrder: 1,
    unitLabel: 'machine',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Industrial White'],
    fabricType: 'High-Speed 4-Thread Differential Feed Overlocker',
    isNewArrival: false,
    isFeatured: false,
    inStock: true,
    rating: 4.8,
    reviewCount: 22,
    suitableFor: [
      'Fray Prevention & Edge Weaving',
      'Lace Finishing & Seam Neatening',
      'Native Agbada Sleeve Edging',
      'Boutique Quality Garments'
    ],
    origin: 'Commercial Import',
    isWholesaleAvailable: true,
    wholesaleNote: 'Discount available when paired with direct-drive machine bundle.',
    badge: 'Overlock Pro'
  },

  // --- CLOTHS & FABRICS (AUTHENTIC NIGERIAN & IMPORTED TEXTILES) ---
  {
    id: 'prod-ankara-supreme',
    name: 'Supreme Dutch Wax Ankara (6 Yards)',
    mainSection: 'cloths',
    category: 'Ankara Prints',
    categorySlug: 'ankara',
    description: '100% premium grade cotton authentic African wax print with vivid bilateral color saturation, non-fading dyes, and smooth soft-touch finish. Perfect for regal Owambe styles, couples matching native sets, and modern African luxury fashion.',
    availableStock: 65,
    minimumOrder: 1,
    unitLabel: 'piece (6 yards)',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Royal Gold & Emerald', 'Navy & Coral Red', 'Wine & Mustard'],
    fabricType: '100% Combed Cotton Real Dutch Wax',
    isNewArrival: true,
    isFeatured: true,
    inStock: true,
    rating: 4.9,
    reviewCount: 54,
    suitableFor: [
      'Aso-Ebi Wedding Uniforms',
      'Kaftans & Modern Buba Fashions',
      'Matching Couples Outfits',
      'Formal & Festive Events'
    ],
    textureNote: 'Double-sided crisp wax print that softens beautifully after first wash.',
    origin: 'Authentic Holland Real Wax',
    isWholesaleAvailable: true,
    wholesaleNote: 'Aso-Ebi bundle discounts available for 10+ pieces. Custom packaging on demand.',
    badge: 'Best Seller'
  },
  {
    id: 'prod-swiss-voile-lace',
    name: 'Luxury Swiss Voile Lace (5 Yards)',
    mainSection: 'cloths',
    category: 'Swiss Voile Lace',
    categorySlug: 'lace',
    description: 'Intricately embroidered pure Swiss voile lace with shimmering metallic accents and scallop borders. Renowned for its breathable cotton base, royal texture, and exquisite drape for chieftaincy titles, high-profile weddings, and anniversary ceremonies.',
    availableStock: 40,
    minimumOrder: 1,
    unitLabel: 'piece (5 yards)',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Champagne Gold', 'Ice White', 'Royal Lilac', 'Powder Blue'],
    fabricType: 'Pure Swiss Voile Cotton Base with Fine Threadwork',
    isNewArrival: true,
    isFeatured: true,
    inStock: true,
    rating: 5.0,
    reviewCount: 41,
    suitableFor: [
      'Bride & Mother of the Day Attire',
      'Royal Chieftaincy Iro & Buba',
      'Owambe VIP Fashion',
      'Milestone Celebrations'
    ],
    origin: 'Direct St. Gallen Switzerland',
    isWholesaleAvailable: true,
    wholesaleNote: 'Full bundle cuts available with matching headties on request.',
    badge: 'Luxury Voile'
  },
  {
    id: 'prod-cashmere-senator',
    name: 'Super 150s Wool Cashmere Senator Material (4 Yards)',
    mainSection: 'cloths',
    category: 'Senator Suiting',
    categorySlug: 'senator',
    description: 'Supreme Super 150s wool-blended cashmere suiting material with a lustrous matte sheen and non-creasing drape. The standard choice for discerning Nigerian gentlemen seeking commanding Senator outfits, corporate native suits, and sharp Safari styles.',
    availableStock: 50,
    minimumOrder: 1,
    unitLabel: 'piece (4 yards)',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Midnight Charcoal', 'Navy Blue', 'Forest Green', 'Burgundy Wine'],
    fabricType: 'Super 150s Wool Cashmere Blend',
    isNewArrival: false,
    isFeatured: true,
    inStock: true,
    rating: 4.9,
    reviewCount: 62,
    suitableFor: [
      'Bespoke Senator Native Suits',
      'Executive Safari Suits',
      'Corporate Native Fridays',
      'Traditional Groomsmen Ensembles'
    ],
    origin: 'Imported Suiting Mill',
    isWholesaleAvailable: true,
    wholesaleNote: 'Full rolls available for uniform corporate tailoring orders.',
    badge: 'Gentleman Standard'
  },

  // --- SHOES, BAGS & MATCHING SETS ---
  {
    id: 'prod-italian-loafers',
    name: 'Handcrafted Italian Native Leather Loafers',
    mainSection: 'shoes',
    category: 'Men Loafers',
    categorySlug: 'loafers',
    description: 'Bespoke hand-burnished genuine Italian calfskin loafers with cushioned ergonomic memory-foam insole and durable leather outer sole. Custom designed to complement Senator outfits, Agbada trousers, and smart-casual natives.',
    availableStock: 28,
    minimumOrder: 1,
    unitLabel: 'pair',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Cognac Tan', 'Classic Black', 'Espresso Brown'],
    fabricType: 'Full Grain Genuine Italian Leather',
    isNewArrival: true,
    isFeatured: true,
    inStock: true,
    rating: 5.0,
    reviewCount: 39,
    suitableFor: [
      'Senator Native Suits & Trousers',
      'Agbada Occasions',
      'Wedding Grooms & Guests',
      'Executive Business Casual'
    ],
    origin: 'Italian Leather Craftsmanship',
    isWholesaleAvailable: true,
    wholesaleNote: 'Size ranges 40 to 46 available. Custom shoe boxes provided.',
    badge: 'Handmade Luxury'
  },
  {
    id: 'prod-matching-set-emerald',
    name: 'Luxury 2-in-1 Matching Shoe & Clutch Bag Set',
    mainSection: 'shoes',
    category: 'Matching Shoe & Bag Sets',
    categorySlug: 'matching-sets',
    description: 'Coordinated Italian-inspired occasion heels with matching structured jewel-clasp clutch bag. Engineered with comfortable block heels, shimmering crystal trim, and detachable shoulder chain for effortless Owambe elegance.',
    availableStock: 20,
    minimumOrder: 1,
    unitLabel: 'set (shoes + bag)',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Champagne Gold', 'Royal Emerald Green', 'Silver Shimmer'],
    fabricType: 'Coordinated Shimmer Textile with Metallic Leather Accents',
    isNewArrival: true,
    isFeatured: true,
    inStock: true,
    rating: 4.9,
    reviewCount: 29,
    isMatchingSet: true,
    suitableFor: [
      'Owambe Weddings & Receptions',
      'Aso-Ebi Guest Attire',
      'Church Milestones & Anniversaries',
      'Evening Banquets'
    ],
    origin: 'Imported Luxury Footwear',
    isWholesaleAvailable: true,
    wholesaleNote: 'Complete boxed sets. Wholesale carton assortments available.',
    badge: '2-in-1 Set'
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
