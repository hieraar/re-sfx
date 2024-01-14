require('dotenv').config()

// Import the express module
const express = require('express');

// Create an instance of the express application
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, Express!');
  });


// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port 3000`);
});


