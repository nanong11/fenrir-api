import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import * as AWS from 'aws-sdk';
import { AWS_S3_BUCKET_NAME, AWS_S3_REGION, AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY } from '@/config';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { cookie, token, findUser } = await this.authService.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findUser, token: token, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public findUserData = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const findUser: User = await this.authService.findUserData(userData);

      if (findUser.profilePic.id) {
        const bucketName: string = AWS_S3_BUCKET_NAME;
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
          Key: findUser.profilePic.id,
        };
        s3.getObject(params, function (err: any, params: any) {
          // console.log(err, params1);
          const buff: any = Buffer.from(params.Body, 'base64');
          const base64123 = buff.toString('base64');
          findUser.profilePic.id = base64123;
          res.status(200).json({ data: findUser, message: 'validated cookie' });
        });
      } else {
        res.status(200).json({ data: findUser, message: 'validated cookie' });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
