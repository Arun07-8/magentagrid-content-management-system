import mongoose, { Document, Schema } from 'mongoose';

export type PageStatus = 'Draft' | 'Published';

export interface IPageSectionMeta {
  id: string;
  type: string;
  name: string;
  isEnabled: boolean;
}

export interface IPageSEO {
  metaTitle?: string;
  metaDescription?: string;
}

export interface IPage extends Document {
  slug: string;
  title: string;
  status: PageStatus;
  isSystem: boolean;
  seo?: IPageSEO;
  sectionOrder: IPageSectionMeta[];
  sections: Record<string, any>;
  updatedBy?: {
    id: mongoose.Types.ObjectId;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const pageSchema = new Schema<IPage>(
  {
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Page title is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Published',
      index: true,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
    },
    sectionOrder: {
      type: [
        {
          id: { type: String, required: true },
          type: { type: String, required: true },
          name: { type: String, required: true },
          isEnabled: { type: Boolean, default: true },
        },
      ],
      default: [],
    },
    sections: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
    updatedBy: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      name: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const PageModel = mongoose.model<IPage>('Page', pageSchema);

