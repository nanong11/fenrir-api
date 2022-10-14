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

  public getAllPostCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllPostCount: any = await this.postService.findAllPostCount();

      res.status(200).json({ data: findAllPostCount, message: 'findAllPostCount' });
    } catch (error) {
      next(error);
    }
  };

  public loadPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const oldestPostCreatedAt = req.body.date;
      // console.log('oldestPostCreatedAt', oldestPostCreatedAt);
      const loadPostData: Post[] = await this.postService.loadPost(oldestPostCreatedAt);
      if (loadPostData && loadPostData.length > 0) {
        const rawLoadPostData = [];
        loadPostData.map(post => {
          const imageArray = post.photos;
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
                  const imageBase64 = `data:${type};base64,${base64}`;
                  photos.push({
                    imageUrl: imageBase64,
                    type: type,
                    status: 'success',
                  });
                  console.log('PHOTOS_LOADED_SUCCESS', photos);
                } else {
                  photos.push({
                    imageUrl: null,
                    type: null,
                    status: 'failed',
                  });
                  console.log('PHOTOS_LOADED_ERROR', photos);
                }

                if (photos.length === imageArray.length) {
                  console.log('ALL_PHOTOS_LOADED_SUCCESS', photos);
                  (post.photos = photos),
                    rawLoadPostData.push({
                      ...post,
                    });
                }
                if (rawLoadPostData.length === loadPostData.length) {
                  const newLoadPostData = [];
                  rawLoadPostData.map(post => {
                    newLoadPostData.push(post._doc);
                  });
                  res.status(200).json({ data: newLoadPostData, message: 'FindPostLoad' });
                }
              });
            }
          });
        });
      } else {
        res.status(200).json({ data: loadPostData, message: 'Post is empty' });
      }
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

      if (createPostData && createPostData.photos.length > 0) {
        const imageArray = createPostData.photos;
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
                const imageBase64 = `data:${type};base64,${base64}`;
                photos.push({
                  imageUrl: imageBase64,
                  type: type,
                  status: 'success',
                });
                console.log('PHOTOS_LOADED_SUCCESS', photos);
              } else {
                photos.push({
                  imageUrl: null,
                  type: null,
                  status: 'failed',
                });
                console.log('PHOTOS_LOADED_ERROR', photos);
              }

              if (photos.length === imageArray.length) {
                console.log('ALL_PHOTOS_LOADED_SUCCESS', photos);
                createPostData.photos = photos;
                res.status(201).json({ data: createPostData, message: 'createdPost' });
              }
            });
          }
        });
      } else {
        res.status(201).json({ data: createPostData, message: 'createdPost' });
      }
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
