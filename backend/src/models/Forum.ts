import mongoose, { Document, Schema } from 'mongoose';

export interface IForumPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  category: string;
  tags: string[];
  images?: string[];
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  solved: boolean;
  bestAnswer?: mongoose.Types.ObjectId;
  views: number;
  votes: {
    up: number;
    down: number;
  };
  status: 'active' | 'closed' | 'archived';
  isPinned: boolean;
  reports: {
    user: mongoose.Types.ObjectId;
    reason: string;
    description?: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IForumReply extends Document {
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  parentReply?: mongoose.Types.ObjectId;
  images?: string[];
  votes: {
    up: number;
    down: number;
  };
  isBestAnswer: boolean;
  isModerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ForumPostSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['decoration', 'renovation', 'jardinage', 'bricolage', 'architecture', 'general']
  },
  tags: [String],
  images: [String],
  attachments: [{
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true }
  }],
  solved: { type: Boolean, default: false },
  bestAnswer: { 
    type: Schema.Types.ObjectId, 
    ref: 'ForumReply' 
  },
  views: { type: Number, default: 0 },
  votes: {
    up: { type: Number, default: 0 },
    down: { type: Number, default: 0 }
  },
  status: { 
    type: String, 
    enum: ['active', 'closed', 'archived'], 
    default: 'active' 
  },
  reports: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String, enum: ['spam', 'inappropriate', 'offensive', 'other'], required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  isPinned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ForumReplySchema: Schema = new Schema({
  post: { 
    type: Schema.Types.ObjectId, 
    ref: 'ForumPost', 
    required: true 
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { type: String, required: true },
  parentReply: { 
    type: Schema.Types.ObjectId, 
    ref: 'ForumReply' 
  },
  images: [String],
  votes: {
    up: { type: Number, default: 0 },
    down: { type: Number, default: 0 }
  },
  isBestAnswer: { type: Boolean, default: false },
  isModerated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index pour les performances
ForumPostSchema.index({ category: 1, createdAt: -1 });
ForumPostSchema.index({ author: 1 });
ForumPostSchema.index({ tags: 1 });
ForumPostSchema.index({ status: 1, isPinned: -1, createdAt: -1 });

ForumReplySchema.index({ post: 1, createdAt: 1 });
ForumReplySchema.index({ author: 1 });
ForumReplySchema.index({ parentReply: 1 });

// Index de recherche textuelle
ForumPostSchema.index({ 
  title: 'text', 
  content: 'text',
  tags: 'text'
});

// Middleware pour mettre à jour updatedAt
ForumPostSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

ForumReplySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const ForumPost = mongoose.model<IForumPost>('ForumPost', ForumPostSchema);
export const ForumReply = mongoose.model<IForumReply>('ForumReply', ForumReplySchema);
