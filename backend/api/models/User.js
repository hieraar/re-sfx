const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      soundCount: {
        type: Number,
        required: true,
        default: 0,
      },
      image: {
        type: String,
        required: false,
        default:
          "https://cdn.vectorstock.com/i/preview-1x/77/30/default-avatar-profile-icon-grey-photo-placeholder-vector-17317730.jpg",
      },
    },
    {
      timestamps: true,
    }
  );
  
  module.exports = mongoose.model("User", customerSchema);