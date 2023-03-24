import { model, Schema, Document } from 'mongoose';
import { Message } from '@interfaces/message.interface';

const messageSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    conversationId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      default: null,
    },
    media: {
      type: Array,
      default: null,
    },
    status: {
      type: String,
      default: 'sent',
    },
    removed: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);

const messageModel = model<Message & Document>('Message', messageSchema);

export default messageModel;
