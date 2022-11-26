import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@middlewares/auth.middleware';
import uploadProfileImageMiddleware from '@middlewares/uploadProfileImage.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.usersController.getUsers);
    this.router.get(`${this.path}/:id`, this.usersController.getUserById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateUserDto, 'body'), this.usersController.createUser);
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      validationMiddleware(CreateUserDto, 'body', true),
      uploadProfileImageMiddleware,
      this.usersController.updateUser,
    );
    this.router.post(`${this.path}/check_mobile_email`, this.usersController.checkMobileEmail);
    this.router.post(
      `${this.path}/check_old_password`,
      authMiddleware,
      validationMiddleware(CreateUserDto, 'body', true),
      this.usersController.checkOldPassword,
    );
    this.router.get(`${this.path}/get_profile_photo/:id`, this.usersController.getProfilePhoto);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.usersController.deleteUser);
  }
}

export default UsersRoute;
