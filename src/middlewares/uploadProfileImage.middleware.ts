import { NextFunction, Request, Response } from 'express';
import { AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, AWS_S3_REGION, AWS_S3_ANDVARI_PROFILE_IMAGES } from '@config';
import { HttpException } from '@exceptions/HttpException';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

const uploadProfileImageMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.profilePic) {
      const base64Data: any = Buffer.from(req.body.profilePic.imageUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      // const type: string = req.body.profilePic.imageUrl.split(';')[0].split('/')[1];
      const type = 'webp';
      const bucketName: string = AWS_S3_ANDVARI_PROFILE_IMAGES;
      const region: string = AWS_S3_REGION;
      const accessKeyId: string = AWS_S3_ACCESS_KEY_ID;
      const secretAccessKey: string = AWS_S3_SECRET_ACCESS_KEY;
      const uniqueId = uuidv4();

      const base64DataWebp = await sharp(base64Data)
        .resize(320, 320)
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

      console.log('UPLOAD_PROFILE_IMAGE_START');
      const options = { partSize: 10 * 1024 * 1024, queueSize: 1 };
      s3.upload(params, options, function (err: any, params: any) {
        // console.log(err, params);
        if (params) {
          req.body.profilePic = {
            id: params.key,
            type: type,
            status: 'success',
          };
          console.log('UPLOAD_PROFILE_IMAGE_END');
          next();
        } else {
          console.log('UPLOAD_PROFILE_IMAGE_END');
          next(new HttpException(401, 'Upload Failed'));
        }
      });
    } else {
      next();
    }
  } catch (error) {
    next(new HttpException(401, 'Upload Error'));
  }
};

export default uploadProfileImageMiddleware;
