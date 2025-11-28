import React from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SearchBar = ({ placeholder = 'Search playlists...', value, onChange }) => {
  const { themeConfig } = useTheme();
  
  return (
    <div className="relative w-full max-w-xl">
      <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${themeConfig.classes.accent}`} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-12 pr-4 py-3 ${themeConfig.classes.card} backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-sm ${themeConfig.classes.text.primary} placeholder-opacity-40 shadow-lg`}
      />
    </div>
  );
};

export default SearchBar;
