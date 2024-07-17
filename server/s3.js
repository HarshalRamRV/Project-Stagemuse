import { readFileSync } from 'fs';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import S3 from 'aws-sdk/clients/s3.js';

// Get the current module's file path
const __filename = fileURLToPath(import.meta.url);

// Derive the .env file path based on the current file's location
const envFilePath = __filename.replace('/s3.js', '/.env');

const dotenvContent = readFileSync(envFilePath);
const envConfig = Object.fromEntries(dotenvContent.toString().split('\n').map((line) => line.split('=')));
Object.assign(process.env, envConfig);

const bucketName = "";
const region = "";
const accessKeyId = "";
const secretAccessKey = "";

console.log("bucketName:", bucketName); // Debug: Check if bucketName is set correctly

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});


async function uploadFile(file) {
  try {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.filename,
    };
    // console.log("uploadParams:", uploadParams);
    return await s3.upload(uploadParams).promise();
  } catch (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
}

export { uploadFile };

// Downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  };

  return s3.getObject(downloadParams).createReadStream();
}
export { getFileStream };
