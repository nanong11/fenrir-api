export interface User {
  _id: string;
  email: string;
  password: string;
  mobile: number;
  firstName: string;
  lastName: string;
  address: object;
  birthday: string;
  facebook: string;
  post: any[];
  role: string;
  isActive: boolean;
}
