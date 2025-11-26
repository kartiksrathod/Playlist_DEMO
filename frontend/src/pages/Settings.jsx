import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Settings as SettingsIcon, Music, Bell, Database, HelpCircle, Palette, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';
import { getThemePreviews } from '@/config/themes';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Settings = () => {
  const { currentTheme, changeTheme } = useTheme();
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

  const handleThemeChange = (themeId) => {
    changeTheme(themeId);
    toast.success(`Theme changed to ${themeId}`);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen px-8 py-8 flex items-center justify-center">
          <div className="text-gray-600">Loading settings...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-light text-gray-800">Settings</h1>
          </div>
          <p className="text-gray-600 font-light ml-14">Customize your music experience</p>
        </div>

        <div className="max-w-4xl">
          {/* Theme Selection */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-medium text-gray-800">Theme</h2>
            </div>
            
            <p className="text-sm text-gray-600 font-light mb-6">Choose your preferred visual theme</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {themePreviews.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                    currentTheme === theme.id
                      ? 'border-amber-500 ring-2 ring-amber-200'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  {/* Theme Preview */}
                  <div className={`h-24 ${theme.preview}`}></div>
                  
                  {/* Theme Info */}
                  <div className="p-3 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="font-medium text-gray-800 text-sm">{theme.name}</div>
                        <div className="text-xs text-gray-500 font-light">{theme.description}</div>
                      </div>
                      {currentTheme === theme.id && (
                        <Check className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                  
                  {/* Selected Indicator */}
                  {currentTheme === theme.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Playback Settings */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Music className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-medium text-gray-800">Playback</h2>
            </div>
            
            <div className="space-y-6">
              {/* Autoplay */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-800">Autoplay</h3>
                  <p className="text-sm text-gray-600 font-light">Automatically play next track</p>
                </div>
                <button
                  onClick={() => handleToggle('autoplay')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${settings.autoplay ? 'bg-amber-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.autoplay ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              {/* Auto Shuffle */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-800">Auto Shuffle</h3>
                  <p className="text-sm text-gray-600 font-light">Shuffle tracks automatically</p>
                </div>
                <button
                  onClick={() => handleToggle('autoShuffle')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${settings.autoShuffle ? 'bg-amber-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.autoShuffle ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              {/* Crossfade */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-800">Crossfade</h3>
                  <p className="text-sm text-gray-600 font-light">Smooth transition between tracks</p>
                </div>
                <button
                  onClick={() => handleToggle('crossfade')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${settings.crossfade ? 'bg-amber-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.crossfade ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              {/* Volume */}
              <div className="py-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-800">Default Volume</h3>
                  <span className="text-sm font-medium text-amber-600">{settings.volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.volume}
                  onChange={handleVolumeChange}
                  onMouseUp={handleVolumeChangeComplete}
                  onTouchEnd={handleVolumeChangeComplete}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #F59E0B 0%, #F59E0B ${settings.volume}%, #E5E7EB ${settings.volume}%, #E5E7EB 100%)`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Audio Quality */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-medium text-gray-800">Audio Quality</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {['low', 'medium', 'high'].map((quality) => (
                <button
                  key={quality}
                  onClick={() => handleQualityChange(quality)}
                  className={`py-4 px-6 rounded-xl border-2 transition-all ${
                    settings.quality === quality
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-medium capitalize">{quality}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {quality === 'low' && '96 kbps'}
                      {quality === 'medium' && '160 kbps'}
                      {quality === 'high' && '320 kbps'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-medium text-gray-800">Notifications</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-gray-800">Enable Notifications</h3>
                  <p className="text-sm text-gray-600 font-light">Get updates about your playlists</p>
                </div>
                <button
                  onClick={() => handleToggle('notifications')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${settings.notifications ? 'bg-amber-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.notifications ? 'translate-x-6' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-medium text-gray-800">Help & Support</h2>
            </div>
            
            <div className="space-y-4">
              <button className="w-full text-left py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-800">Documentation</div>
                <div className="text-sm text-gray-600 font-light">Learn how to use the app</div>
              </button>
              
              <button className="w-full text-left py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-800">Report a Bug</div>
                <div className="text-sm text-gray-600 font-light">Help us improve</div>
              </button>
              
              <button className="w-full text-left py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-800">Contact Support</div>
                <div className="text-sm text-gray-600 font-light">Get help from our team</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
