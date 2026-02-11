import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender?: mongoose.Types.ObjectId;
  type: 'message' | 'review' | 'order' | 'ideabook' | 'project' | 'system' | 'quote';
  title: string;
  content: string;
  link?: string;
  read: boolean;
  readAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  type: {
    type: String,
    enum: ['message', 'review', 'order', 'ideabook', 'project', 'system', 'quote'],
    required: true
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  link: { type: String },
  read: { type: Boolean, default: false },
  readAt: { type: Date },
  metadata: { type: Schema.Types.Mixed }
}, {
  timestamps: true
});

NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, type: 1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
