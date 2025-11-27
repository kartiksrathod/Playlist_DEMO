import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/AppLayout';
import { Settings as SettingsIcon, Music, Bell, Database, HelpCircle, Palette, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';
import { getThemePreviews } from '@/config/themes';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Settings = () => {
  const { themeConfig, currentTheme, changeTheme } = useTheme();
  const themePreviews = getThemePreviews();
  
  const [settings, setSettings] = useState({
    autoplay: true,
    notifications: true,
    volume: 75,
    quality: 'high',
    autoShuffle: false,
    crossfade: false,
  });
  
  const [loading, setLoading] = useState(true);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/settings`);
      if (response.ok) {
        const data = await response.json();
        setSettings({
          autoplay: data.autoPlay,
          autoShuffle: data.autoShuffle,
          crossfade: data.crossfade,
          volume: data.volume,
          quality: data.quality,
          notifications: data.notifications,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateBackendSettings = async (updatedSettings) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          autoPlay: updatedSettings.autoplay,
          autoShuffle: updatedSettings.autoShuffle,
          crossfade: updatedSettings.crossfade,
          volume: updatedSettings.volume,
          quality: updatedSettings.quality,
          notifications: updatedSettings.notifications,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to save settings');
      throw error;
    }
  };

  const handleToggle = async (key) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key]
    };
    
    setSettings(newSettings);
    
    try {
      await updateBackendSettings(newSettings);
      toast.success('Setting updated successfully');
    } catch (error) {
      // Revert on error
      setSettings(settings);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setSettings(prev => ({
      ...prev,
      volume: newVolume
    }));
  };

  const handleVolumeChangeComplete = async () => {
    try {
      await updateBackendSettings(settings);
    } catch (error) {
      // Volume already updated in UI, just log error
      console.error('Failed to save volume:', error);
    }
  };

  const handleQualityChange = async (quality) => {
    const newSettings = {
      ...settings,
      quality
    };
    
    setSettings(newSettings);
    
    try {
      await updateBackendSettings(newSettings);
      toast.success(`Audio quality set to ${quality}`);
    } catch (error) {
      // Revert on error
      setSettings(settings);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen px-8 py-8 flex items-center justify-center">
          <div className={themeConfig.classes.text.secondary}>Loading settings...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div 
              className={`p-2 rounded-xl bg-gradient-to-br ${themeConfig.classes.gradient}`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <SettingsIcon className={`w-6 h-6 ${themeConfig.classes.text.primary}`} />
            </motion.div>
            <h1 className={`text-4xl font-light ${themeConfig.classes.text.primary}`}>Settings</h1>
          </div>
          <p className={`${themeConfig.classes.text.secondary} font-light ml-14`}>Customize your music experience</p>
        </motion.div>

        <div className="max-w-4xl">
          {/* Theme Settings */}
          <motion.div 
            className={`${themeConfig.classes.card} rounded-2xl shadow-sm p-8 mb-6`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Palette className={`w-5 h-5 ${themeConfig.classes.accent}`} />
              <h2 className={`text-xl font-medium ${themeConfig.classes.text.primary}`}>Theme</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {themePreviews.map((theme, index) => (
                <motion.button
                  key={theme.id}
                  onClick={() => {
                    changeTheme(theme.id);
                    toast.success(`Theme changed to ${theme.name}`);
                  }}
                  className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                    currentTheme === theme.id
                      ? `border-${themeConfig.classes.accent.split('-')[1]}-500 ring-2 ring-${themeConfig.classes.accent.split('-')[1]}-500/30`
                      : 'border-transparent hover:border-gray-400'
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Theme Preview */}
                  <div className={`h-20 ${theme.preview}`}></div>
                  
                  {/* Theme Info */}
                  <div className={`p-3 ${themeConfig.classes.card.split(' ')[0]}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-left flex-1 min-w-0">
                        <div className={`font-semibold text-xs ${themeConfig.classes.text.primary} truncate`}>
                          {theme.name}
                        </div>
                      </div>
                      {currentTheme === theme.id && (
                        <Check className={`w-4 h-4 ${themeConfig.classes.accent} flex-shrink-0`} />
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Playback Settings */}
          <motion.div 
            className={`${themeConfig.classes.card} rounded-2xl shadow-sm p-8 mb-6`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Music className={`w-5 h-5 ${themeConfig.classes.accent}`} />
              <h2 className={`text-xl font-medium ${themeConfig.classes.text.primary}`}>Playback</h2>
            </div>
            
            <div className="space-y-6">
              {/* Autoplay */}
              <div className={`flex items-center justify-between py-3 border-b ${themeConfig.classes.card.includes('border-') ? themeConfig.classes.card.split(' ').find(c => c.includes('border-')) : 'border-gray-100'}`}>
                <div>
                  <h3 className={`font-medium ${themeConfig.classes.text.primary}`}>Autoplay</h3>
                  <p className={`text-sm ${themeConfig.classes.text.secondary} font-light`}>Automatically play next track</p>
                </div>
                <button
                  onClick={() => handleToggle('autoplay')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${settings.autoplay ? `bg-gradient-to-r ${themeConfig.classes.gradient}` : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 ${themeConfig.classes.card.includes('bg-white') ? 'bg-white' : 'bg-white/90'} rounded-full transition-transform ${settings.autoplay ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              {/* Auto Shuffle */}
              <div className={`flex items-center justify-between py-3 border-b ${themeConfig.classes.card.includes('border-') ? themeConfig.classes.card.split(' ').find(c => c.includes('border-')) : 'border-gray-100'}`}>
                <div>
                  <h3 className={`font-medium ${themeConfig.classes.text.primary}`}>Auto Shuffle</h3>
                  <p className={`text-sm ${themeConfig.classes.text.secondary} font-light`}>Shuffle tracks automatically</p>
                </div>
                <button
                  onClick={() => handleToggle('autoShuffle')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${settings.autoShuffle ? `bg-gradient-to-r ${themeConfig.classes.gradient}` : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 ${themeConfig.classes.card.includes('bg-white') ? 'bg-white' : 'bg-white/90'} rounded-full transition-transform ${settings.autoShuffle ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              {/* Crossfade */}
              <div className={`flex items-center justify-between py-3 border-b ${themeConfig.classes.card.includes('border-') ? themeConfig.classes.card.split(' ').find(c => c.includes('border-')) : 'border-gray-100'}`}>
                <div>
                  <h3 className={`font-medium ${themeConfig.classes.text.primary}`}>Crossfade</h3>
                  <p className={`text-sm ${themeConfig.classes.text.secondary} font-light`}>Smooth transition between tracks</p>
                </div>
                <button
                  onClick={() => handleToggle('crossfade')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${settings.crossfade ? `bg-gradient-to-r ${themeConfig.classes.gradient}` : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 ${themeConfig.classes.card.includes('bg-white') ? 'bg-white' : 'bg-white/90'} rounded-full transition-transform ${settings.crossfade ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              {/* Volume */}
              <div className="py-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-medium ${themeConfig.classes.text.primary}`}>Default Volume</h3>
                  <span className={`text-sm font-medium ${themeConfig.classes.accent}`}>{settings.volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.volume}
                  onChange={handleVolumeChange}
                  onMouseUp={handleVolumeChangeComplete}
                  onTouchEnd={handleVolumeChangeComplete}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, currentColor 0%, currentColor ${settings.volume}%, rgba(128, 128, 128, 0.3) ${settings.volume}%, rgba(128, 128, 128, 0.3) 100%)`
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Audio Quality */}
          <motion.div 
            className={`${themeConfig.classes.card} rounded-2xl shadow-sm p-8 mb-6`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Database className={`w-5 h-5 ${themeConfig.classes.accent}`} />
              <h2 className={`text-xl font-medium ${themeConfig.classes.text.primary}`}>Audio Quality</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {['low', 'medium', 'high'].map((quality, index) => (
                <motion.button
                  key={quality}
                  onClick={() => handleQualityChange(quality)}
                  className={`py-4 px-6 rounded-xl border-2 transition-all ${
                    settings.quality === quality
                      ? `${themeConfig.classes.button.primary} border-transparent`
                      : `${themeConfig.classes.card} hover:opacity-80`
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className={`font-medium capitalize ${settings.quality === quality ? '' : themeConfig.classes.text.primary}`}>{quality}</div>
                    <div className={`text-xs mt-1 opacity-70 ${settings.quality === quality ? '' : themeConfig.classes.text.muted}`}>
                      {quality === 'low' && '96 kbps'}
                      {quality === 'medium' && '160 kbps'}
                      {quality === 'high' && '320 kbps'}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div 
            className={`${themeConfig.classes.card} rounded-2xl shadow-sm p-8 mb-6`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Bell className={`w-5 h-5 ${themeConfig.classes.accent}`} />
              <h2 className={`text-xl font-medium ${themeConfig.classes.text.primary}`}>Notifications</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className={`font-medium ${themeConfig.classes.text.primary}`}>Enable Notifications</h3>
                  <p className={`text-sm ${themeConfig.classes.text.secondary} font-light`}>Get updates about your playlists</p>
                </div>
                <button
                  onClick={() => handleToggle('notifications')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${settings.notifications ? `bg-gradient-to-r ${themeConfig.classes.gradient}` : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <motion.div 
                    className={`absolute top-0.5 left-0.5 w-5 h-5 ${themeConfig.classes.card.includes('bg-white') ? 'bg-white' : 'bg-white/90'} rounded-full`}
                    animate={{ x: settings.notifications ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Help & Support */}
          <motion.div 
            className={`${themeConfig.classes.card} rounded-2xl shadow-sm p-8`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className={`w-5 h-5 ${themeConfig.classes.accent}`} />
              <h2 className={`text-xl font-medium ${themeConfig.classes.text.primary}`}>Help & Support</h2>
            </div>
            
            <div className="space-y-4">
              <motion.button 
                className={`w-full text-left py-3 px-4 rounded-xl ${themeConfig.classes.button.secondary} transition-colors`}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={`font-medium ${themeConfig.classes.text.primary}`}>Documentation</div>
                <div className={`text-sm ${themeConfig.classes.text.secondary} font-light`}>Learn how to use the app</div>
              </motion.button>
              
              <motion.button 
                className={`w-full text-left py-3 px-4 rounded-xl ${themeConfig.classes.button.secondary} transition-colors`}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={`font-medium ${themeConfig.classes.text.primary}`}>Report a Bug</div>
                <div className={`text-sm ${themeConfig.classes.text.secondary} font-light`}>Help us improve</div>
              </motion.button>
              
              <motion.button 
                className={`w-full text-left py-3 px-4 rounded-xl ${themeConfig.classes.button.secondary} transition-colors`}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={`font-medium ${themeConfig.classes.text.primary}`}>Contact Support</div>
                <div className={`text-sm ${themeConfig.classes.text.secondary} font-light`}>Get help from our team</div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
