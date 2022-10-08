import { Router } from 'express';
import PostController from '@/controllers/post.controller';
import { CreatePostDto } from '@/dtos/post.dto';
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
    this.router.get(`${this.path}`, authMiddleware, this.postController.getAllPost);
    this.router.get(`${this.path}/:id`, authMiddleware, this.postController.getPostById);
    this.router.post(
      `${this.path}`,
      authMiddleware,
      uploadPostImageMiddleware,
      validationMiddleware(CreatePostDto, 'body'),
      this.postController.createPost,
    );
    this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(CreatePostDto, 'body', true), this.postController.updatePost);
    this.router.post(`${this.path}/load_post_images`, authMiddleware, this.postController.loadPostImages);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.postController.deletePost);
  }
}

export default UsersRoute;