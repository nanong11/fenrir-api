import { model, Schema, Document } from 'mongoose';
import { Conversation } from '@interfaces/conversation.interface';

const conversationSchema: Schema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    participants: {
      type: Array,
      require: true,
    },
    messages: {
      type: Array,
      default: [],
    },
    type: {
      type: String,
      require: true,
    },
    createdBy: {
      type: String,
      require: true,
    },
    deletedBy: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const conversationModel = model<Conversation & Document>('Conversation', conversationSchema);

export default conversationModel;
