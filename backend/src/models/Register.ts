import mongoose, { Document, Schema } from 'mongoose';

export interface IRegister extends Document {
  name: string;
  seller: mongoose.Types.ObjectId;
  status: 'open' | 'closed';
  openedAt?: Date;
  closedAt?: Date;
  openingBalance: number;
  closingBalance?: number;
  salesCount: number;
  totalSales: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RegisterSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'closed'
  },
  openedAt: Date,
  closedAt: Date,
  openingBalance: { type: Number, default: 0, min: 0 },
  closingBalance: Number,
  salesCount: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

RegisterSchema.index({ seller: 1, status: 1 });
RegisterSchema.index({ seller: 1, createdAt: -1 });

RegisterSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IRegister>('Register', RegisterSchema);
