import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  images: {
    url: string;
    caption?: string;
    tags: string[];
    products?: mongoose.Types.ObjectId[];
  }[];
  professional: mongoose.Types.ObjectId;
  category: string;
  room: string;
  style: string[];
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  location: {
    city: string;
    country: string;
  };
  tags: string[];
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  likes: number;
  views: number;
  saves: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  images: [{
    url: { type: String, required: true },
    caption: String,
    tags: [String],
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
  }],
  professional: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['renovation', 'decoration', 'construction', 'amenagement', 'jardin']
  },
  room: { 
    type: String, 
    required: true,
    enum: ['salon', 'cuisine', 'chambre', 'salle-de-bain', 'bureau', 'entree', 'exterieur', 'autre']
  },
  style: [{
    type: String,
    enum: ['moderne', 'classique', 'minimaliste', 'industriel', 'scandinave', 'boheme', 'rustique', 'contemporain']
  }],
  budget: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'EUR' }
  },
  location: {
    city: String,
    country: { type: String, default: 'France' }
  },
  tags: [String],
  featured: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft' 
  },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  saves: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index pour la recherche
ProjectSchema.index({ category: 1, room: 1, style: 1 });
ProjectSchema.index({ professional: 1 });
ProjectSchema.index({ tags: 1 });
ProjectSchema.index({ featured: -1, createdAt: -1 });

// Middleware pour mettre à jour updatedAt
ProjectSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IProject>('Project', ProjectSchema);
