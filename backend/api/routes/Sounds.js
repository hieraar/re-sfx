const express = require("express");
const { uploadSound } = require("../controllers/Sounds");
const { deleteSound } = require("../controllers/Sounds");
const { getSoundById } = require("../controllers/Sounds");
const { getSoundsByOwner } = require("../controllers/Sounds");
const { downloadSound } = require("../controllers/Sounds");
const { playSoundById } = require("../controllers/Sounds");
const { getAllSounds } = require("../controllers/Sounds");
const multer = require('multer');
const router = express.Router();
const { authenticateToken } = require('..//middleware/authToken');
const fileFields = [
  { name: 'image', maxCount: 1 },
  { name: 'sound', maxCount: 1 }
];
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

router.post('/upload', [authenticateToken], upload.fields(fileFields), uploadSound);
router.delete('/delete/:soundId',[authenticateToken], deleteSound);
router.get('/getonesound/:soundId', [authenticateToken],getSoundById);
router.get('/getsounds',[authenticateToken], getSoundsByOwner);
router.get('/download/:soundId',[authenticateToken], downloadSound);
router.get('/play/:soundId',[authenticateToken], playSoundById);
router.get('/getallsound',[authenticateToken], getAllSounds);

module.exports = router;