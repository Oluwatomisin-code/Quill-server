import {S3} from 'aws-sdk';
import {PutObjectRequest} from 'aws-sdk/clients/s3';
import {uuid} from 'uuidv4';

export const s3Upload = async (
  fileInput: Express.Multer.File | Express.Multer.File[],
  folderName: string,
  fileName: string
) => {
  const s3 = new S3();
  if (Array.isArray(fileInput)) {
    const fileType = fileInput[0].mimetype.split('/')[0];
    const params = fileInput.map(file => {
      return {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${folderName}/${fileType}/${fileName}/${uuid()}`,
        Body: file.buffer,
        ContentType: `${file.mimetype}`,
      } as PutObjectRequest;
    });
    return await Promise.all(params.map(param => s3.upload(param).promise()));
  } else {
    const fileType = fileInput.mimetype.split('/')[0];
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folderName}/${fileType}/${fileName}/${uuid()}`,
      Body: fileInput.buffer,
      ContentType: `${fileInput.mimetype}`,
    } as PutObjectRequest;

    return await s3.upload(params).promise();
  }
};
