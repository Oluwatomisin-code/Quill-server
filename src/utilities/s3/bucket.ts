import AWS from 'aws-sdk';

export const bucket = 'ezrealtour'; //process.env.S3_BUCKET as string;

export const s3 = new AWS.S3({
  endpoint: 'https://ezrealtour.s3.amazonaws.com',
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  sslEnabled: false,
  s3ForcePathStyle: true,
});

export const getS3Object = (accessKey: string, secretAccessKey: string) => {
  return new AWS.S3({
    endpoint: 'https://ezrealtour.s3.amazonaws.com',
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
    sslEnabled: false,
    s3ForcePathStyle: true,
  });
};
