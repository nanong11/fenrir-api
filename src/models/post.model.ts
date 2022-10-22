import { model, Schema, Document } from 'mongoose';
import { Post } from '@/interfaces/post.interface';

const postSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    user: {
      type: Object,
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    photos: {
      type: Array,
      default: null,
    },
    wishes: {
      type: Array,
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const postModel = model<Post & Document>('Post', postSchema);

export default postModel;
