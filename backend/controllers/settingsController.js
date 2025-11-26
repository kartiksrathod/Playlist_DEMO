const UserSettings = require('../models/UserSettings');

// Get user settings
exports.getSettings = async (req, res) => {
  try {
    const userId = 'default-user'; // Single user for now

    // Find or create default settings
    let settings = await UserSettings.findOne({ id: userId });

    if (!settings) {
      // Create default settings if not exists
      settings = new UserSettings({
        id: userId,
        volume: 70,
        autoPlay: true,
        shuffle: false,
        repeat: 'off',
      });
      await settings.save();
    }

    res.json({
      id: settings.id,
      volume: settings.volume,
      autoPlay: settings.autoPlay,
      shuffle: settings.shuffle,
      repeat: settings.repeat,
      theme: settings.theme || 'dark',
      lastUpdated: settings.lastUpdated,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

// Update user settings
exports.updateSettings = async (req, res) => {
  try {
    const userId = 'default-user'; // Single user for now
    const { volume, autoPlay, shuffle, repeat, theme } = req.body;

    // Validate volume if provided
    if (volume !== undefined && (volume < 0 || volume > 100)) {
      return res.status(400).json({ error: 'Volume must be between 0 and 100' });
    }

    // Validate repeat if provided
    if (repeat !== undefined && !['off', 'one', 'all'].includes(repeat)) {
      return res.status(400).json({ error: "Repeat must be 'off', 'one', or 'all'" });
    }

    // Validate theme if provided
    if (theme !== undefined && !['dark', 'light', 'glass', 'vibrant', 'neon', 'retro', 'mesh', 'premium'].includes(theme)) {
      return res.status(400).json({ error: "Invalid theme value" });
    }

    // Find or create settings
    let settings = await UserSettings.findOne({ id: userId });

    if (!settings) {
      settings = new UserSettings({
        id: userId,
        volume: volume !== undefined ? volume : 70,
        autoPlay: autoPlay !== undefined ? autoPlay : true,
        shuffle: shuffle !== undefined ? shuffle : false,
        repeat: repeat || 'off',
        theme: theme || 'dark',
      });
    } else {
      // Update only provided fields
      if (volume !== undefined) settings.volume = volume;
      if (autoPlay !== undefined) settings.autoPlay = autoPlay;
      if (shuffle !== undefined) settings.shuffle = shuffle;
      if (repeat !== undefined) settings.repeat = repeat;
      if (theme !== undefined) settings.theme = theme;
      settings.lastUpdated = new Date();
    }

    await settings.save();

    res.json({
      message: 'Settings updated successfully',
      settings: {
        id: settings.id,
        volume: settings.volume,
        autoPlay: settings.autoPlay,
        shuffle: settings.shuffle,
        repeat: settings.repeat,
        theme: settings.theme,
        lastUpdated: settings.lastUpdated,
      },
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

// Reset settings to default
exports.resetSettings = async (req, res) => {
  try {
    const userId = 'default-user';

    const settings = await UserSettings.findOneAndUpdate(
      { id: userId },
      {
        volume: 70,
        autoPlay: true,
        shuffle: false,
        repeat: 'off',
        lastUpdated: new Date(),
      },
      { new: true, upsert: true }
    );

    res.json({
      message: 'Settings reset to default',
      settings: {
        id: settings.id,
        volume: settings.volume,
        autoPlay: settings.autoPlay,
        shuffle: settings.shuffle,
        repeat: settings.repeat,
        lastUpdated: settings.lastUpdated,
      },
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({ error: 'Failed to reset settings' });
  }
};
