const express = require("express");
const { tokenVerification } = require("../controllers/tokenVerification");
const router = express.Router();

router.get('/verify', tokenVerification);

module.exports = router;