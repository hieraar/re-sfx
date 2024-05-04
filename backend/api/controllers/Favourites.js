const Favourite = require("../models/Favourites");
const Sounds = require("../models/Sounds");
const User = require("../models/User");
const {getUserIDByAuth} = require('../function/getUserIDByAuth')

exports.addToFav = async (req, res) => {
    try {
        const userId = getUserIDByAuth(req?.headers?.['authorization']?.split(' ')?.[1]);
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
};

exports.removeSoundbyId = async (req, res) => {
  try {
    const userId = getUserIDByAuth(req?.headers?.['authorization']?.split(' ')?.[1]);
    const soundId = req.params.soundId;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the sound from the user's favorite list
    const favorite = await Favourite.findOneAndUpdate(
      { owner: userId },
      { $pull: { soundList: { soundId: soundId } } },
      { new: true }
    );

    if (!favorite) {
      return res.status(404).json({ message: 'User does not have the sound in the favorite list' });
    }

    res.json({
      success: true,
      message: 'Sound removed from favorites successfully',
      data: {
        favorite,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing sound from favorites', error: error.message });
  }
};

exports.getFavbyOwnerId = async (req, res) => {
  try {
    const userId = getUserIDByAuth(req?.headers?.['authorization']?.split(' ')?.[1]);

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the user's favorite list
    const favorite = await Favourite.findOne({ owner: userId });

    if (!favorite) {
      return res.status(404).json({ message: 'User does not have a favorite list' });
    }

    const soundMetadata = await Promise.all(
      favorite.soundList.map(async (soundItem) => {
        const soundId = soundItem.soundId;
        const sound = await Sounds.findById(soundId);
        return sound;
      })
    );

    res.json({
      success: true,
      favid : favorite._id,
      data: {
        soundMetadata,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving favorite list', error: error.message });
  }
};

exports.removeFavbyId = async (req, res) => {
  try {
    const favoriteListId = req.params.favoriteListId;

    // Check if the favorite list exists
    const favorite = await Favourite.findByIdAndDelete(favoriteListId);

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite list not found' });
    }

    res.json({
      success: true,
      message: 'Favorite list removed successfully',
      data: {
        favorite,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing favorite list', error: error.message });
  }
};

exports.checkFav = async (req, res) => {
  try {
    const userId = getUserIDByAuth(req?.headers?.['authorization']?.split(' ')?.[1]);
    const soundId = req.params.soundId;

    // Check if the user's favorite list contains the specified sound
    const favorite = await Favourite.findOne({ owner: userId, 'soundList.soundId': soundId });

    res.json({
      success: true,
      data: {
        isFavorite: !!favorite,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error checking favorite status', error: error.message });
  }
};