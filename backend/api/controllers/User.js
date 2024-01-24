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
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
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