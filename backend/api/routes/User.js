const express = require("express");
const { updateUserData, refreshAccessToken, userSignUp, userSignIn,getUserById  } = require("../controllers/User");
const router = express.Router();
const { authenticateToken } = require('..//middleware/authToken');

router.post("/signup", userSignUp);
router.post("/signin", userSignIn);
router.post("/refresh-token", refreshAccessToken);
router.get("/",[authenticateToken], getUserById);
router.put("/updatedata",[authenticateToken], updateUserData);

module.exports = router;