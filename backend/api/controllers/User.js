const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.userSignUp = async (req, res) => {
    const { name, username, email, password, soundCount, image } =
      req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const checkEmail = await User.findOne({ email });
      if (checkEmail) {
        return res.status(400).json({
          success: false,
          error: "Email already exists",
        });
      }
      const checkUsername = await User.findOne({ username });
      if (checkUsername) {
        return res.status(400).json({
          success: false,
          error: "Username already exists",
        });
      }
      const user = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        soundCount,
        image,
      });
      return res.status(201).json({
        success: true,
        data: user,
        message: "User created succesfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  };

  exports.userSignIn = async (req, res) => {
    const { identifier, password } = req.body; 
    try {
      // Check if the identifier is an email
      const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
  
      if (!user) {
        return res.status(401).json({ message: "Invalid email or username, please try again" });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid password, please try again" });
      }
  
      const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });
  
      user.password = undefined;
  
      res
        .status(200)
        .json({ message: "Sign-in successful", user, token, role: "user" });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

exports.getUserById = async (req, res) => {
  const userId = req.params.id;
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
      message: "Customer data retrieved succesfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserData = async (req, res) =>{
  const userId = req.params.id;
  const { newName, newUserName, newEmail} = req.body; 
  try {
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({ message: "User not found"});
    }
    
    user.name= newName;
    user.username= newUserName;
    user.email=newEmail;

    await user.save(); 
    res.status(200).json({
      message: "User data updated successfully",
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}