import * as AWS from 'aws-sdk';

const s3ImageDownload = async (body: any) => {
  try {
    const imageId: string = body.imageId;
    const type: string = body.type;
    const bucketName: string = body.bucketName;
    const region: string = body.region;
    const accessKeyId: string = body.accessKeyId;
    const secretAccessKey: string = body.secretAccessKey;

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

    s3.getObject(params, function (err: any, params: any) {
      if (params) {
        console.log('S3_GETOBJECT_PARAMS', params);
        const base64: any = Buffer.from(params.Body, 'base64').toString('base64');
        const imageBase64 = `data:${type};base64,${base64}`;

        const response = {
          id: imageId,
          type: 'webp',
          imageUrl: imageBase64,
          status: 'success',
        };

        console.log('S3 Image Download Successful');
        return response;
      } else {
        console.log('S3_GETOBJECT_PARAMS', err);
        const response = {
          id: null,
          type: null,
          imageUrl: null,
          status: 'failed',
        };

        console.log('S3 Image Download Failed');
        return response;
      }
    });
  } catch (error) {
    const response = {
      id: null,
      type: null,
      imageUrl: null,
      status: 'error',
    };

    console.log('S3 Image Download Error', error);
    return response;
  }
};

export default s3ImageDownload;
