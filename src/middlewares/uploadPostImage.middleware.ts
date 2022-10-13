import { NextFunction, Request, Response } from 'express';
import { AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, AWS_S3_REGION, AWS_S3_ANDVARI_POST_IMAGES } from '@config';
import { HttpException } from '@exceptions/HttpException';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

const uploadPostImageMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.photos && req.body.photos.length > 0) {
      const imageUrlArray = req.body.photos;
      const photos = [];
      imageUrlArray.map(async (imageUrl: string) => {
        const base64Data: any = Buffer.from(imageUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        const type: string = imageUrl.split(';')[0].split('/')[1];
        const bucketName: string = AWS_S3_ANDVARI_POST_IMAGES;
        const region: string = AWS_S3_REGION;
        const accessKeyId: string = AWS_S3_ACCESS_KEY_ID;
        const secretAccessKey: string = AWS_S3_SECRET_ACCESS_KEY;
        const uniqueId = uuidv4();

        const base64DataWebp = await sharp(base64Data)
          .toFormat('webp')
          .toBuffer()
          .then(data => {
            return data;
          })
          .catch(err => {
            console.log('Sharp Convert Error', err);
            return base64Data;
          });

        AWS.config.update({
          region,
          accessKeyId,
          secretAccessKey,
        });

        const s3 = new AWS.S3();
        const params = {
          Bucket: bucketName,
          Key: uniqueId,
          Body: base64DataWebp,
          // ACL: 'public-read',
          ContentEncoding: 'base64',
          ContentType: `image/${type}`,
        };
        const options = { partSize: 10 * 1024 * 1024, queueSize: 1 };

        console.log('UPLOAD_POST_IMAGE_START');
        s3.upload(params, options, function (err: any, params: any) {
          if (params) {
            photos.push({
              id: params.key,
              type: type,
              status: 'success',
            });
            console.log('UPLOAD_POST_IMAGE_END_SUCCESS');
            console.log('S3_UPLOAD_PARAMS', params);
          } else {
            photos.push({
              id: null,
              type: null,
              status: 'failed',
            });
            console.log('UPLOAD_POST_IMAGE_END_ERROR');
            console.log('S3_UPLOAD_ERROR', err);
            next(new HttpException(401, 'Upload Failed'));
          }

          if (photos.length === imageUrlArray.length) {
            console.log('PHOTOS_UPLOADED', photos);
            req.body.photos = photos;
            next();
          }
        });
      });
    } else {
      req.body.photos = [];
      next();
    }
  } catch (error) {
    next(new HttpException(401, 'Upload Error'));
  }
};

export default uploadPostImageMiddleware;
