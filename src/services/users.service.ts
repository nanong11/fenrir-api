import { compare, hash } from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';

class UserService {
  public users = userModel;

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await this.users.find();
    return users;
  }

  public async getUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

    const findUser: User = await this.users.findOne({ _id: userId, isActive: true });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUsername: User = await this.users.findOne({ username: userData.username });
    if (findUsername) throw new HttpException(409, `${userData.username} already exists`);

    // const findUserMobile: User = await this.users.findOne({ mobile: userData.mobile });
    // if (findUserMobile) throw new HttpException(409, `This mobile ${userData.mobile} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async updateUser(userId: string, userData: UpdateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    if (userData.oldPassword) {
      const findUser: User = await this.users.findOne({ _id: userId });
      if (!findUser) throw new HttpException(409, "User doesn't exist");

      const isPasswordMatching: boolean = await compare(userData.oldPassword, findUser.password);
      if (!isPasswordMatching) throw new HttpException(401, 'Wrong old password');
    }

    if (userData.username) {
      const findUser: User = await this.users.findOne({ username: userData.username });
      if (findUser && findUser._id != userId) throw new HttpException(409, `This username ${userData.username} already exists`);
    }

    // if (userData.mobile) {
    //   const findUser: User = await this.users.findOne({ mobile: userData.mobile });
    //   if (findUser && findUser._id != userId) throw new HttpException(409, `This mobile ${userData.mobile} already exists`);
    // }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const updateUserById: User = await this.users.findByIdAndUpdate(userId, userData, { new: true });
    if (!updateUserById) throw new HttpException(409, "User doesn't exist");

    return updateUserById;
  }

  // public async checkMobile(userMobile: number): Promise<Boolean> {
  //   if (isEmpty(userMobile)) throw new HttpException(400, 'userMobile is empty');

  //   const findUser: User = await this.users.findOne({ mobile: userMobile });

  //   return findUser?.mobile === userMobile ? true : false;
  // }

  // public async checkEmail(userEmail: string): Promise<Boolean> {
  //   if (isEmpty(userEmail)) throw new HttpException(400, 'userEmail is empty');

  //   const findUser: User = await this.users.findOne({ email: userEmail });

  //   return findUser?.email === userEmail ? true : false;
  // }

  public async deleteUser(userId: string): Promise<User> {
    const deleteUserById: User = await this.users.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "User doesn't exist");

    return deleteUserById;
  }
}

export default UserService;
