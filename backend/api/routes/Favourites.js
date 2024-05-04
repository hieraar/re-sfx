const express = require("express");
const { addToFav } = require("../controllers/Favourites");
const { removeSoundbyId } = require("../controllers/Favourites");
const { getFavbyOwnerId } = require("../controllers/Favourites");
const { removeFavbyId } = require("../controllers/Favourites");
const { checkFav } = require("../controllers/Favourites");
const router = express.Router();
const { authenticateToken } = require('..//middleware/authToken');

router.post('/addtofavourite/:soundId',[authenticateToken], addToFav);
router.post('/deletefromfav/:soundId',[authenticateToken], removeSoundbyId);
router.get('/getfav',[authenticateToken], getFavbyOwnerId);
router.delete('/delete/:favoriteListId',[authenticateToken], removeFavbyId);
router.get('/checksfavstate/:soundId',[authenticateToken], checkFav);

module.exports = router;