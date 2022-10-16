import { NextFunction, Request, Response } from 'express';
import { CreatePostDto } from '@/dtos/post.dto';
import { Post } from '@/interfaces/post.interface';
import PostService from '@/services/post.service';
import { AWS_S3_ANDVARI_POST_IMAGES, AWS_S3_REGION, AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, AWS_S3_ANDVARI_PROFILE_IMAGES } from '@/config';
import * as AWS from 'aws-sdk';
import userService from '@services/users.service';
import { User } from '@interfaces/users.interface';
import { UpdateWishPostDto } from '@/dtos/wish.dto';

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

  public loadPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const oldestPostCreatedAt = req.body.date;
      const loadPostData: Post[] = await this.postService.loadPost(oldestPostCreatedAt);

      const loadPostDataWithUserDetails = [];
      if (loadPostData && loadPostData.length > 0) {
        loadPostData.map(async post => {
          // First get the user of the post
          const userId: string = post.userId;
          const findOneUserData: User = await this.userService.findUserById(userId);

          // If the user have profile pic else if not
          if (findOneUserData && findOneUserData.profilePic) {
            // If the user have profice pic, get the pic from s3 bucket then push it post in the new array
            const imageId: string = findOneUserData.profilePic.id;
            const type: string = findOneUserData.profilePic.type;
            const status: string = findOneUserData.profilePic.status;

            // If profile pic is upload successfully which is alway succesfull
            if (status === 'success') {
              const bucketName: string = AWS_S3_ANDVARI_PROFILE_IMAGES;
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

              console.log('LOAD_PROFILE_IMAGE_START');
              s3.getObject(params, function (err: any, params: any) {
                // console.log(err, params1);
                if (params) {
                  const base64: any = Buffer.from(params.Body, 'base64').toString('base64');
                  const imageBase64 = `data:${type};base64,${base64}`;

                  findOneUserData.profilePic = {
                    id: imageId,
                    type: 'webp',
                    imageUrl: imageBase64,
                    status: 'success',
                  };
                  post.user = findOneUserData;
                  loadPostDataWithUserDetails.push(post);

                  console.log('LOAD_PROFILE_IMAGE_END_SUCCES', params);
                } else {
                  findOneUserData.profilePic = {
                    id: null,
                    type: null,
                    imageUrl: null,
                    status: 'failed',
                  };
                  post.user = findOneUserData;
                  loadPostDataWithUserDetails.push(post);

                  console.log('LOAD_PROFILE_IMAGE_END_ERR', err);
                }

                // After adding all the user for each post, get the photos of each post from s3 bucket
                if (loadPostDataWithUserDetails.length === loadPostData.length) {
                  console.log('LOAD_POST_DATA_WITH_USER', loadPostDataWithUserDetails);

                  const rawLoadPostData = [];
                  loadPostDataWithUserDetails.map(post => {
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

                          // After getting all the photos for each post, push it to the new array
                          if (photos.length === imageArray.length) {
                            console.log('ALL_PHOTOS_LOADED_SUCCESS', photos);
                            (post.photos = photos),
                              rawLoadPostData.push({
                                ...post,
                              });
                          }

                          // After pushing all the post with user and photos, select only the _doc property
                          if (rawLoadPostData.length === loadPostDataWithUserDetails.length) {
                            const newLoadPostData = [];
                            rawLoadPostData.map(post => {
                              newLoadPostData.push(post._doc);
                            });

                            console.log('NEW_LOAD_POST_DATA', newLoadPostData);
                            res.status(200).json({ data: newLoadPostData, message: 'FindPostLoad' });
                          }
                        });
                      }
                    });
                  });
                }
              });
            } else {
              findOneUserData.profilePic = {
                id: null,
                type: null,
                imageUrl: null,
                status: 'failed',
              };
              post.user = findOneUserData;
              loadPostDataWithUserDetails.push(post);
            }
          } else {
            // Add the user data to the post and push it to new array
            post.user = findOneUserData;
            loadPostDataWithUserDetails.push(post);

            // After adding all the user for each post, get the photos of each post from s3 bucket
            if (loadPostDataWithUserDetails.length === loadPostData.length) {
              console.log('LOAD_POST_DATA_WITH_USER', loadPostDataWithUserDetails);

              const rawLoadPostData = [];
              loadPostDataWithUserDetails.map(post => {
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

                      // After getting all the photos for each post, push it to the new array
                      if (photos.length === imageArray.length) {
                        console.log('ALL_PHOTOS_LOADED_SUCCESS', photos);
                        (post.photos = photos),
                          rawLoadPostData.push({
                            ...post,
                          });
                      }

                      // After pushing all the post with user and photos, select only the _doc property
                      if (rawLoadPostData.length === loadPostDataWithUserDetails.length) {
                        const newLoadPostData = [];
                        rawLoadPostData.map(post => {
                          newLoadPostData.push(post._doc);
                        });

                        console.log('NEW_LOAD_POST_DATA', newLoadPostData);
                        res.status(200).json({ data: newLoadPostData, message: 'Load Post Success' });
                      }
                    });
                  }
                });
              });
            }
          }
        });
      } else {
        res.status(200).json({ data: loadPostDataWithUserDetails, message: 'Post is empty' });
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

      // After creating the post, get the user of the post
      const userId: string = createPostData.userId;
      const findOneUserData: User = await this.userService.findUserById(userId);
      console.log('FIND_USER_DATA', findOneUserData);

      // If the user have profile pic else if not
      if (findOneUserData && findOneUserData.profilePic) {
        const imageId: string = findOneUserData.profilePic.id;
        const type = findOneUserData.profilePic.type;
        const status: string = findOneUserData.profilePic.status;

        if (status === 'success') {
          const bucketName: string = AWS_S3_ANDVARI_PROFILE_IMAGES;
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

          console.log('LOAD_PROFILE_IMAGE_START');
          s3.getObject(params, function (err: any, params: any) {
            // console.log(err, params1);
            if (params) {
              const base64: any = Buffer.from(params.Body, 'base64').toString('base64');
              const imageBase64 = `data:${type};base64,${base64}`;
              console.log('LOAD_PROFILE_IMAGE_END_SUCCES', params);
              findOneUserData.profilePic = {
                id: imageId,
                type: 'webp',
                imageUrl: imageBase64,
                status: 'success',
              };

              createPostData.user = findOneUserData;
            } else {
              console.log('LOAD_PROFILE_IMAGE_END_ERR', err);
              findOneUserData.profilePic = {
                id: null,
                type: null,
                imageUrl: null,
                status: 'failed',
              };

              createPostData.user = findOneUserData;
            }

            // Then get the photo of the post from s3 bucket
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
          });
        } else {
          findOneUserData.profilePic = {
            id: null,
            type: null,
            imageUrl: null,
            status: 'failed',
          };

          createPostData.user = findOneUserData;

          // Then get the photo of the post from s3 bucket
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

                  // After getting all the photo, add the value to the post
                  if (photos.length === imageArray.length) {
                    createPostData.photos = photos;

                    console.log('ALL_PHOTOS_LOADED_SUCCESS', photos);
                    res.status(201).json({ data: createPostData, message: 'createdPost' });
                  }
                });
              }
            });
          } else {
            res.status(201).json({ data: createPostData, message: 'createdPost' });
          }
        }
      } else {
        // If the user have no profile pic add the user to the post directly
        createPostData.user = findOneUserData;
        console.log('CREATE_POST_DATA', createPostData);

        // Then get the photo of the post from s3 bucket
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

                // After getting all the photo, add the value to the post
                if (photos.length === imageArray.length) {
                  createPostData.photos = photos;

                  console.log('ALL_PHOTOS_LOADED_SUCCESS', photos);
                  res.status(201).json({ data: createPostData, message: 'createdPost' });
                }
              });
            }
          });
        } else {
          res.status(201).json({ data: createPostData, message: 'createdPost' });
        }
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
