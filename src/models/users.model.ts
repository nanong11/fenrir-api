import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const userSchema: Schema = new Schema(
  {
    // mobile: {
    //   type: Number,
    //   required: true,
    //   unique: true,
    // },
    email: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    // firstName: {
    //   type: String,
    //   required: true,
    // },
    // lastName: {
    //   type: String,
    //   required: true,
    // },
    // birthday: {
    //   type: String,
    //   required: true,
    // },
    // address: {
    //   type: Object,
    //   required: true,
    // },
    role: {
      type: String,
      default: 'user',
    },
    // verifiedPhone: {
    //   type: Boolean,
    //   required: true,
    // },
    isActive: {
      type: Boolean,
      default: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    // socialMedia: {
    //   type: Object,
    //   default: null,
    // },
    profilePic: {
      type: Object,
      default: null,
    },
    // about: {
    //   type: String,
    //   default: null,
    // },
    // verifiedUser: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  { timestamps: true },
);

const userModel = model<User & Document>('User', userSchema);

export default userModel;
