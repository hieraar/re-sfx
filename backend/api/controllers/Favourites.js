const Favourite = require("../models/Favourites");
const Sounds = require("../models/Sounds");
const User = require("../models/User");

exports.addToFav = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const soundId = req.params.soundId;
    
        // Check if the user and sound exist
        const user = await User.findById(userId);
        const sound = await Sounds.findById(soundId);
    
        if (!user || !sound) {
          return res.status(404).json({ message: 'User or Sound not found' });
        }
    
        // Check if the sound is already in the user's favorite list
        const existingFavorite = await Favourite.findOne({ owner: userId, 'soundList.soundId': soundId });
    
        if (existingFavorite) {
          return res.status(400).json({ message: 'Sound is already in the favorite list' });
        }
    
        // Add the sound to the user's favorite list with the uploader field automatically filled with the userId
        const favorite = await Favourite.findOneAndUpdate(
          { owner: userId },
          { $push: { soundList: { uploader: userId, soundId: soundId } } },
          { upsert: true, new: true }
        );
    
        res.json({
          success: true,
          message: 'Sound added to favorites successfully',
          data: {
            favorite,
          },
        });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding sound to favorites', error: error.message });
      }
}