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

export interface LoadPostData {
  post: Array<object>;
  postCount: number;
}

export interface SearchPostData {
  post: Array<object>;
  postCount: number;
}
