import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import {
  AWS_SECRET_BUCKET_NAME,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} from "../secret";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});
export const getObjectURL = async (key, expirationTimeInSeconds) => {
  const command = new GetObjectCommand({
    Bucket: AWS_SECRET_BUCKET_NAME,
    Key: key,
  });

  // Get a signed URL with an expiration time
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: expirationTimeInSeconds,
  });

  return url;
};

export const getPresignedUrl = async (data) => {
  const { clientName, fileName, contentType } = data;

  const command = new PutObjectCommand({
    Bucket: AWS_SECRET_BUCKET_NAME,
    Key: `/${clientName}/${fileName}`,
    ContentType: contentType,
  });

  const url = getSignedUrl(s3Client, command);
  return url;
};

export const deleteObject = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: AWS_SECRET_BUCKET_NAME,
    Key: key,
  });

  const res = await s3Client.send(command);
  return res;
};
