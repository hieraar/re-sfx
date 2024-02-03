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
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const jwt = require('jsonwebtoken');

exports.uploadSound = async (req, res) => {
  try {
    // Access the user information from the decoded token
    const userId = req.user ? req.user._id : null;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not authenticated' });
    }

    const file = req.file;
    const uniqueId = uuid.v4();
    const blobName = `${uniqueId}_${file.originalname}`;
    // Assuming containerClient is defined somewhere in your code
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadResponse = await blockBlobClient.upload(file.buffer, file.size);
    const fileUrl = `${accountUrl}/${containerName}/${blobName}`;

    const title = req.body.title;
    const description = req.body.description;
    const tags = JSON.parse(req.body.tags);

    // Save the file reference or metadata to your database
    const newSound = new Sounds({
      owner: userId, // Use the authenticated user's ID
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

exports.getSoundById = async (req, res) => {
    const soundId = req.params.soundId;
    try {
        const sounds = await Sounds.findById(soundId);
        if (!sounds) {
        return res.status(404).json({ message: "Sound not found" });
        }
        res.status(200).json({
        sounds,
        message: "Sound data retrieved succesfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getSoundsByOwner = async (req, res) => {
    try {
        const ownerId = req.cookies.userId;
    
        if (!ownerId) {
          return res.status(401).json({ message: 'Unauthorized. User not signed in.' });
        }
    
        // Find sounds with the same owner ID
        const sounds = await Sounds.find({ owner: ownerId });
    
        res.json({
          success: true,
          data: {
            sounds,
          },
        });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving sounds', error: error.message });
      }
};

exports.downloadSound = async (req, res) => {
    try {
        const soundId = req.params.soundId;
    
        // Fetch the sound record from the database based on the soundId
        const sound = await Sounds.findById(soundId);
    
        if (!sound) {
          return res.status(404).json({ message: 'Sound not found' });
        }
    
        const filename = `${sound.title}.mp3`; // Set the filename as the title with a .mp3 extension
    
        // Set the headers for triggering a file download
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'audio/mpeg');
    
        // Download the file as a stream
        const blobClient = containerClient.getBlobClient(sound.cloudStorageRef);
        const downloadBlockBlobResponse = await blobClient.download();
        const stream = downloadBlockBlobResponse.readableStreamBody;
    
        // Pipe the file stream to the response
        stream.pipe(res);
    
      } catch (error) {
        res.status(500).json({ success: false, message: 'Error downloading sound', error: error.message });
      }
};

exports.playSoundById = async (req, res) => {
    try {
        const soundId = req.params.soundId;
    
        // Fetch the sound record from the database based on the soundId
        const sound = await Sounds.findById(soundId);
    
        if (!sound) {
          return res.status(404).json({ message: 'Sound not found' });
        }
    
        // Set the headers for audio playback
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('Content-Type', 'audio/mpeg');
    
        // Send the audio file as a stream
        const blobClient = containerClient.getBlobClient(sound.cloudStorageRef);
        const downloadBlockBlobResponse = await blobClient.download();
        const stream = downloadBlockBlobResponse.readableStreamBody;
    
        // Pipe the audio stream to the response
        stream.pipe(res);
    
      } catch (error) {
        res.status(500).json({ success: false, message: 'Error playing sound', error: error.message });
      }
};

exports.getAllSounds = async (req, res) => {
    try {
        // Fetch all sounds from the database
        const sounds = await Sounds.find();
    
        if (sounds.length === 0) {
          return res.json({
            success: true,
            data: {
              sounds: [],
              message: 'No sounds found in the database',
            },
          });
        }
    
        res.json({
          success: true,
          data: {
            sounds,
          },
        });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving sounds', error: error.message });
      }
};