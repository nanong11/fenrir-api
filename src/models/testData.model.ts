// REQUIRED TO IMPORT
import { model, Schema, Document } from 'mongoose';
// Import interface
import { TestData } from '@interfaces/testData.interface';

const testDataSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
});

const testDataModel = model<TestData & Document>('TestData', testDataSchema);

export default testDataModel;
