require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const products = [
  {
    name: 'Soft Cotton Onesie Set (3-Pack)',
    slug: 'soft-cotton-onesie-set-3-pack',
    description: 'Ultra-soft 100% organic cotton onesies perfect for newborns. Snap closures for easy diaper changes. Available in pastel colors.',
    price: 1299, originalPrice: 1799, category: 'clothing',
    images: ['https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600'],
    stock: 50, rating: 4.8, reviewCount: 124, isFeatured: true, ageRange: '0-12 months',
    tags: ['newborn', 'cotton', 'onesie'],
  },
  {
    name: 'Premium Baby Diaper Bag Backpack',
    slug: 'premium-baby-diaper-bag-backpack',
    description: 'Large capacity, waterproof diaper bag with 16 pockets, insulated bottle holders, and changing mat included.',
    price: 3499, originalPrice: 4999, category: 'accessories',
    images: ['https://images.unsplash.com/photo-1584811644165-33078f50eb15?w=600'],
    stock: 30, rating: 4.9, reviewCount: 89, isFeatured: true, ageRange: '0-3 years',
    tags: ['diaper bag', 'backpack', 'travel'],
  },
  {
    name: 'Gentle Baby Shampoo & Wash',
    slug: 'gentle-baby-shampoo-wash',
    description: 'Tear-free, hypoallergenic 2-in-1 shampoo and body wash. Dermatologist tested, free from parabens and sulfates.',
    price: 599, originalPrice: 799, category: 'skincare',
    images: ['https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600'],
    stock: 100, rating: 4.7, reviewCount: 212, isFeatured: true, ageRange: '0-5 years',
    tags: ['shampoo', 'tear-free', 'organic'],
  },
  {
    name: 'Muslin Swaddle Blankets (4-Pack)',
    slug: 'muslin-swaddle-blankets-4-pack',
    description: 'Breathable muslin cotton swaddle blankets. Large 47x47 inches, gets softer with every wash. Perfect for swaddling, nursing, and tummy time.',
    price: 1899, originalPrice: 2500, category: 'clothing',
    images: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600'],
    stock: 45, rating: 4.9, reviewCount: 178, isFeatured: false, ageRange: '0-12 months',
    tags: ['swaddle', 'muslin', 'blanket'],
  },
  {
    name: 'Baby Monitor with Night Vision',
    slug: 'baby-monitor-night-vision',
    description: 'HD video baby monitor with 3.5" display, night vision, two-way audio, temperature sensor, and lullabies. Range up to 300m.',
    price: 8999, originalPrice: 12000, category: 'safety',
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600'],
    stock: 20, rating: 4.6, reviewCount: 67, isFeatured: true, ageRange: '0-3 years',
    tags: ['monitor', 'safety', 'night vision'],
  },
  {
    name: 'Stacking Rainbow Toy',
    slug: 'stacking-rainbow-toy',
    description: 'Classic wooden stacking rainbow toy in vibrant, non-toxic colors. Develops fine motor skills and color recognition. Montessori inspired.',
    price: 999, originalPrice: 1400, category: 'toys',
    images: ['https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600'],
    stock: 60, rating: 4.8, reviewCount: 145, isFeatured: true, ageRange: '6-36 months',
    tags: ['wooden toy', 'stacking', 'montessori'],
  },
  {
    name: 'Anti-Colic Baby Bottle Set',
    slug: 'anti-colic-baby-bottle-set',
    description: 'Set of 3 anti-colic baby bottles with slow-flow nipples. BPA free, dishwasher safe. Reduces gas, colic, and spit-up.',
    price: 1599, originalPrice: 2100, category: 'feeding',
    images: ['https://images.unsplash.com/photo-1559526323-cb2f2fe2591b?w=600'],
    stock: 80, rating: 4.7, reviewCount: 203, isFeatured: false, ageRange: '0-12 months',
    tags: ['bottle', 'anti-colic', 'feeding'],
  },
  {
    name: 'Newborn Diaper Pants (Size S - 50 pcs)',
    slug: 'newborn-diaper-pants-size-s',
    description: 'Ultra-absorbent diaper pants with soft waistband. 12-hour protection, wetness indicator, and breathable cover for sensitive skin.',
    price: 849, originalPrice: 999, category: 'diapers',
    images: ['https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600'],
    stock: 200, rating: 4.5, reviewCount: 312, isFeatured: false, ageRange: '0-3 months',
    tags: ['diaper', 'newborn', 'pants'],
  },
  {
    name: 'Baby Nail Trimmer Electric',
    slug: 'baby-nail-trimmer-electric',
    description: 'Safe electric nail trimmer with LED light and 6 grinding pads. Whisper-quiet motor, perfect for trimming tiny nails without fear.',
    price: 1199, originalPrice: 1599, category: 'accessories',
    images: ['https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=600'],
    stock: 40, rating: 4.8, reviewCount: 98, isFeatured: false, ageRange: '0-5 years',
    tags: ['nail trimmer', 'electric', 'grooming'],
  },
  {
    name: 'Portable Baby Sound Machine',
    slug: 'portable-baby-sound-machine',
    description: '20 soothing sounds including white noise, lullabies, and nature sounds. USB rechargeable, 36 hours battery life, night light included.',
    price: 2299, originalPrice: 2999, category: 'nursery',
    images: ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600'],
    stock: 35, rating: 4.9, reviewCount: 156, isFeatured: true, ageRange: '0-5 years',
    tags: ['sound machine', 'sleep', 'white noise'],
  },
  {
    name: 'Baby Food Maker & Steamer',
    slug: 'baby-food-maker-steamer',
    description: 'All-in-one baby food maker that steams and blends. BPA-free, 400W, makes fresh purees in minutes. Easy to clean.',
    price: 5499, originalPrice: 7500, category: 'feeding',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'],
    stock: 25, rating: 4.6, reviewCount: 74, isFeatured: false, ageRange: '4-24 months',
    tags: ['food maker', 'steamer', 'puree'],
  },
  {
    name: 'Foam Play Mat (Extra Large)',
    slug: 'foam-play-mat-extra-large',
    description: '78"x78" extra-large foam play mat. Non-toxic, waterproof, double-sided design. Provides safe cushioned surface for tummy time and play.',
    price: 3299, originalPrice: 4500, category: 'nursery',
    images: ['https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=600'],
    stock: 15, rating: 4.7, reviewCount: 91, isFeatured: true, ageRange: '0-4 years',
    tags: ['play mat', 'foam', 'tummy time'],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({ role: 'admin' });

    // Create admin user
    const admin = await User.create({
      name: 'Baby Mart Admin',
      email: 'admin@babymart.pk',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`👤 Admin created: ${admin.email} / password: admin123`);

    // Seed products
    await Product.insertMany(products);
    console.log(`🧸 ${products.length} products seeded`);

    console.log('\n🎉 Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
