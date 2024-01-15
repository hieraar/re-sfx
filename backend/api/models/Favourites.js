const mongoose = require("mongoose");

const soundItemsSchema = new mongoose.Schema({
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: "User",
      },
    soundId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Sound", 
    },
    }
  );

const favSchema = new mongoose.Schema(
    {
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: "User",
      },
      soundList: {
        type: [soundItemsSchema],
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );
  
  module.exports = mongoose.model("Favourite", favSchema);