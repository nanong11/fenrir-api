import { model, Schema, Document } from 'mongoose';
import { Province } from '@/interfaces/province.interface';

const provinceSchema: Schema = new Schema(
  {
    province: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    brgy: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const provinceModel = model<Province & Document>('Province', provinceSchema);

export default provinceModel;
