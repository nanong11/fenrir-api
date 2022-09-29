export interface User {
  _id: string;
  email: string;
  password: string;
  mobile: number;
  firstName: string;
  lastName: string;
  address: object;
  birthday: string;
  role: string;
  isActive: boolean;
  facebook: string;
  profilePic: string;
  about: string;
  verifiedPhone: boolean;
  verifiedUser: boolean;
}
