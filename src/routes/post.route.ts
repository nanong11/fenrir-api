import { Router } from 'express';
import PostController from '@/controllers/post.controller';
import { CreatePostDto } from '@/dtos/post.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@middlewares/auth.middleware';
import uploadPostImageMiddleware from '@/middlewares/uploadPostImage.middleware';
import { UpdateWishPostDto } from '@/dtos/wish.dto';

class UsersRoute implements Routes {
  public path = '/post';
  public router = Router();
  public postController = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.postController.getAllPost);
    this.router.get(`${this.path}/count`, this.postController.getAllPostCount);
    this.router.get(`${this.path}/:id`, this.postController.getPostById);
    this.router.post(`${this.path}/load`, this.postController.loadPost);
    // this.router.post(`${this.path}/load_from_cache`, this.postController.loadPostFromCache);
    this.router.post(`${this.path}/load_by_userid`, this.postController.loadPostByUserId);
    this.router.post(`${this.path}/count_by_userid`, this.postController.getAllPostCountByUserId);
    this.router.post(`${this.path}/load_by_userid_in_wishes`, this.postController.loadPostByUserIdInWishes);
    this.router.post(`${this.path}/count_by_userid_in_wishes`, this.postController.getAllPostCountByUserIdInWishes);
    this.router.post(
      `${this.path}`,
      authMiddleware,
      uploadPostImageMiddleware,
      validationMiddleware(CreatePostDto, 'body'),
      this.postController.createPost,
    );
    this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(CreatePostDto, 'body', true, false), this.postController.updatePost);
    this.router.put(
      `${this.path}/update/wish/:id`,
      authMiddleware,
      validationMiddleware(UpdateWishPostDto, 'body'),
      this.postController.updateWishPostById,
    );
    this.router.post(`${this.path}/search`, this.postController.searchPost);
    this.router.post(`${this.path}/search_count`, this.postController.getAllSearchPostCount);
    this.router.post(`${this.path}/search_by_userId`, this.postController.searchPostByUserId);
    this.router.post(`${this.path}/search_count_by_userId`, this.postController.getAllSearchPostCountByUserId);
    this.router.post(`${this.path}/search_by_userId_in_wishes`, this.postController.searchPostByUserIdInWishes);
    this.router.post(`${this.path}/search_count_by_userId_in_wishes`, this.postController.getAllSearchPostCountByUserIdInWishes);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.postController.deletePost);
  }
}

export default UsersRoute;
