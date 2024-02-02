const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

async function sendVerificationEmail(email, verificationToken) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD, 
      },
    });

    // Use a placeholder localhost URL with the appropriate port
    const localhostURL = 'https://re-sfx-api.vercel.app'; 

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Account Verification',
      html: `
        <p>Thank you for signing up! Please click the link below to verify your email:</p>
        <a href="${localhostURL}/verify?token=${verificationToken}">Verify Email</a>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    // Handle error appropriately (e.g., log it or send a response to the user)
  }
}

module.exports = { sendVerificationEmail };

