import mongoose, { Document, Schema } from 'mongoose';

export interface IIdeabook extends Document {
  name: string;
  description?: string;
  user: mongoose.Types.ObjectId;
  coverImage?: string;
  items: {
    type: 'project' | 'product' | 'professional' | 'article';
    itemId: mongoose.Types.ObjectId;
    note?: string;
    addedAt: Date;
  }[];
  collaborators: {
    user: mongoose.Types.ObjectId;
    permission: 'view' | 'comment' | 'edit';
    invitedAt: Date;
    acceptedAt?: Date;
  }[];
  isPublic: boolean;
  tags: string[];
  likes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const IdeabookSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  coverImage: String,
  items: [{
    type: { 
      type: String, 
      enum: ['project', 'product', 'professional', 'article'],
      required: true 
    },
    itemId: { 
      type: Schema.Types.ObjectId, 
      required: true,
      refPath: 'items.type'
    },
    note: String,
    addedAt: { type: Date, default: Date.now }
  }],
  collaborators: [{
    user: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    permission: { 
      type: String, 
      enum: ['view', 'comment', 'edit'], 
      default: 'view' 
    },
    invitedAt: { type: Date, default: Date.now },
    acceptedAt: Date
  }],
  isPublic: { type: Boolean, default: false },
  tags: [String],
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index pour les performances
IdeabookSchema.index({ user: 1 });
IdeabookSchema.index({ 'collaborators.user': 1 });
IdeabookSchema.index({ isPublic: 1, createdAt: -1 });
IdeabookSchema.index({ tags: 1 });

// Middleware pour mettre à jour updatedAt
IdeabookSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IIdeabook>('Ideabook', IdeabookSchema);
