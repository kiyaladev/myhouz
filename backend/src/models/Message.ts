import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  attachments?: {
    type: 'image' | 'document';
    url: string;
    name: string;
    size: number;
  }[];
  messageType: 'text' | 'project-quote' | 'system';
  metadata?: {
    quoteDetails?: {
      projectDescription: string;
      estimatedBudget: number;
      timeline: string;
      includes: string[];
    };
  };
  readBy: {
    user: mongoose.Types.ObjectId;
    readAt: Date;
  }[];
  edited: boolean;
  editedAt?: Date;
  createdAt: Date;
}

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  subject: string;
  lastMessage?: mongoose.Types.ObjectId;
  lastActivity: Date;
  projectContext?: {
    projectType: string;
    budget?: number;
    location?: string;
  };
  status: 'active' | 'archived' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema({
  conversation: { 
    type: Schema.Types.ObjectId, 
    ref: 'Conversation', 
    required: true 
  },
  sender: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { type: String, required: true },
  attachments: [{
    type: { 
      type: String, 
      enum: ['image', 'document'], 
      required: true 
    },
    url: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true }
  }],
  messageType: { 
    type: String, 
    enum: ['text', 'project-quote', 'system'], 
    default: 'text' 
  },
  metadata: {
    quoteDetails: {
      projectDescription: String,
      estimatedBudget: Number,
      timeline: String,
      includes: [String]
    }
  },
  readBy: [{
    user: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    readAt: { type: Date, default: Date.now }
  }],
  edited: { type: Boolean, default: false },
  editedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

const ConversationSchema: Schema = new Schema({
  participants: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }],
  subject: { type: String, required: true },
  lastMessage: { 
    type: Schema.Types.ObjectId, 
    ref: 'Message' 
  },
  lastActivity: { type: Date, default: Date.now },
  projectContext: {
    projectType: String,
    budget: Number,
    location: String
  },
  status: { 
    type: String, 
    enum: ['active', 'archived', 'closed'], 
    default: 'active' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index pour les performances
MessageSchema.index({ conversation: 1, createdAt: -1 });
MessageSchema.index({ sender: 1 });

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ lastActivity: -1 });
ConversationSchema.index({ status: 1 });

// Middleware pour mettre à jour updatedAt dans Conversation
ConversationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
