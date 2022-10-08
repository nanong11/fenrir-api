export interface Post {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  photos: Array<object>;
}
