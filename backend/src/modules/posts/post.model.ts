import mongoose, { Document, Schema, Model } from 'mongoose';

export type PostStatus = 'Draft' | 'Published';

export interface IPost extends Document {
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  status: PostStatus;
  author?: {
    id: mongoose.Types.ObjectId;
    name: string;
  };
  views: number;
  readTime: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Main content is required'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Draft',
      index: true,
    },
    author: {
      id: { type: Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: 'Administrator' },
    },
    views: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: String,
      default: '3 min read',
    },
  },
  {
    timestamps: true,
  }
);

// Estimate read time before save if not provided
PostSchema.pre<IPost>('save', function () {
  if (this.content && (!this.readTime || this.isModified('content'))) {
    const wordCount = this.content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    this.readTime = `${minutes} min read`;
  }
});


export const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
