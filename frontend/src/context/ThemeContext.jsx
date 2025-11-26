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

  // Load theme from backend on mount
  useEffect(() => {
    loadThemeFromBackend();
  }, []);

  // Update theme config when currentTheme changes
  useEffect(() => {
    setThemeConfig(getTheme(currentTheme));
    applyThemeToBody(currentTheme);
  }, [currentTheme]);

  const loadThemeFromBackend = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      const savedTheme = response.data.theme || 'dark';
      setCurrentTheme(savedTheme);
    } catch (error) {
      console.error('Error loading theme from backend:', error);
      // Default to dark theme on error
      setCurrentTheme('dark');
    } finally {
      setIsLoading(false);
    }
  };

  const changeTheme = async (newTheme) => {
    try {
      // Update locally immediately for instant feedback
      setCurrentTheme(newTheme);

      // Save to backend
      await axios.put(`${API}/settings`, {
        theme: newTheme,
      });

      console.log(`Theme changed to: ${newTheme}`);
    } catch (error) {
      console.error('Error saving theme to backend:', error);
      // Revert on error
      loadThemeFromBackend();
    }
  };

  const applyThemeToBody = (theme) => {
    // Remove all theme classes from body
    document.body.className = '';
    
    // Get theme config
    const config = getTheme(theme);
    
    // Apply body background class
    if (config.classes.body) {
      document.body.className = config.classes.body;
    }
  };

  const value = {
    currentTheme,
    themeConfig,
    changeTheme,
    isLoading,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
