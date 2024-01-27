const { BlobServiceClient } = require('@azure/storage-blob');

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });


const connectionString = process.env.AZURE_CONN_STRING;

const containerName = process.env.AZURE_CONTAINER_NAME; 

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

async function uploadToAzureStorage(file) {
  const blobName = `${Date.now()}_${file.originalname}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const stream = file.stream;

  return new Promise((resolve, reject) => {
    const streamLength = file.size;
    const buffer = Buffer.alloc(streamLength);

    let bytesRead = 0;

    stream.on('data', (chunk) => {
      const chunkBuffer = Buffer.from(chunk);
      chunkBuffer.copy(buffer, bytesRead);
      bytesRead += chunkBuffer.length;
    });

    stream.on('end', async () => {
      try {
        const uploadResponse = await blockBlobClient.upload(buffer, streamLength);
        resolve(uploadResponse);
      } catch (error) {
        reject(error);
      }
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
}

module.exports = { uploadToAzureStorage };
