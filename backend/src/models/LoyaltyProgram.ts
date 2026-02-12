import mongoose, { Document, Schema } from 'mongoose';

export interface ILoyaltyProgram extends Document {
  seller: mongoose.Types.ObjectId;
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };
  points: number;
  totalPointsEarned: number;
  totalPointsSpent: number;
  history: {
    type: 'earn' | 'spend';
    points: number;
    description: string;
    sale?: mongoose.Types.ObjectId;
    date: Date;
  }[];
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  createdAt: Date;
  updatedAt: Date;
}

const LoyaltyProgramSchema: Schema = new Schema({
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customer: {
    name: { type: String, required: true },
    email: String,
    phone: String
  },
  points: { type: Number, default: 0, min: 0 },
  totalPointsEarned: { type: Number, default: 0, min: 0 },
  totalPointsSpent: { type: Number, default: 0, min: 0 },
  history: [{
    type: { type: String, enum: ['earn', 'spend'], required: true },
    points: { type: Number, required: true },
    description: { type: String, required: true },
    sale: { type: Schema.Types.ObjectId, ref: 'PosSale' },
    date: { type: Date, default: Date.now }
  }],
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

LoyaltyProgramSchema.index({ seller: 1, 'customer.phone': 1 });
LoyaltyProgramSchema.index({ seller: 1, 'customer.email': 1 });
LoyaltyProgramSchema.index({ seller: 1, tier: 1 });

LoyaltyProgramSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<ILoyaltyProgram>('LoyaltyProgram', LoyaltyProgramSchema);
