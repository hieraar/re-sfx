const express = require("express");
const { userSignUp } = require("../controllers/User");
const { userSignIn } = require("../controllers/User");
const { getUserById } = require("../controllers/User");
const { updateUserData } = require("../controllers/User");
const router = express.Router();

router.post("/signup", userSignUp);
router.post("/signin", userSignIn);
router.get("/:id", getUserById);
router.put("/:id/updatedata", updateUserData);

module.exports = router;