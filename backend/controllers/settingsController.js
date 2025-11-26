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
        volume: 75,
        autoPlay: true,
        autoShuffle: false,
        shuffle: false,
        repeat: 'off',
        crossfade: false,
        quality: 'high',
        notifications: true,
        theme: 'dark',
      });
      await settings.save();
    }

    res.json({
      id: settings.id,
      volume: settings.volume,
      autoPlay: settings.autoPlay,
      autoShuffle: settings.autoShuffle || false,
      shuffle: settings.shuffle,
      repeat: settings.repeat,
      crossfade: settings.crossfade || false,
      quality: settings.quality || 'high',
      notifications: settings.notifications !== undefined ? settings.notifications : true,
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
    const { volume, autoPlay, autoShuffle, shuffle, repeat, theme, crossfade, quality, notifications } = req.body;

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

    // Validate quality if provided
    if (quality !== undefined && !['low', 'medium', 'high'].includes(quality)) {
      return res.status(400).json({ error: "Quality must be 'low', 'medium', or 'high'" });
    }

    // Find or create settings
    let settings = await UserSettings.findOne({ id: userId });

    if (!settings) {
      settings = new UserSettings({
        id: userId,
        volume: volume !== undefined ? volume : 75,
        autoPlay: autoPlay !== undefined ? autoPlay : true,
        autoShuffle: autoShuffle !== undefined ? autoShuffle : false,
        shuffle: shuffle !== undefined ? shuffle : false,
        repeat: repeat || 'off',
        crossfade: crossfade !== undefined ? crossfade : false,
        quality: quality || 'high',
        notifications: notifications !== undefined ? notifications : true,
        theme: theme || 'dark',
      });
    } else {
      // Update only provided fields
      if (volume !== undefined) settings.volume = volume;
      if (autoPlay !== undefined) settings.autoPlay = autoPlay;
      if (autoShuffle !== undefined) settings.autoShuffle = autoShuffle;
      if (shuffle !== undefined) settings.shuffle = shuffle;
      if (repeat !== undefined) settings.repeat = repeat;
      if (crossfade !== undefined) settings.crossfade = crossfade;
      if (quality !== undefined) settings.quality = quality;
      if (notifications !== undefined) settings.notifications = notifications;
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
        autoShuffle: settings.autoShuffle,
        shuffle: settings.shuffle,
        repeat: settings.repeat,
        crossfade: settings.crossfade,
        quality: settings.quality,
        notifications: settings.notifications,
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
        volume: 75,
        autoPlay: true,
        autoShuffle: false,
        shuffle: false,
        repeat: 'off',
        crossfade: false,
        quality: 'high',
        notifications: true,
        theme: 'dark',
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
        autoShuffle: settings.autoShuffle,
        shuffle: settings.shuffle,
        repeat: settings.repeat,
        crossfade: settings.crossfade,
        quality: settings.quality,
        notifications: settings.notifications,
        theme: settings.theme,
        lastUpdated: settings.lastUpdated,
      },
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({ error: 'Failed to reset settings' });
  }
};
