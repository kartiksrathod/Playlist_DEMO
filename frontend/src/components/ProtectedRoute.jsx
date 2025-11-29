import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthOverlay from './AuthOverlay';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);

  // Show auth overlay when not authenticated and not loading
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowAuthOverlay(true);
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-white mb-4">🎵 Music Admin Control</h1>
              <p className="text-xl text-slate-400">Please login to access this content</p>
            </div>
          </div>
        </div>
        <AuthOverlay 
          isOpen={showAuthOverlay} 
          onClose={() => {
            // Don't allow closing - user must login
          }} 
        />
      </>
    );
  }

  return children;
};

export default ProtectedRoute;
