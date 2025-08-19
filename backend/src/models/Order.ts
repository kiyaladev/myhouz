import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  customer: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    seller: mongoose.Types.ObjectId;
  }[];
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
    currency: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  payment: {
    method: 'card' | 'paypal' | 'transfer';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId?: string;
    paidAt?: Date;
  };
  shipping: {
    method: string;
    trackingNumber?: string;
    estimatedDelivery?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
  };
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  notes?: string;
  commission: {
    rate: number;
    amount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  customer: { 
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
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    seller: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }
  }],
  totals: {
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'EUR' }
  },
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: String,
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true }
  },
  billingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: String,
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true }
  },
  payment: {
    method: { 
      type: String, 
      enum: ['card', 'paypal', 'transfer'], 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'paid', 'failed', 'refunded'], 
      default: 'pending' 
    },
    transactionId: String,
    paidAt: Date
  },
  shipping: {
    method: { type: String, required: true },
    trackingNumber: String,
    estimatedDelivery: Date,
    shippedAt: Date,
    deliveredAt: Date
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'], 
    default: 'pending' 
  },
  notes: String,
  commission: {
    rate: { type: Number, required: true, min: 0, max: 1 },
    amount: { type: Number, required: true, min: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index pour les performances
OrderSchema.index({ customer: 1, createdAt: -1 });
OrderSchema.index({ 'items.seller': 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ 'payment.status': 1 });

// Middleware pour mettre à jour updatedAt
OrderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IOrder>('Order', OrderSchema);
