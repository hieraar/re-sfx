const mongoose = require("mongoose");

const tagItemSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true,
      },
    }
  );

const soundSchema = new mongoose.Schema(
    {
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: "User",
      },
      title: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
      tags: {
        type: [tagItemSchema],
        required: true,
      },
      desc: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: false,
        default:
          "https://cdn.pixabay.com/photo/2017/11/10/05/34/sound-2935466_1280.png",
      },
    },
    {
      timestamps: true,
    }
  );
  
  module.exports = mongoose.model("Sound", soundSchema);