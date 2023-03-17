import { model, Schema, Document } from 'mongoose';
import { Conversation } from '@interfaces/conversation.interface';

const conversationSchema: Schema = new Schema(
  {
    participants: {
      type: Array,
      require: true,
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
