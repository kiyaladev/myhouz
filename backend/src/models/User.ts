import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  nom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
  role: 'client' | 'agent' | 'admin';
  dateCreation: Date;
  dateModification: Date;
}

const UserSchema: Schema = new Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez entrer un email valide']
  },
  motDePasse: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  },
  telephone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['client', 'agent', 'admin'],
    default: 'client'
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateModification: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour optimiser les recherches
UserSchema.index({ email: 1 });

// Middleware pour mettre à jour dateModification
UserSchema.pre('save', function(next) {
  this.dateModification = new Date();
  next();
});

export default mongoose.model<IUser>('User', UserSchema);
