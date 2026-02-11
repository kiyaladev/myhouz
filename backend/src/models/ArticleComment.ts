import mongoose, { Document, Schema } from 'mongoose';

export interface IArticleComment extends Document {
  article: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  parentComment?: mongoose.Types.ObjectId;
  likes: number;
  isEdited: boolean;
  isModerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleCommentSchema: Schema = new Schema({
  article: { 
    type: Schema.Types.ObjectId, 
    ref: 'Article', 
    required: true 
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true,
    maxlength: 2000
  },
  parentComment: { 
    type: Schema.Types.ObjectId, 
    ref: 'ArticleComment' 
  },
  likes: { 
    type: Number, 
    default: 0 
  },
  isEdited: { 
    type: Boolean, 
    default: false 
  },
  isModerated: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index pour les performances
ArticleCommentSchema.index({ article: 1, createdAt: -1 });
ArticleCommentSchema.index({ author: 1 });
ArticleCommentSchema.index({ parentComment: 1 });

// Middleware pour mettre à jour updatedAt
ArticleCommentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IArticleComment>('ArticleComment', ArticleCommentSchema);
