import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  reviewer: mongoose.Types.ObjectId;
  reviewedEntity: mongoose.Types.ObjectId;
  entityType: 'professional' | 'product';
  rating: {
    overall: number;
    quality?: number;
    communication?: number;
    deadlines?: number;
    value?: number;
  };
  title: string;
  comment: string;
  images?: string[];
  projectContext?: {
    projectType: string;
    budget: number;
    duration: number;
  };
  verified: boolean;
  helpful: {
    yes: number;
    no: number;
  };
  response?: {
    text: string;
    respondedAt: Date;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema({
  reviewer: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  reviewedEntity: { 
    type: Schema.Types.ObjectId, 
    required: true,
    refPath: 'entityType'
  },
  entityType: { 
    type: String, 
    enum: ['professional', 'product'], 
    required: true 
  },
  rating: {
    overall: { type: Number, required: true, min: 1, max: 5 },
    quality: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    deadlines: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 }
  },
  title: { type: String, required: true, trim: true },
  comment: { type: String, required: true },
  images: [String],
  projectContext: {
    projectType: String,
    budget: Number,
    duration: Number
  },
  verified: { type: Boolean, default: false },
  helpful: {
    yes: { type: Number, default: 0 },
    no: { type: Number, default: 0 }
  },
  response: {
    text: String,
    respondedAt: Date
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index pour les performances
ReviewSchema.index({ reviewedEntity: 1, entityType: 1 });
ReviewSchema.index({ reviewer: 1 });
ReviewSchema.index({ status: 1, createdAt: -1 });

// Index composé pour éviter les doublons
ReviewSchema.index({ reviewer: 1, reviewedEntity: 1, entityType: 1 }, { unique: true });

// Middleware pour mettre à jour updatedAt
ReviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IReview>('Review', ReviewSchema);
