const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { sendVerificationEmail } = require("../function/emailVerification");
dotenv.config({ path: "./.env" });
const {getUserIDByAuth} = require('../function/getUserIDByAuth')

exports.userSignUp = async (req, res) => {
  const { name, username, email, password, soundCount, image } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique token for email verification
    const verificationToken = jwt.sign({ email }, process.env.JWT_VERIFICATION_SECRET, {
      expiresIn: '1d', // Token expires in 1 day
    });

    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists',
      });
    }

    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      return res.status(400).json({
        success: false,
        error: 'Username already exists',
      });
    }

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      soundCount,
      image,
      verificationToken, // Save the verification token in the user document
    });

    // Send a verification email to the user
    sendVerificationEmail(email, verificationToken);

    return res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully. Please check your email for verification.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

exports.userSignIn = async (req, res) => {
  const { identifier, password } = req.body; 
  try {
    // Check if the identifier is an email or username
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or username, please try again" });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(401).json({ message: "Account not verified. Please check your email for verification instructions." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password, please try again" });
    }

    // Create a JWT token with user _id as a claim
    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    // Set the token in a cookie
    res.cookie('token', token, {
      httpOnly: false,
      maxAge: 3 * 60 * 60 * 1000, // 3 hours in milliseconds
      sameSite: 'Strict', // Adjust as needed based on your security requirements
    });

    // Exclude password from the response
    user.password = undefined;
    user.verificationToken = token

    // Send response with token and user information
    res.status(200).json({ message: "Sign-in successful", user, role: "user" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  const userId = getUserIDByAuth(req?.headers?.['authorization']?.split(' ')?.[1]);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      name: user.name,
      username: user.username,
      email: user.email,
      soundCount: user.soundCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// bug wrong logic
exports.updateUserData = async (req, res) =>{
  const userId = getUserIDByAuth(req?.headers?.['authorization']?.split(' ')?.[1]);
  const { newName, newUserName, newEmail} = req.body; 
  try {
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({ message: "User not found"});
    }
    
    user.name= newName;
    user.username= newUserName;
    user.email= newEmail;

    await user.save(); 
    res.status(200).json({
      message: "User data updated successfully",
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}