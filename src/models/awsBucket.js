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
} from "../../src/secrets.js";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Generates a signed URL for retrieving an object from the AWS S3 bucket.
 *
 * @param {string} key The key of the object in the bucket.
 * @param {number} expirationTimeInSeconds The number of seconds before the URL expires.
 * @returns {Promise<string>} A signed URL for retrieving the object.
 */
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

/**
 * Generates a presigned URL for uploading an object to the AWS S3 bucket.
 *
 * @param {Object} data An object containing the file name and content type.
 * @returns {Promise<string>} A presigned URL for uploading the object.
 */
export const getPresignedUrl = async (data) => {
  const { fileName, contentType } = data;

  const command = new PutObjectCommand({
    Bucket: AWS_SECRET_BUCKET_NAME,
    Key: `/${fileName}`,
    ContentType: contentType,
  });

  const url = getSignedUrl(s3Client, command);
  return url;
};

/**
 * Deletes an object from the AWS S3 bucket.
 *
 * @param {string} key The key of the object to delete.
 * @returns {Promise<Object>} The response from the S3 client.
 */
export const deleteObject = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: AWS_SECRET_BUCKET_NAME,
    Key: key,
  });

  const res = await s3Client.send(command);
  return res;
};
