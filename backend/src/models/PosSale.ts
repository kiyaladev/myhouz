import mongoose, { Document, Schema } from 'mongoose';

export interface IPosSale extends Document {
  saleNumber: string;
  seller: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  totals: {
    subtotal: number;
    tax: number;
    taxRate: number;
    discount: number;
    total: number;
    currency: string;
  };
  payment: {
    method: 'cash' | 'card' | 'check' | 'mixed';
    cashReceived?: number;
    changeGiven?: number;
    cardReference?: string;
  };
  customer?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  notes?: string;
  status: 'completed' | 'refunded' | 'partial_refund';
  createdAt: Date;
  updatedAt: Date;
}

const PosSaleSchema: Schema = new Schema({
  saleNumber: {
    type: String,
    required: true,
    unique: true
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 }
  }],
  totals: {
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    taxRate: { type: Number, default: 0.20 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'EUR' }
  },
  payment: {
    method: {
      type: String,
      enum: ['cash', 'card', 'check', 'mixed'],
      required: true
    },
    cashReceived: Number,
    changeGiven: Number,
    cardReference: String
  },
  customer: {
    name: String,
    phone: String,
    email: String
  },
  notes: String,
  status: {
    type: String,
    enum: ['completed', 'refunded', 'partial_refund'],
    default: 'completed'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index pour les performances
PosSaleSchema.index({ seller: 1, createdAt: -1 });
PosSaleSchema.index({ status: 1 });
PosSaleSchema.index({ 'payment.method': 1 });

// Middleware pour mettre à jour updatedAt
PosSaleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IPosSale>('PosSale', PosSaleSchema);
