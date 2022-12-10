import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { NODE_ENV, SECRET_KEY } from '@config';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';

class AuthService {
  public users = userModel;

  public async login(userData: CreateUserDto): Promise<{ cookie: string; token: string; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    if (userData.mobile) {
      const findUser: User = await this.users.findOne({ mobile: userData.mobile });
      if (!findUser) throw new HttpException(404, `This mobile ${userData.mobile} was not found`);

      const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
      if (!isPasswordMatching) throw new HttpException(401, 'Password is not matching');

      const tokenData = this.createToken(findUser);
      const token = tokenData.token;
      const cookie = this.createCookie(tokenData);

      return { cookie, token, findUser };
    } else {
      const findUser: User = await this.users.findOne({ email: userData.email });
      if (!findUser) throw new HttpException(404, `This email ${userData.email} was not found`);

      const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
      if (!isPasswordMatching) throw new HttpException(401, 'Password is not matching');

      const tokenData = this.createToken(findUser);
      const token = tokenData.token;
      const cookie = this.createCookie(tokenData);

      return { cookie, token, findUser };
    }
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(404, `This email ${userData.email} was not found`);

    return findUser;
  }

  public async findUserData(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    if (userData) {
      const findUser: User = await this.users.findOne({ email: userData.email, mobile: userData.mobile });
      if (!findUser) throw new HttpException(404, `No user found`);

      return findUser;
    }
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = NODE_ENV === 'development' ? 2147483647 /* default expiration */ : 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
