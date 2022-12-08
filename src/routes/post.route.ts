import { Router } from 'express';
import PostController from '@/controllers/post.controller';
import { CreatePostDto, UpdatePostDto, UpdateWishPostDto, LoadPostDto, SearchPostDto } from '@/dtos/post.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@middlewares/auth.middleware';
import uploadPostImageMiddleware from '@/middlewares/uploadPostImage.middleware';

class UsersRoute implements Routes {
  public path = '/post';
  public router = Router();
  public postController = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/create`,
      authMiddleware,
      uploadPostImageMiddleware,
      validationMiddleware(CreatePostDto, 'body'),
      this.postController.createPost,
    );
    this.router.put(`${this.path}/update`, authMiddleware, validationMiddleware(UpdatePostDto, 'body'), this.postController.updatePost);
    this.router.put(
      `${this.path}/update/wish`,
      authMiddleware,
      validationMiddleware(UpdateWishPostDto, 'body'),
      this.postController.updateWishPostById,
    );
    this.router.post(`${this.path}/load`, validationMiddleware(LoadPostDto, 'body'), this.postController.loadPost);
    this.router.post(`${this.path}/search`, validationMiddleware(SearchPostDto, 'body'), this.postController.searchPost);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.postController.deletePost);
  }
}

export default UsersRoute;
