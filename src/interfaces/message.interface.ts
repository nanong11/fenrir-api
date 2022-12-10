export interface Message {
  _id: string;
  senderId: string;
  recipientId: string;
  text: string;
  photos: Array<object>;
  deleted: boolean;
}
