import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';
import { AWS_S3_ACCESS_KEY_ID, AWS_S3_ANDVARI_PROFILE_IMAGES, AWS_S3_REGION, AWS_S3_SECRET_ACCESS_KEY } from '@/config';
import * as AWS from 'aws-sdk';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { compare } from 'bcrypt';

class UsersController {
  public userService = new userService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: User = await this.userService.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData: User = await this.userService.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: CreateUserDto = req.body;
      const updateUserData: User = await this.userService.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
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

  public checkOldPassword = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userDataFromReqBody: CreateUserDto = req.body;
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

  public getProfilePhoto = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const imageId: string = req.params.id;
      const imageType = 'webp';
      const bucketName: string = AWS_S3_ANDVARI_PROFILE_IMAGES;
      const region: string = AWS_S3_REGION;
      const accessKeyId: string = AWS_S3_ACCESS_KEY_ID;
      const secretAccessKey: string = AWS_S3_SECRET_ACCESS_KEY;

      AWS.config.update({
        region,
        accessKeyId,
        secretAccessKey,
      });

      const s3 = new AWS.S3();
      const params = {
        Bucket: bucketName,
        Key: imageId,
      };

      console.log('LOAD_PROFILE_IMAGE_START');
      s3.getObject(params, function (err: any, params: any) {
        // console.log(err, params1);
        if (params) {
          const base64: any = Buffer.from(params.Body, 'base64').toString('base64');
          const imageBase64 = `data:${imageType};base64,${base64}`;

          console.log('LOAD_PROFILE_IMAGE_END_SUCCESS');
          res.status(200).json({ data: imageBase64, message: 'Load Image Success' });
        } else {
          console.log('LOAD_PROFILE_IMAGE_END_ERROR');
          res.status(401).json({ data: err, message: 'Load Image Failed' });
        }
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deleteUserData: User = await this.userService.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
