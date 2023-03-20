import { Message } from '@interfaces/message.interface';

export interface Conversation {
  _id: string;
  participants: Array<any>;
  messages: Array<Message>;
  type: string;
  isActive: boolean;
}
