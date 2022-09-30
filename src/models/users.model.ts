import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    birthday: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    socialMedia: {
      type: Array,
      default: null,
    },
    profilePic: {
      type: String,
      default: null,
    },
    about: {
      type: String,
      default: null,
    },
    verifiedPhone: {
      type: Boolean,
      default: null,
    },
    verifiedUser: {
      type: Boolean,
      default: null,
    },
  },
  { timestamps: true },
);

const userModel = model<User & Document>('User', userSchema);

export default userModel;
