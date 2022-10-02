import { NextFunction, Request, Response } from 'express';
import { AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME, AWS_S3_REGION } from '@config';
import { HttpException } from '@exceptions/HttpException';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const uploadImageMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  console.log('req', req.body);
  try {
    if (req.body.profilePic) {
      const base64Data: any = Buffer.from(req.body.profilePic.imageUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const type: string = req.body.profilePic.imageUrl.split(';')[0].split('/')[1];
      const bucketName: string = AWS_S3_BUCKET_NAME;
      const region: string = AWS_S3_REGION;
      const accessKeyId: string = AWS_S3_ACCESS_KEY_ID;
      const secretAccessKey: string = AWS_S3_SECRET_ACCESS_KEY;
      const uniqueId = uuidv4();

      AWS.config.update({
        region,
        accessKeyId,
        secretAccessKey,
      });
      const s3 = new AWS.S3();
      const params = {
        Bucket: bucketName,
        Key: uniqueId,
        Body: base64Data,
        // ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: `image/${type}`,
      };

      s3.upload(params, function (err: any, params: any) {
        console.log(err, params);
        req.body.profilePic = {
          id: uniqueId,
          type: type,
        };
        next();
      });
    } else {
      next();
    }
  } catch (error) {
    next(new HttpException(401, 'Upload Error'));
  }
};

export default uploadImageMiddleware;
