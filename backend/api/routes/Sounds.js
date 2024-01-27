const express = require("express");
const { uploadSound } = require("../controllers/Sounds");
const { deleteSound } = require("../controllers/Sounds")
const multer = require('multer');
const router = express.Router();

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });


router.post('/upload', upload.single('file'), uploadSound);
router.delete('/delete/:soundId', deleteSound);

module.exports = router;