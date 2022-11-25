import { NextFunction, Request, Response } from 'express';
import { CreatePostDto } from '@/dtos/post.dto';
import { Post } from '@/interfaces/post.interface';
import PostService from '@/services/post.service';
import userService from '@services/users.service';
import { User } from '@interfaces/users.interface';
import { UpdateWishPostDto } from '@/dtos/wish.dto';
// import { redisCacheSetEx, redisCacheGet } from '@/utils/redisCache';

class PostController {
  public postService = new PostService();
  public userService = new userService();

  public getAllPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllPost: Post[] = await this.postService.findAllPost();

      res.status(200).json({ data: findAllPost, message: 'findAllPost' });
    } catch (error) {
      next(error);
    }
  };

  public getAllPostCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllPostCount: any = await this.postService.findAllPostCount();

      res.status(200).json({ data: findAllPostCount, message: 'findAllPostCount' });
    } catch (error) {
      next(error);
    }
  };

  public getPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.params.id;
      const findOnePostData: Post = await this.postService.findPostById(postId);

      res.status(200).json({ data: findOnePostData, message: 'findOnePost' });
    } catch (error) {
      next(error);
    }
  };

  public loadPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const oldestPostCreatedAt = req.body.date;
      const loadPostData: Post[] = await this.postService.loadPost(oldestPostCreatedAt);

      res.status(200).json({ data: loadPostData, message: 'Load Post Success' });
    } catch (error) {
      next(error);
    }
  };

  // public loadPostFromCache = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const key = req.body.key;
  //     const loadPostFromCache = await redisCacheGet(key)

  //     res.status(200).json({ data: loadPostFromCache, message: 'Load Post From Cache Success' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  public loadPostByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.body.userId;
      const oldestPostCreatedAt = req.body.date;
      const loadPostData: Post[] = await this.postService.loadPostByUserId(userId, oldestPostCreatedAt);

      res.status(200).json({ data: loadPostData, message: 'Load Post Success' });
    } catch (error) {
      next(error);
    }
  };

  public getAllPostCountByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.body.userId;
      const getAllPostCountByUserId: any = await this.postService.getAllPostCountByUserId(userId);

      res.status(200).json({ data: getAllPostCountByUserId, message: 'getAllPostCountByUserId' });
    } catch (error) {
      next(error);
    }
  };

  public loadPostByUserIdInWishes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.body.userId;
      const oldestPostCreatedAt = req.body.date;
      const loadPostData: Post[] = await this.postService.loadPostByUserIdInWishes(userId, oldestPostCreatedAt);

      res.status(200).json({ data: loadPostData, message: 'Load Post Success' });
    } catch (error) {
      next(error);
    }
  };

  public getAllPostCountByUserIdInWishes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.body.userId;
      const getAllPostCountByUserIdInWishes: any = await this.postService.getAllPostCountByUserIdInWishes(userId);

      res.status(200).json({ data: getAllPostCountByUserIdInWishes, message: 'getAllPostCountByUserIdInWishes' });
    } catch (error) {
      next(error);
    }
  };

  public createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postData: Post = req.body;
      const userId: string = req.body.userId;
      const findOneUserData: User = await this.userService.findUserById(userId);
      postData.user = findOneUserData;
      const createPostData: Post = await this.postService.createPost(postData);

      console.log('POST CREATED', createPostData);
      res.status(201).json({ data: createPostData, message: 'createdPost' });
    } catch (error) {
      next(error);
    }
  };

  public updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.params.id;
      const postData: CreatePostDto = req.body;
      const updatePostData: Post = await this.postService.updatePost(postId, postData);

      res.status(200).json({ data: updatePostData, message: 'updatedPost' });
    } catch (error) {
      next(error);
    }
  };

  public updateWishPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.params.id;
      const postWishData: UpdateWishPostDto = req.body;
      const updateWishPostData: Post = await this.postService.updateWishPostById(postId, postWishData);

      res.status(200).json({ data: updateWishPostData, message: 'updatedPost' });
    } catch (error) {
      next(error);
    }
  };

  public deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.params.id;
      const deletePostData: Post = await this.postService.deletePost(postId);

      res.status(200).json({ data: deletePostData, message: 'deletedPost' });
    } catch (error) {
      next(error);
    }
  };
}

export default PostController;
