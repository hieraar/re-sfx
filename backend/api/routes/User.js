const express = require("express");
const { userSignUp } = require("../controllers/User");
const router = express.Router();

router.post("/signin", userSignUp);

module.exports = router;