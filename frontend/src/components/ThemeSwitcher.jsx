import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { getThemePreviews } from '@/config/themes';
import { toast } from 'sonner';

const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, changeTheme, themeConfig } = useTheme();
  const themePreviews = getThemePreviews();

  const handleThemeChange = (themeId) => {
    changeTheme(themeId);
    toast.success(`Theme changed to ${themeId}`);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      {/* Theme Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Change Theme"
      >
        <Palette className="w-6 h-6 text-white" />
      </motion.button>

      {/* Theme Selection Popup */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{ zIndex: 40 }}
            />

            {/* Theme Grid Popup */}
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 w-[90vw] max-w-4xl max-h-[85vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.8, y: -100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ zIndex: 50 }}
            >
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <Palette className="w-7 h-7 text-violet-400" />
                  <h2 className="text-3xl font-bold text-white">Choose Your Theme</h2>
                </div>
                <p className="text-slate-300">Select a theme to personalize your experience</p>
              </div>

              {/* Theme Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {themePreviews.map((theme, index) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`relative group rounded-2xl overflow-hidden border-2 transition-all ${
                      currentTheme === theme.id
                        ? 'border-violet-400 ring-4 ring-violet-400/30 shadow-lg shadow-violet-500/50'
                        : 'border-slate-700 hover:border-violet-500/50'
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Theme Preview */}
                    <div className={`h-32 ${theme.preview}`}></div>

                    {/* Theme Info */}
                    <div className="p-4 bg-slate-800/80 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="font-semibold text-white text-sm mb-1">{theme.name}</div>
                          <div className="text-xs text-slate-400">{theme.description}</div>
                        </div>
                        {currentTheme === theme.id && (
                          <Check className="w-5 h-5 text-violet-400 flex-shrink-0" />
                        )}
                      </div>
                    </div>

                    {/* Selected Indicator - Animated Badge */}
                    {currentTheme === theme.id && (
                      <motion.div
                        className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center shadow-lg"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Check className="w-5 h-5 text-white" />
                      </motion.div>
                    )}

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-violet-600/0 to-violet-600/0 group-hover:from-violet-600/20 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
                  </motion.button>
                ))}
              </div>

              {/* Close Button */}
              <motion.button
                onClick={() => setIsOpen(false)}
                className="mt-8 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;
