const dotenv = require("dotenv");
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const connectDB = require("./config/db.js");


app.use(express.json());
app.use(express.static("public"));

dotenv.config({ path: "./.env" });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, Express!');
  });

connectDB();

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port 3000`);
});





