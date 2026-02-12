import mongoose, { Document, Schema } from 'mongoose';

export interface IProductReturn extends Document {
  returnNumber: string;
  seller: mongoose.Types.ObjectId;
  sale?: mongoose.Types.ObjectId;
  customer?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  items: {
    product: mongoose.Types.ObjectId;
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    total: number;
    reason: string;
  }[];
  totals: {
    subtotal: number;
    tax: number;
    total: number;
    currency: string;
  };
  resolution: 'refund' | 'exchange' | 'credit';
  creditAmount?: number;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductReturnSchema: Schema = new Schema({
  returnNumber: {
    type: String,
    required: true,
    unique: true
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sale: {
    type: Schema.Types.ObjectId,
    ref: 'PosSale'
  },
  customer: {
    name: String,
    phone: String,
    email: String
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
    total: { type: Number, required: true, min: 0 },
    reason: { type: String, required: true }
  }],
  totals: {
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'EUR' }
  },
  resolution: {
    type: String,
    enum: ['refund', 'exchange', 'credit'],
    required: true
  },
  creditAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed', 'rejected'],
    default: 'pending'
  },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ProductReturnSchema.index({ seller: 1, createdAt: -1 });
ProductReturnSchema.index({ status: 1 });
ProductReturnSchema.index({ sale: 1 });

ProductReturnSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IProductReturn>('ProductReturn', ProductReturnSchema);
