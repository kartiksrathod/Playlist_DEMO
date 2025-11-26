// Theme configuration for the Music Playlist Manager
// Each theme defines background, text colors, and component styles

export const themes = {
  dark: {
    id: 'dark',
    name: 'Dark',
    description: 'Classic dark theme with blue accents',
    preview: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
    classes: {
      body: 'bg-slate-950',
      sidebar: 'bg-slate-900 border-slate-800',
      card: 'bg-slate-900/60 border-slate-800/50',
      text: {
        primary: 'text-white',
        secondary: 'text-slate-300',
        muted: 'text-slate-400',
      },
      button: {
        primary: 'bg-blue-700 hover:bg-blue-600 text-white',
        secondary: 'bg-slate-800 hover:bg-slate-700 text-white',
      },
      accent: 'text-blue-400',
      gradient: 'from-blue-600 to-indigo-600',
    },
  },
  
  light: {
    id: 'light',
    name: 'Light',
    description: 'Clean light theme with soft colors',
    preview: 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
    classes: {
      body: 'bg-gray-50',
      sidebar: 'bg-white border-gray-200',
      card: 'bg-white border-gray-200',
      text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-700',
        muted: 'text-gray-500',
      },
      button: {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
      },
      accent: 'text-blue-600',
      gradient: 'from-blue-500 to-purple-500',
    },
  },
  
  glass: {
    id: 'glass',
    name: 'Glass',
    description: 'Glassmorphism with vibrant gradients',
    preview: 'bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400',
    classes: {
      body: 'bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400',
      sidebar: 'backdrop-blur-xl bg-white/10 border-white/20',
      card: 'backdrop-blur-lg bg-white/20 border-white/30',
      text: {
        primary: 'text-white',
        secondary: 'text-white/90',
        muted: 'text-white/70',
      },
      button: {
        primary: 'bg-white/30 backdrop-blur-md hover:bg-white/40 text-white border-white/40',
        secondary: 'bg-white/20 backdrop-blur-md hover:bg-white/30 text-white',
      },
      accent: 'text-white',
      gradient: 'from-white/30 to-white/10',
    },
  },
  
  vibrant: {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Bold colors and playful design',
    preview: 'bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-500',
    classes: {
      body: 'bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-500',
      sidebar: 'bg-gradient-to-b from-purple-600 to-pink-600 border-purple-500',
      card: 'bg-white/90 border-purple-300',
      text: {
        primary: 'text-purple-900',
        secondary: 'text-purple-800',
        muted: 'text-purple-600',
      },
      button: {
        primary: 'bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold',
        secondary: 'bg-white/30 hover:bg-white/40 text-white font-bold',
      },
      accent: 'text-yellow-400',
      gradient: 'from-yellow-400 to-pink-400',
    },
  },
  
  neon: {
    id: 'neon',
    name: 'Neon',
    description: 'Futuristic neon-lit dark theme',
    preview: 'bg-gradient-to-br from-black via-gray-900 to-black',
    classes: {
      body: 'bg-black',
      sidebar: 'bg-gray-900 border-cyan-500/30',
      card: 'bg-gray-900 border-cyan-500/30',
      text: {
        primary: 'text-cyan-300',
        secondary: 'text-purple-300',
        muted: 'text-gray-400',
      },
      button: {
        primary: 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-lg shadow-cyan-500/50',
        secondary: 'bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-cyan-500/30',
      },
      accent: 'text-cyan-400',
      gradient: 'from-cyan-500 to-purple-500',
    },
  },
  
  retro: {
    id: 'retro',
    name: 'Retro',
    description: 'Vintage 80s inspired theme',
    preview: 'bg-gradient-to-br from-orange-200 via-pink-200 to-purple-300',
    classes: {
      body: 'bg-gradient-to-br from-orange-200 via-pink-200 to-purple-300',
      sidebar: 'bg-orange-100 border-orange-300',
      card: 'bg-white/80 border-orange-300',
      text: {
        primary: 'text-orange-900',
        secondary: 'text-orange-800',
        muted: 'text-orange-600',
      },
      button: {
        primary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg',
        secondary: 'bg-pink-200 hover:bg-pink-300 text-orange-900',
      },
      accent: 'text-orange-500',
      gradient: 'from-orange-400 to-pink-400',
    },
  },
  
  mesh: {
    id: 'mesh',
    name: 'Mesh',
    description: 'Gradient mesh with modern aesthetics',
    preview: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
    classes: {
      body: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
      sidebar: 'backdrop-blur-xl bg-indigo-900/40 border-white/20',
      card: 'backdrop-blur-md bg-white/10 border-white/20',
      text: {
        primary: 'text-white',
        secondary: 'text-white/90',
        muted: 'text-white/70',
      },
      button: {
        primary: 'bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30',
        secondary: 'bg-indigo-800/50 hover:bg-indigo-700/50 text-white',
      },
      accent: 'text-pink-300',
      gradient: 'from-indigo-400 to-pink-400',
    },
  },
  
  premium: {
    id: 'premium',
    name: 'Premium',
    description: 'Luxurious dark theme with gold accents',
    preview: 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900',
    classes: {
      body: 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900',
      sidebar: 'bg-gray-900/90 border-yellow-600/30',
      card: 'bg-gray-800/60 border-yellow-600/20',
      text: {
        primary: 'text-yellow-100',
        secondary: 'text-yellow-200/80',
        muted: 'text-gray-400',
      },
      button: {
        primary: 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-gray-900 font-semibold',
        secondary: 'bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-yellow-600/30',
      },
      accent: 'text-yellow-400',
      gradient: 'from-yellow-600 to-yellow-400',
    },
  },
};

// Helper function to get theme by ID
export const getTheme = (themeId) => {
  return themes[themeId] || themes.dark;
};

// Helper function to get all theme IDs
export const getThemeIds = () => {
  return Object.keys(themes);
};

// Helper function to get theme preview data for UI
export const getThemePreviews = () => {
  return Object.values(themes).map(theme => ({
    id: theme.id,
    name: theme.name,
    description: theme.description,
    preview: theme.preview,
  }));
};
