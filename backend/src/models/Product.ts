import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  images: string[];
  price: {
    amount: number;
    currency: string;
    originalPrice?: number;
  };
  category: string;
  subcategory: string;
  brand?: string;
  seller: mongoose.Types.ObjectId;
  specifications: {
    dimensions?: {
      width: number;
      height: number;
      depth: number;
      unit: string;
    };
    material: string[];
    color: string[];
    style: string[];
    weight?: number;
  };
  inventory: {
    quantity: number;
    sku: string;
    trackInventory: boolean;
  };
  shipping: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    freeShipping: boolean;
    shippingCost?: number;
  };
  seo: {
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
  };
  rating: {
    average: number;
    totalReviews: number;
  };
  tags: string[];
  variants: {
    name: string;
    options: {
      value: string;
      priceModifier?: number;
      sku?: string;
      quantity?: number;
      image?: string;
    }[];
  }[];
  featured: boolean;
  status: 'draft' | 'active' | 'inactive' | 'out-of-stock';
  sales: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  price: {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'EUR' },
    originalPrice: Number
  },
  category: { 
    type: String, 
    required: true,
    enum: ['mobilier', 'decoration', 'eclairage', 'textile', 'rangement', 'exterieur', 'materiaux', 'outils']
  },
  subcategory: { type: String, required: true },
  brand: String,
  seller: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  specifications: {
    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
      unit: { type: String, default: 'cm' }
    },
    material: [String],
    color: [String],
    style: [String],
    weight: Number
  },
  inventory: {
    quantity: { type: Number, required: true, min: 0 },
    sku: { type: String, required: true, unique: true },
    trackInventory: { type: Boolean, default: true }
  },
  shipping: {
    weight: { type: Number, required: true },
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: { type: Boolean, default: false },
    shippingCost: Number
  },
  seo: {
    slug: { type: String, required: true, unique: true },
    metaTitle: String,
    metaDescription: String
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 }
  },
  tags: [String],
  variants: [{
    name: { type: String, required: true },
    options: [{
      value: { type: String, required: true },
      priceModifier: { type: Number, default: 0 },
      sku: String,
      quantity: Number,
      image: String
    }]
  }],
  featured: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['draft', 'active', 'inactive', 'out-of-stock'], 
    default: 'draft' 
  },
  sales: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index pour la recherche et les performances
ProductSchema.index({ category: 1, subcategory: 1 });
ProductSchema.index({ seller: 1 });
ProductSchema.index({ 'seo.slug': 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ 'price.amount': 1 });
ProductSchema.index({ status: 1, featured: -1, createdAt: -1 });

// Index de recherche textuelle
ProductSchema.index({ 
  name: 'text', 
  description: 'text', 
  tags: 'text' 
});

// Middleware pour mettre à jour updatedAt
ProductSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IProduct>('Product', ProductSchema);
