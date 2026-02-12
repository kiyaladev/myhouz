import mongoose, { Document, Schema } from 'mongoose';

export interface IWishlistItem {
  product: mongoose.Types.ObjectId;
  addedAt: Date;
  note?: string;
}

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  items: IWishlistItem[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true, default: 'Ma liste de souhaits' },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    addedAt: { type: Date, default: Date.now },
    note: String
  }],
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index pour accéder rapidement aux wishlists d'un utilisateur
WishlistSchema.index({ user: 1 });
WishlistSchema.index({ user: 1, isDefault: 1 });

// Middleware pour mettre à jour updatedAt
WishlistSchema.pre('save', function(next: any) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IWishlist>('Wishlist', WishlistSchema);
