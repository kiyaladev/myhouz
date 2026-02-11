import mongoose, { Document, Schema } from 'mongoose';

export interface IQuote extends Document {
  client: mongoose.Types.ObjectId;
  professional: mongoose.Types.ObjectId;
  projectDescription: string;
  category: string;
  budget?: string;
  timeline?: string;
  status: 'pending' | 'responded' | 'accepted' | 'declined';
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema = new Schema<IQuote>({
  client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  professional: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  projectDescription: { type: String, required: true, minlength: [20, 'La description du projet doit contenir au moins 20 caractères'] },
  category: { type: String, required: true },
  budget: { type: String },
  timeline: { type: String },
  status: { type: String, enum: ['pending', 'responded', 'accepted', 'declined'], default: 'pending' },
  response: { type: String },
}, { timestamps: true });

QuoteSchema.index({ client: 1, createdAt: -1 });
QuoteSchema.index({ professional: 1, status: 1 });

export default mongoose.model<IQuote>('Quote', QuoteSchema);
