import { NextFunction, Request, Response } from 'express';
import { CreatePostDto, UpdatePostDto, UpdateWishPostDto, LoadPostDto, SearchPostDto } from '@/dtos/post.dto';
import { Post, LoadPostData, SearchPostData } from '@/interfaces/post.interface';
import PostService from '@/services/post.service';
import userService from '@services/users.service';

class PostController {
  public postService = new PostService();
  public userService = new userService();

  public createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postData: CreatePostDto = req.body;
      const createPostData: Post = await this.postService.createPost(postData);

      res.status(201).json({ data: createPostData, message: 'createdPost successful' });
    } catch (error) {
      next(error);
    }
  };

  public updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.body.postId;
      const postData: UpdatePostDto = req.body;
      const updatePostData: Post = await this.postService.updatePost(postId, postData);

      res.status(200).json({ data: updatePostData, message: 'updatedPost successful' });
    } catch (error) {
      next(error);
    }
  };

  public updateWishPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.body.postId;
      const postWishData: UpdateWishPostDto = req.body;
      const updateWishPostData: Post = await this.postService.updateWishPostById(postId, postWishData);

      res.status(200).json({ data: updateWishPostData, message: 'updatedPostWish successful' });
    } catch (error) {
      next(error);
    }
  };

  public loadPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loadPostDetails: LoadPostDto = req.body;
      const loadPostData: LoadPostData = await this.postService.loadPost(loadPostDetails);

      res.status(200).json({ data: loadPostData, message: 'Load Post Success' });
    } catch (error) {
      next(error);
    }
  };

  public searchPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchPostDetails: SearchPostDto = req.body;
      const searchPostData: SearchPostData = await this.postService.searchPost(searchPostDetails);

      res.status(200).json({ data: searchPostData, message: 'Search Post Success' });
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
