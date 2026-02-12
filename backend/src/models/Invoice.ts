import mongoose, { Document, Schema } from 'mongoose';

export interface IInvoice extends Document {
  invoiceNumber: string;
  seller: mongoose.Types.ObjectId;
  sale?: mongoose.Types.ObjectId;
  customer: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    company?: string;
    siret?: string;
  };
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  totals: {
    subtotal: number;
    taxRate: number;
    tax: number;
    discount: number;
    total: number;
    currency: string;
  };
  payment: {
    method: 'cash' | 'card' | 'check' | 'transfer' | 'other';
    paid: boolean;
    paidAt?: Date;
    reference?: string;
  };
  notes?: string;
  dueDate?: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  sellerInfo: {
    companyName: string;
    address?: string;
    phone?: string;
    email?: string;
    siret?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema: Schema = new Schema({
  invoiceNumber: {
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
    name: { type: String, required: true },
    email: String,
    phone: String,
    address: String,
    company: String,
    siret: String
  },
  items: [{
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 }
  }],
  totals: {
    subtotal: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, default: 0.20 },
    tax: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'EUR' }
  },
  payment: {
    method: {
      type: String,
      enum: ['cash', 'card', 'check', 'transfer', 'other'],
      required: true
    },
    paid: { type: Boolean, default: false },
    paidAt: Date,
    reference: String
  },
  notes: String,
  dueDate: Date,
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  sellerInfo: {
    companyName: { type: String, required: true },
    address: String,
    phone: String,
    email: String,
    siret: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index pour les performances
InvoiceSchema.index({ seller: 1, createdAt: -1 });
InvoiceSchema.index({ status: 1 });

// Middleware pour mettre à jour updatedAt
InvoiceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);
