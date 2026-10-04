import { Product, CustomerReview, CategoryInfo } from '../types';

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

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-ankara-01",
    name: "Original Hollandais Wax Ankara — Royal Peacock Motif",
    category: "ankara",
    categoryLabel: "Ankara Prints",
    price: 38500,
    originalPrice: 45000,
    unit: "per 6 yards piece",
    rating: 4.9,
    reviewsCount: 42,
    description: "100% premium combed cotton African wax print with dual-side rich color penetration. Vibrant peacock and botanical geometry, soft texture that softens further after washing. Ideal for Aso-Ebi, gowns, and traditional ceremonies.",
    features: [
      "100% Premium Cotton",
      "6 Full Yards guaranteed length",
      "Vibrant fade-resistant vegetable dyes",
      "Dual-sided clear pattern print"
    ],
    inStock: true,
    stockCount: 28,
    isFeatured: true,
    isBestSeller: true,
    sku: "ANK-HOL-01",
    material: "Combed Pure Cotton Wax",
    colors: ["Royal Blue & Gold", "Teal & Emerald", "Wine & Marigold"],
    wholesalePrice: 34000,
    wholesaleMinYards: 30,
    images: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "prod-lace-01",
    name: "French Beaded Cord Lace — Champagne Blossom",
    category: "lace",
    categoryLabel: "Luxury Lace",
    price: 75000,
    originalPrice: 85000,
    unit: "per 5 yards bundle",
    rating: 5.0,
    reviewsCount: 29,
    description: "Heavyweight French cordonnet embroidery adorned with light-catching cut-glass seed beads, pearls, and metallic cord filigree. The ultimate fabric for brides, mummies-of-the-day, and prestigious owambe outings.",
    features: [
      "Hand-embellished crystal beads and pearls",
      "5 Full Yards continuous length",
      "Heavy scalloped borders on both selvages",
      "Supple mesh netting that drapes gracefully"
    ],
    inStock: true,
    stockCount: 15,
    isFeatured: true,
    isBestSeller: true,
    sku: "LAC-FR-007",
    material: "Polyester Cord with Beaded Embellishments",
    colors: ["Champagne Gold", "Blush Pink", "Royal Lilac", "Emerald Green"],
    wholesalePrice: 68000,
    wholesaleMinYards: 25,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "prod-senator-01",
    name: "Superfine Italian Wool Senator Fabric — Midnight Charcoal",
    category: "senator-atiku",
    categoryLabel: "Senator & Atiku",
    price: 32000,
    originalPrice: 38000,
    unit: "per 4 yards (1 complete Kaftan set)",
    rating: 4.8,
    reviewsCount: 35,
    description: "Wrinkle-resistant Italian blend wool with smooth matte drape and subtle micro-twill weave. Holds razor-sharp chest and sleeve creases throughout long event days.",
    features: [
      "High-twist anti-crease yarn",
      "4 Yards standard executive cut",
      "Breathable year-round weave",
      "Machine and hand washable"
    ],
    inStock: true,
    stockCount: 20,
    isFeatured: true,
    isNewArrival: true,
    sku: "SEN-ITL-102",
    material: "Italian Worsted Wool Blend",
    colors: ["Midnight Charcoal", "Navy Sapphire", "Deep Burgundy", "Executive Black"],
    wholesalePrice: 28500,
    wholesaleMinYards: 20,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "prod-sewing-01",
    name: "Direct Drive Industrial Sewing Machine with Auto Thread Trimmer",
    category: "sewing-machines",
    categoryLabel: "Sewing Machines & Equipment",
    price: 380000,
    originalPrice: 420000,
    unit: "complete set with table, stand & servo motor",
    rating: 4.9,
    reviewsCount: 19,
    description: "Heavy-duty smart industrial lockstitch sewing machine with built-in energy saving servo motor (saves up to 70% electricity, generator-friendly). Features automatic needle positioning, auto thread trimmer, and LED workspace lighting.",
    features: [
      "Integrated 550W Silent Direct Drive Servo Motor",
      "Automatic thread trimming and reverse feed",
      "Adjustable speed up to 5,000 stitches per minute",
      "Complete assembly including stand and laminated tabletop"
    ],
    inStock: true,
    stockCount: 8,
    isFeatured: true,
    isBestSeller: true,
    sku: "MC-IND-501",
    material: "Heavy Cast Iron & Precision Steel Gears",
    images: [
      "https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "prod-sewing-02",
    name: "Industrial Heavy Duty Gravity Feed Steam Iron (Silver Star / Peacock Style)",
    category: "sewing-machines",
    categoryLabel: "Sewing Machines & Equipment",
    price: 52000,
    originalPrice: 60000,
    unit: "complete kit with water bottle & teflon shoe",
    rating: 4.9,
    reviewsCount: 38,
    description: "Professional tailor steam iron kit with 4-liter hanging gravity water tank, silicone hose, heat-proof resting pad, and non-stick teflon protective shoe to prevent fabric scorching on delicate lace and silks.",
    features: [
      "1000W high-efficiency heating base",
      "4 Litre overhead gravity water reservoir",
      "Includes non-shine teflon shoe",
      "Heavy pressing weight for sharp lapels & hems"
    ],
    inStock: true,
    stockCount: 15,
    isFeatured: false,
    isBestSeller: true,
    sku: "IRN-GV-09",
    material: "Anodized Aluminum Base & Heat-Resistant Thermoplastic",
    images: [
      "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "prod-ankara-02",
    name: "Exclusive High Target Wax Ankara — Sunburst Mandala",
    category: "ankara",
    categoryLabel: "Ankara Prints",
    price: 24500,
    originalPrice: 28000,
    unit: "per 6 yards piece",
    rating: 4.7,
    reviewsCount: 22,
    description: "Crisp finish wax block print with striking solar mandala motifs. Beautiful contrasting tones ideal for church ensembles, casual blazers, headwraps, and matching couple outfits.",
    features: [
      "High-density cotton weave",
      "6 Yards full cut",
      "Bright colors on both faces",
      "Pre-shrunk fabric base"
    ],
    inStock: true,
    stockCount: 14,
    isFeatured: false,
    isNewArrival: true,
    sku: "ANK-HT-045",
    material: "Cotton Blend Wax Print",
    colors: ["Fiery Orange & Indigo", "Yellow & Forest Green"],
    images: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "prod-lace-02",
    name: "Swiss Voile Dry Cotton Lace — Geometric Filigree",
    category: "lace",
    categoryLabel: "Luxury Lace",
    price: 62000,
    originalPrice: 70000,
    unit: "per 5 yards bundle",
    rating: 4.9,
    reviewsCount: 16,
    description: "Original Swiss 100% fine cotton voile base with clean open-work eyelet embroidery. Cool on the skin in hot climates, light yet substantial.",
    features: [
      "100% pure Egyptian cotton voile",
      "5 Yards piece",
      "Cool & breathable under tropical sun",
      "Smooth skin touch"
    ],
    inStock: true,
    stockCount: 11,
    isFeatured: false,
    sku: "LAC-SW-088",
    material: "Swiss Cotton Voile",
    colors: ["Snow White", "Ivory Cream", "Sky Blue", "Mint Green"],
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "prod-atiku-01",
    name: "Authentic Austrian Guinea Brocade / Atiku Fabric",
    category: "senator-atiku",
    categoryLabel: "Senator & Atiku",
    price: 58000,
    originalPrice: 65000,
    unit: "per 10 yards bundle",
    rating: 5.0,
    reviewsCount: 31,
    description: "Original high-luster Austrian cotton brocade (Bazin Riche / Getzner grade). Shimmering jacquard damask finish with crisp sound and majestic body for executive traditional wear.",
    features: [
      "100% High-grade lustered combed cotton",
      "10 Yards full standard bundle",
      "Permanent silky sheen",
      "Unmatched structural crispness"
    ],
    inStock: true,
    stockCount: 12,
    isFeatured: true,
    sku: "ATK-AUS-001",
    material: "100% Pure Combed Damask Cotton",
    colors: ["Pure White Shimmer", "Jet Black", "Light Gold", "Silver Grey"],
    wholesalePrice: 52000,
    wholesaleMinYards: 50,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "prod-acc-01",
    name: "Italian Leather Crystal Embellished Party Shoes & Matching Handbag Set",
    category: "accessories",
    categoryLabel: "Shoes, Bags & Accessories",
    price: 48000,
    originalPrice: 55000,
    unit: "set (Shoes + Matching Evening Bag)",
    rating: 4.9,
    reviewsCount: 27,
    description: "Stunning Italian pointed-toe slingback heels with ergonomic cushioned insole and matching rhinestone evening clutch. Built for weddings, coronations, and owambe parties.",
    features: [
      "Heel height: 3.5 inches comfortable stiletto",
      "Matching evening clutch bag with chain strap",
      "Heavy crystal brooch centerpiece",
      "Sizes EU 38 to 43 available"
    ],
    inStock: true,
    stockCount: 8,
    isFeatured: true,
    isBestSeller: true,
    sku: "ACC-SHB-77",
    material: "Italian Synthetic Leather & Crystal Brooch",
    colors: ["Rose Gold", "Royal Silver", "Emerald Green", "Wine Red"],
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "prod-sewing-03",
    name: "4-Thread Industrial Overlock / Interlocking Machine",
    category: "sewing-machines",
    categoryLabel: "Sewing Machines & Equipment",
    price: 295000,
    originalPrice: 330000,
    unit: "complete set with table & motor",
    rating: 4.8,
    reviewsCount: 14,
    description: "High-speed 4-thread overlock serger machine for clean seam edges, knitwear, and tailoring fabric reinforcement. Prevents fabric fraying on Ankara, wool, and lace.",
    features: [
      "Dual needle 4-thread chainstitch",
      "Differential feed ratio 0.7 - 2.0",
      "Ultra-quiet built-in servo motor",
      "Needle thread cooler"
    ],
    inStock: true,
    stockCount: 5,
    sku: "MC-OVK-402",
    material: "Industrial Alloy & Cast Metal",
    images: [
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=800&q=80"
    ]
  }
];

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
