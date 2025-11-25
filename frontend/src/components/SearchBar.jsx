import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ placeholder = 'Search playlists...', value, onChange }) => {
  return (
    <div className="relative w-full max-w-xl">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-12 pr-4 py-3 bg-slate-900/60 backdrop-blur-xl border border-blue-700/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm text-white placeholder-blue-200/40 shadow-lg"
      />
    </div>
  );
};

export default SearchBar;
