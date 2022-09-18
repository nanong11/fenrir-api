import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const userSchema: Schema = new Schema({
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
  facebook: {
    type: String,
    required: true,
  },
  post: {
    type: Array,
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
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
