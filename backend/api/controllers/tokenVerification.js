const User = require("../models/User");

exports.tokenVerification = async (req, res) => {
  const verificationToken = req.query.token;

  try {
    // Find the user in the database based on the verification token
    const user = await User.findOne({ verificationToken });

    if (user) {
      // Update the user's status to verified
      user.isVerified = true;
      user.verificationToken = undefined; // Optional: Clear the verification token
      await user.save();

      // Respond to the user with a success message or redirect to a success page
      res.send('Email verification successful!');
    } else {
      // If the verification token is not valid, respond with an error message or redirect to an error page
      res.status(404).send('Invalid verification token.');
    }
  } catch (error) {
    // Handle any database or other errors
    console.error('Error during verification:', error);
    res.status(500).send('Internal Server Error');
  }
};




