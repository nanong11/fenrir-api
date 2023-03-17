export interface Message {
  _id: string;
  userId: string;
  conversationId: string;
  text: string;
  media: Array<object>;
  status: string;
  isDeleted: boolean;
}
