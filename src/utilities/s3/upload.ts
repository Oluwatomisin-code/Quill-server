import stream from 'stream';

import {bucket, getS3Object} from './bucket';

export const createUploadStream = (key: string) => {
  const pass = new stream.PassThrough();
  return {
    writeStream: pass,
    promise: getS3Object(
      process.env.S3_ACCESS_KEY || '',
      process.env.S3_SECRET_ACCESS_KEY || ''
    )
      .upload({
        Bucket: bucket || '',
        Key: key,
        Body: pass,
      })
      .promise(),
  };
};

export const deleteImage = (img: string) => {
  return getS3Object(
    process.env.S3_ACCESS_KEY || '',
    process.env.S3_SECRET_ACCESS_KEY || ''
  )
    .deleteObject({
      Bucket: bucket || '',
      Key: img,
    })
    .promise();
};
