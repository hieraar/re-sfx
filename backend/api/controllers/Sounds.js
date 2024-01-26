const Sounds = require("../models/Sounds");
const azureStorage = require('../function/azureStorage');
const multer = require('multer');
const uuid = require('uuid');
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });
const connectionString = process.env.AZURE_CONN_STRING;
const containerName = process.env.AZURE_CONTAINER_NAME;
const accountUrl = process.env.AZURE_ACCOUNT_URL;
const { BlobServiceClient } = require('@azure/storage-blob');
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

exports.uploadSound = async (req, res) => {
    try {

        const userId = req.cookies.userId;
    
        if (!userId) {
          return res.status(401).json({ message: 'Unauthorized. User not signed in.' });
        }
    
        const file = req.file;
        const uniqueId = uuid.v4();
        const blobName = `${uniqueId}_${file.originalname}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const uploadResponse = await blockBlobClient.upload(file.buffer, file.size);
        const fileUrl = `${accountUrl}/${containerName}/${blobName}`;
    
        const owner = userId;
        const title = req.body.title;
        const description = req.body.description;
        const tags = JSON.parse(req.body.tags);
    
        
        // Save the file reference or metadata to your database
        // Example:
        const newSound = new Sounds({
          owner: owner,
          title: title,
          desc: description,
          tags: tags,
          link: fileUrl,
          cloudStorageRef: blobName,
        });
    
        await newSound.save();
    
        res.json({
          success: true,
          message: 'File uploaded successfully',
          data: {
            uploadResponse,
            fileUrl,
            fileName: file.originalname
          },
        });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Error uploading file', error: error.message });
      }
};

exports.deleteSound = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const soundId = req.params.soundId; // Assuming you pass the soundId as a route parameter

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized. User not signed in.' });
        }

        // Fetch sound details from the database
        const sound = await Sounds.findById(soundId);

        if (!sound) {
            return res.status(404).json({ message: 'Sound not found or unauthorized.' });
        }

        // Delete blob from Azure Blob Storage
        const blobName = sound.cloudStorageRef;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.delete();

        // Delete sound from the database
        await Sounds.findByIdAndDelete(soundId);

        res.json({
            success: true,
            message: 'Sound deleted successfully',
            data: {
                soundId,
                fileName: sound.title // You can customize this based on your schema
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting sound', error: error.message });
    }
};