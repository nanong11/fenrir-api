import { model, Schema, Document } from 'mongoose';
import { Message } from '@interfaces/message.interface';

const messageSchema: Schema = new Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    recipientId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      default: null,
    },
    photos: {
      type: Array,
      default: null,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const messageModel = model<Message & Document>('Message', messageSchema);

export default messageModel;
