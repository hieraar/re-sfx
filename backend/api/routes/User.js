const express = require("express");
const { userSignUp } = require("../controllers/User");
const { userSignIn } = require("../controllers/User");
const { getUserById } = require("../controllers/User");
const { updateUserData } = require("../controllers/User");
const router = express.Router();
const { authenticateToken } = require('..//middleware/authToken');

router.post("/signup", userSignUp);
router.post("/signin", userSignIn);
router.get("/",[authenticateToken], getUserById);
router.put("/updatedata",[authenticateToken], updateUserData);

module.exports = router;