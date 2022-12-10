import { NextFunction, Request, Response } from 'express';
import { CreateUserDto, UpdateUserDto, PasswordDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { compare } from 'bcrypt';

class UsersController {
  public userService = new userService();

  // public getUsers = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const findAllUsersData: User[] = await this.userService.findAllUser();

  //     res.status(200).json({ data: findAllUsersData, message: 'findAll' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: User = await this.userService.getUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne Successful' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData: User = await this.userService.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'createUser Successful' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: UpdateUserDto = req.body;
      const updateUserData: User = await this.userService.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updateUser Successful' });
    } catch (error) {
      next(error);
    }
  };

  public checkOldPassword = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userDataFromReqBody: PasswordDto = req.body;
      const userDataFromAuthMiddleware: User = req.user;
      const isPasswordMatching: boolean = await compare(userDataFromReqBody.password, userDataFromAuthMiddleware.password);

      if (isPasswordMatching) {
        res.status(200).json({ isPasswordMatching: isPasswordMatching, message: 'validated old password' });
      } else {
        res.status(200).json({ isPasswordMatching: isPasswordMatching, message: 'wrong old password' });
      }
    } catch (error) {
      next(error);
    }
  };

  public checkMobileEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userMobile: number = req.body.mobile;
      const userEmail: string = req.body.email;

      if (userMobile) {
        const isMobileExist: Boolean = await this.userService.checkMobile(userMobile);

        if (isMobileExist) {
          res.status(200).json({ isMobileExist: isMobileExist, message: `${userMobile} exist in database.` });
        } else {
          res.status(200).json({ isMobileExist: isMobileExist, message: `${userMobile} not in database.` });
        }
      } else if (userEmail) {
        const isEmailExist: Boolean = await this.userService.checkEmail(userEmail);

        if (isEmailExist) {
          res.status(200).json({ isEmailExist: isEmailExist, message: `${userEmail} exist in database.` });
        } else {
          res.status(200).json({ isEmailExist: isEmailExist, message: `${userEmail} not in database.` });
        }
      }
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deleteUserData: User = await this.userService.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleteUser Successful' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
