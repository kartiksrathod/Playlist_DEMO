import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';
import { toast } from 'sonner';

const KeyboardShortcutsHelp = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { keys: ['Space'], description: 'Play / Pause', icon: '⏯️' },
    { keys: ['→'], description: 'Next track', icon: '⏭️' },
    { keys: ['←'], description: 'Previous track', icon: '⏮️' },
    { keys: ['↑'], description: 'Volume up (+5%)', icon: '🔊' },
    { keys: ['↓'], description: 'Volume down (-5%)', icon: '🔉' },
    { keys: ['M'], description: 'Mute / Unmute', icon: '🔇' },
    { keys: ['S'], description: 'Toggle shuffle', icon: '🔀' },
    { keys: ['R'], description: 'Toggle repeat', icon: '🔁' },
    { keys: ['?'], description: 'Show this help', icon: '❓' },
  ];

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 p-3 bg-slate-800/90 hover:bg-slate-700 text-white rounded-full shadow-2xl backdrop-blur-md border border-slate-600/50 transition-colors"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Keyboard Shortcuts"
      >
        <Keyboard className="w-5 h-5" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Content */}
            <motion.div
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600/20 rounded-lg">
                        <Keyboard className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          Keyboard Shortcuts
                        </h2>
                        <p className="text-sm text-slate-400">
                          Control music with your keyboard
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Shortcuts List */}
                <div className="p-6 max-h-96 overflow-y-auto">
                  <div className="space-y-3">
                    {shortcuts.map((shortcut, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg hover:bg-slate-800/60 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{shortcut.icon}</span>
                          <span className="text-slate-300">
                            {shortcut.description}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {shortcut.keys.map((key, i) => (
                            <kbd
                              key={i}
                              className="px-2 py-1 bg-slate-700 text-slate-200 rounded text-sm font-mono border border-slate-600 shadow-sm min-w-[2rem] text-center"
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
                  <p className="text-xs text-slate-500 text-center">
                    Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">?</kbd> anytime to show this help
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcutsHelp;
