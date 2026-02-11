import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  addedAt: Date;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
  currency: string;
  updatedAt: Date;
  createdAt: Date;
}

const CartItemSchema: Schema = new Schema({
  product: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1, 
    default: 1 
  },
  price: { 
    type: Number, 
    required: true 
  },
  addedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const CartSchema: Schema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  items: [CartItemSchema],
  totalAmount: { 
    type: Number, 
    default: 0 
  },
  currency: { 
    type: String, 
    default: 'EUR' 
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

// Index pour la recherche par utilisateur
CartSchema.index({ user: 1 });

// Méthode pour calculer le total
CartSchema.methods.calculateTotal = function(): number {
  this.totalAmount = this.items.reduce((total: number, item: ICartItem) => {
    return total + (item.price * item.quantity);
  }, 0);
  return this.totalAmount;
};

// Middleware pour mettre à jour updatedAt et recalculer le total
CartSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  // Calculer le total
  const items = this.items as ICartItem[];
  this.totalAmount = items.reduce((total: number, item: ICartItem) => {
    return total + (item.price * item.quantity);
  }, 0);
  next();
});

export default mongoose.model<ICart>('Cart', CartSchema);
