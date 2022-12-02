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
      const userId: string = req.body.userId;
      const oldestPostCreatedAt: any = req.body.date;
      const loadPostData: Post[] = await this.postService.loadPostByUserId(userId, oldestPostCreatedAt);

      res.status(200).json({ data: loadPostData, message: 'Load Post Success' });
    } catch (error) {
      next(error);
    }
  };

  public getAllPostCountByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.body.userId;
      const getAllPostCountByUserId: any = await this.postService.getAllPostCountByUserId(userId);

      res.status(200).json({ data: getAllPostCountByUserId, message: 'getAllPostCountByUserId' });
    } catch (error) {
      next(error);
    }
  };

  public loadPostByUserIdInWishes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.body.userId;
      const oldestPostCreatedAt = req.body.date;
      const loadPostData: Post[] = await this.postService.loadPostByUserIdInWishes(userId, oldestPostCreatedAt);

      res.status(200).json({ data: loadPostData, message: 'Load Post Success' });
    } catch (error) {
      next(error);
    }
  };

  public getAllPostCountByUserIdInWishes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.body.userId;
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

  public searchPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const oldestPostCreatedAt: any = req.body.date;
      const keyWord: string = req.body.keyWord;
      const searchPostData: Post[] = await this.postService.searchPost(oldestPostCreatedAt, keyWord);

      res.status(200).json({ data: searchPostData, message: 'Search Post Success' });
    } catch (error) {
      next(error);
    }
  };

  public getAllSearchPostCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const keyWord: string = req.body.keyWord;
      const getAllSearchPostCount: any = await this.postService.getAllSearchPostCount(keyWord);

      res.status(200).json({ data: getAllSearchPostCount, message: 'getAllSearchPostCount' });
    } catch (error) {
      next(error);
    }
  };

  public searchPostByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.body.userId;
      const oldestPostCreatedAt: any = req.body.date;
      const keyWord: string = req.body.keyWord;
      const searchPostByUserId: Post[] = await this.postService.searchPostByUserId(oldestPostCreatedAt, keyWord, userId);

      res.status(200).json({ data: searchPostByUserId, message: 'Search Post By UserId Success' });
    } catch (error) {
      next(error);
    }
  };

  public getAllSearchPostCountByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.body.userId;
      const keyWord: string = req.body.keyWord;
      const getAllSearchPostCountByUserId: any = await this.postService.getAllSearchPostCountByUserId(keyWord, userId);

      res.status(200).json({ data: getAllSearchPostCountByUserId, message: 'getAllSearchPostCountByUserId' });
    } catch (error) {
      next(error);
    }
  };

  public searchPostByUserIdInWishes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.body.userId;
      const oldestPostCreatedAt: any = req.body.date;
      const keyWord: string = req.body.keyWord;
      const searchPostByUserIdInWishes: Post[] = await this.postService.searchPostByUserIdInWishes(oldestPostCreatedAt, keyWord, userId);

      res.status(200).json({ data: searchPostByUserIdInWishes, message: 'Search Post By UserId In Wishes Success' });
    } catch (error) {
      next(error);
    }
  };

  public getAllSearchPostCountByUserIdInWishes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.body.userId;
      const keyWord: string = req.body.keyWord;
      const getAllSearchPostCountByUserIdInWishes: any = await this.postService.getAllSearchPostCountByUserIdInWishes(keyWord, userId);

      res.status(200).json({ data: getAllSearchPostCountByUserIdInWishes, message: 'getAllSearchPostCountByUserIdInWishes' });
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
