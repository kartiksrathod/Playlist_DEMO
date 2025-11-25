import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ListMusic, Settings, User } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: ListMusic, label: 'Playlists', path: '/playlists' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-slate-950 border-r border-blue-800/30 flex flex-col items-center py-8 z-50 backdrop-blur-xl">
      {/* Logo */}
      <div className="mb-12">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-2xl shadow-blue-700/60">
          <ListMusic className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col gap-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group relative flex flex-col items-center gap-1 transition-all ${
                active ? 'opacity-100' : 'opacity-50 hover:opacity-80'
              }`}
              title={item.label}
            >
              <div className={`p-3 rounded-xl transition-all backdrop-blur-sm ${
                active 
                  ? 'bg-blue-700/40 text-blue-100 shadow-xl shadow-blue-700/40 border border-blue-600/30' 
                  : 'text-blue-200 hover:bg-blue-900/40 border border-transparent'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-blue-100">{item.label}</span>
              
              {/* Active Indicator */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full shadow-xl shadow-blue-600/60" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
