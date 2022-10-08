import { NextFunction, Request, Response } from 'express';
import { CreatePostDto } from '@/dtos/post.dto';
import { Post } from '@/interfaces/post.interface';
import PostService from '@/services/post.service';
import { AWS_S3_ANDVARI_POST_IMAGES, AWS_S3_REGION, AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY } from '@/config';
import * as AWS from 'aws-sdk';

class PostController {
  public postService = new PostService();

  public getAllPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllPost: Post[] = await this.postService.findAllPost();

      res.status(200).json({ data: findAllPost, message: 'findAllPost' });
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

  public createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postData: CreatePostDto = req.body;
      const createPostData: Post = await this.postService.createPost(postData);

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

  public loadPostImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.imageArray && req.body.imageArray.length > 0) {
        const imageArray = req.body.imageArray;
        const photos = [];
        imageArray.map((image: { id: string; type: string; status: string }) => {
          const imageId = image.id;
          const type = image.type;
          const status = image.status;

          if (status === 'success') {
            const bucketName: string = AWS_S3_ANDVARI_POST_IMAGES;
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

            console.log('LOAD_POST_IMAGE_START');
            s3.getObject(params, function (err: any, params: any) {
              // console.log(err, params1);
              if (params) {
                const base64: any = Buffer.from(params.Body, 'base64').toString('base64');
                photos.push({
                  imageUrl: base64,
                  type: type,
                  status: 'success',
                });
                console.log('PHOTOS_LOADED_SUCCESS', photos);
              } else {
                photos.push({
                  imageUrl: null,
                  type: null,
                  statys: 'failed',
                });
                console.log('PHOTOS_LOADED_ERROR', photos);
              }

              if (photos.length === imageArray.length) {
                console.log('ALL_PHOTOS_LOADED_SUCCESS', photos);
                res.status(200).json({ data: photos, message: 'Load Image Success' });
              }
            });
          }
        });
      }
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