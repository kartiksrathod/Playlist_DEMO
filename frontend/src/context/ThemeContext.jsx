import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTheme } from '../config/themes';
import axios from 'axios';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
  const API = `${BACKEND_URL}/api`;

  const [currentTheme, setCurrentTheme] = useState('dark');
  const [themeConfig, setThemeConfig] = useState(getTheme('dark'));
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Load theme from backend on mount ONLY
  useEffect(() => {
    loadThemeFromBackend();
  }, []);

  // Update theme config and apply to body when currentTheme changes
  // BUT only after initial load to prevent overwriting user changes
  useEffect(() => {
    if (initialized) {
      setThemeConfig(getTheme(currentTheme));
      applyThemeToBody(currentTheme);
    }
  }, [currentTheme, initialized]);

  const loadThemeFromBackend = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      const savedTheme = response.data.theme || 'dark';
      console.log('Loaded theme from backend:', savedTheme);
      
      // Apply the theme immediately without triggering the useEffect
      setThemeConfig(getTheme(savedTheme));
      applyThemeToBody(savedTheme);
      setCurrentTheme(savedTheme);
      
      // Mark as initialized so future changes will apply
      setInitialized(true);
    } catch (error) {
      console.error('Error loading theme from backend:', error);
      // Default to dark theme on error
      const defaultTheme = 'dark';
      setThemeConfig(getTheme(defaultTheme));
      applyThemeToBody(defaultTheme);
      setCurrentTheme(defaultTheme);
      setInitialized(true);
    } finally {
      setIsLoading(false);
    }
  };

  const changeTheme = async (newTheme) => {
    try {
      console.log('changeTheme called with:', newTheme);
      console.log('Current theme before change:', currentTheme);
      
      // Apply theme immediately for instant visual feedback
      setThemeConfig(getTheme(newTheme));
      applyThemeToBody(newTheme);
      
      // Update state - this will trigger useEffect but that's ok since initialized is true
      setCurrentTheme(newTheme);
      console.log('Theme applied locally:', newTheme);

      // Save to backend (non-blocking)
      axios.put(`${API}/settings`, {
        theme: newTheme,
      }).then(() => {
        console.log(`Theme saved to backend: ${newTheme}`);
      }).catch((error) => {
        console.error('Error saving theme to backend:', error);
        // Don't revert - user experience is more important
        // The theme will still work locally even if backend save fails
      });

    } catch (error) {
      console.error('Error changing theme:', error);
    }
  };

  const applyThemeToBody = (theme) => {
    // Get theme config
    const config = getTheme(theme);
    
    console.log('Applying theme:', theme, config);
    
    // Remove all existing theme and background classes from body
    const bodyClasses = document.body.className.split(' ').filter(cls => 
      !cls.startsWith('bg-') && 
      !cls.startsWith('from-') && 
      !cls.startsWith('to-') && 
      !cls.startsWith('via-') &&
      !cls.includes('gradient') &&
      cls !== 'transition-colors' &&
      cls !== 'duration-300' &&
      cls !== 'backdrop-blur'
    );
    
    console.log('Filtered body classes:', bodyClasses);
    
    // Apply new theme body classes with transition
    if (config.classes.body) {
      const newClasses = config.classes.body.split(' ').filter(c => c.length > 0);
      const finalClasses = [...bodyClasses, ...newClasses, 'transition-colors', 'duration-300'].join(' ');
      
      console.log('Setting body classes to:', finalClasses);
      document.body.className = finalClasses;
    }
    
    // Also set a data attribute for theme ID for easy CSS targeting
    document.body.setAttribute('data-theme', theme);
    console.log('Set data-theme to:', theme);
    
    // Force a repaint to ensure the changes are visible
    void document.body.offsetHeight;
    
    console.log('Final body className:', document.body.className);
    console.log('Final data-theme:', document.body.getAttribute('data-theme'));
  };

  const value = {
    currentTheme,
    themeConfig,
    changeTheme,
    isLoading,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
