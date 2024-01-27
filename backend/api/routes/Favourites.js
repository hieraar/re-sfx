const express = require("express");
const { addToFav } = require("../controllers/Favourites");
const router = express.Router();

router.post('/addtofavourite/:soundId', addToFav);

module.exports = router;