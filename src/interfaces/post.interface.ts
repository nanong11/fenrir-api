export interface Post {
  _id: string;
  userId: string;
  user: object;
  title: string;
  description: string;
  category: string;
  price: number;
  photos: Array<object>;
  wishes: Array<object>;
  active: Boolean;
}

export interface SearchPostData {
  post: Array<object>;
  postCount: number;
}
