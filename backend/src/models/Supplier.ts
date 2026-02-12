import mongoose, { Document, Schema } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  contact: {
    email?: string;
    phone?: string;
    address?: string;
  };
  company?: string;
  siret?: string;
  categories: string[];
  notes?: string;
  seller: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SupplierSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  contact: {
    email: String,
    phone: String,
    address: String
  },
  company: String,
  siret: String,
  categories: [String],
  notes: String,
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

SupplierSchema.index({ seller: 1, createdAt: -1 });
SupplierSchema.index({ name: 'text', company: 'text' });

SupplierSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<ISupplier>('Supplier', SupplierSchema);
