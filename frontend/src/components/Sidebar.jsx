import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ListMusic, Settings, User, Clock, Heart, Library } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { themeConfig } = useTheme();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: ListMusic, label: 'Playlists', path: '/playlists' },
    { icon: Library, label: 'Library', path: '/library' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: Clock, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.div 
      className="fixed left-0 top-0 h-screen w-20 bg-slate-950 border-r border-blue-800/30 flex flex-col items-center py-8 z-50 backdrop-blur-xl"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      {/* Logo */}
      <motion.div 
        className="mb-12"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-violet-700/60">
          <ListMusic className="w-6 h-6 text-white" />
        </div>
      </motion.div>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col gap-6">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group relative flex flex-col items-center gap-1 transition-all ${
                active ? 'opacity-100' : 'opacity-50 hover:opacity-80'
              }`}
              title={item.label}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: active ? 1 : 0.5 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ scale: 1.1, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className={`p-3 rounded-xl transition-all backdrop-blur-sm ${
                  active 
                    ? 'bg-gradient-to-br from-violet-600/40 to-fuchsia-600/40 text-violet-100 shadow-xl shadow-violet-700/40 border border-violet-600/30' 
                    : 'text-blue-200 hover:bg-blue-900/40 border border-transparent'
                }`}
                animate={active ? {
                  boxShadow: [
                    "0 10px 30px rgba(139, 92, 246, 0.4)",
                    "0 10px 40px rgba(139, 92, 246, 0.6)",
                    "0 10px 30px rgba(139, 92, 246, 0.4)",
                  ],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <span className="text-[10px] font-medium text-blue-100">{item.label}</span>
              
              {/* Active Indicator */}
              <AnimatePresence>
                {active && (
                  <motion.div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-violet-600 to-fuchsia-600 rounded-r-full shadow-xl shadow-violet-600/60"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    exit={{ scaleY: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>
    </motion.div>
  );
};

export default Sidebar;
