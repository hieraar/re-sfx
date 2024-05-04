const dotenv = require("dotenv");
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const session = require('express-session');
const connectDB = require("./config/db.js");
const multer = require('multer');
const cors = require('cors');
const uuid = require('uuid');
const azureStorage = require('./api/function/azureStorage.js');
const Sounds = require("./api/models/Sounds.js");
const { BlobServiceClient } = require('@azure/storage-blob');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Use dotenv to load environment variables
dotenv.config({ path: "./.env" });


// Set up middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
const allowedOrigins = ['http://localhost:3000', 'https://fe-re-sfx.vercel.app'];

const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));



// Set up static file serving
app.use(express.static("public"));

// Set up session middleware
// app.use(
//   session({
//     secret: process.env.JWT_SECRET, // Replace with a secure secret key
//     resave: false,
//     saveUninitialized: true,
//   })
// );

app.use(cookieParser());

app.use((req, res, next) => {
  // Check for the presence of the 'token' cookie
  const token = req.cookies.token;
  console.log('Token from cookies:', req.cookies.token);

  if (token) {
    try {
      // Verify and decode the token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the decoded token to the request for further use
      req.user = decodedToken;
      console.log('Decoded token:', req.user);

    } catch (error) {
      // Handle token verification errors, if any
      console.error('JWT verification error:', error.message);
    }
  }

  next();
});

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Connect to MongoDB (or your database)
connectDB();

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// Import and use your routes
const UserRouter = require("./api/routes/User.js");
const verificationRouter = require("./api/routes/tokenVerification.js");
const SoundsRouter = require("./api/routes/Sounds.js")
const FavouritesROuter = require("./api/routes/Favourites.js")
app.use("/", verificationRouter);
app.use("/user", UserRouter);
app.use("/sounds", SoundsRouter);
app.use("/fav", FavouritesROuter);
