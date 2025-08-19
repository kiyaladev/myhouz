import mongoose, { Document, Schema } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: mongoose.Types.ObjectId;
  featuredImage: string;
  gallery?: string[];
  category: string;
  tags: string[];
  relatedProducts?: mongoose.Types.ObjectId[];
  relatedProfessionals?: mongoose.Types.ObjectId[];
  relatedProjects?: mongoose.Types.ObjectId[];
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  publishedAt?: Date;
  views: number;
  likes: number;
  shares: number;
  estimatedReadTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  featuredImage: { type: String, required: true },
  gallery: [String],
  category: { 
    type: String, 
    required: true,
    enum: ['conseils', 'tendances', 'guides', 'interviews', 'actualites', 'diy']
  },
  tags: [String],
  relatedProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  relatedProfessionals: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  relatedProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft' 
  },
  featured: { type: Boolean, default: false },
  publishedAt: Date,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  estimatedReadTime: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index pour les performances
ArticleSchema.index({ slug: 1 });
ArticleSchema.index({ category: 1, status: 1 });
ArticleSchema.index({ author: 1 });
ArticleSchema.index({ tags: 1 });
ArticleSchema.index({ status: 1, featured: -1, publishedAt: -1 });

// Index de recherche textuelle
ArticleSchema.index({ 
  title: 'text', 
  excerpt: 'text', 
  content: 'text',
  tags: 'text'
});

// Middleware pour mettre à jour updatedAt
ArticleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IArticle>('Article', ArticleSchema);
