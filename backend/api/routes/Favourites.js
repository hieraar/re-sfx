const express = require("express");
const { addToFav } = require("../controllers/Favourites");
const { removeSoundbyId } = require("../controllers/Favourites");
const { getFavbyOwnerId } = require("../controllers/Favourites");
const { removeFavbyId } = require("../controllers/Favourites");
const { checkFav } = require("../controllers/Favourites");
const router = express.Router();

router.post('/addtofavourite/:soundId', addToFav);
router.post('/deletefromfav/:soundId', removeSoundbyId);
router.get('/getfav', getFavbyOwnerId);
router.delete('/delete/:favoriteListId', removeFavbyId);
router.get('/checksfavstate/:soundId', checkFav);

module.exports = router;