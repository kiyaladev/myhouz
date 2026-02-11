import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: 'particulier' | 'professionnel';
  profileImage?: string;
  phone?: string;
  location?: {
    address: string;
    city: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  professionalInfo?: {
    companyName: string;
    businessNumber: string;
    services: string[];
    description: string;
    portfolio: string[];
    certifications: string[];
    workingZones: string[];
    pricing: {
      startingPrice?: number;
      currency: string;
    };
    subscription: {
      type: 'gratuit' | 'premium';
      expiresAt?: Date;
    };
    rating: {
      average: number;
      totalReviews: number;
    };
    verified: boolean;
  };
  socialAuth?: {
    googleId?: string;
    facebookId?: string;
  };
  preferences?: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
  };
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  userType: { 
    type: String, 
    enum: ['particulier', 'professionnel'], 
    required: true 
  },
  profileImage: { type: String },
  phone: { type: String },
  location: {
    address: String,
    city: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  professionalInfo: {
    companyName: String,
    businessNumber: String,
    services: [String],
    description: String,
    portfolio: [String],
    certifications: [String],
    workingZones: [String],
    pricing: {
      startingPrice: Number,
      currency: { type: String, default: 'EUR' }
    },
    subscription: {
      type: { type: String, enum: ['gratuit', 'premium'], default: 'gratuit' },
      expiresAt: Date
    },
    rating: {
      average: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 }
    },
    verified: { type: Boolean, default: false }
  },
  socialAuth: {
    googleId: String,
    facebookId: String
  },
  preferences: {
    newsletter: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true },
    language: { type: String, default: 'fr' }
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index pour la recherche géographique
UserSchema.index({ 'location.coordinates': '2dsphere' });

// Index pour la recherche de professionnels
UserSchema.index({ userType: 1, 'professionalInfo.services': 1 });

// Middleware pour mettre à jour updatedAt
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IUser>('User', UserSchema);
