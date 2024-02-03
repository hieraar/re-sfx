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

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), uploadSound, authenticateToken);
router.delete('/delete/:soundId', deleteSound);
router.get('/getonesound/:soundId', getSoundById);
router.get('/getsounds', getSoundsByOwner);
router.get('/download/:soundId', downloadSound);
router.get('/play/:soundId', playSoundById);
router.get('/getallsound', getAllSounds);

module.exports = router;