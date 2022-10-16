export interface Post {
  _id: string;
  userId: string;
  user?: object;
  title: string;
  description: string;
  category: string;
  price: number;
  photos: Array<object>;
  wishes: Array<object>;
}
