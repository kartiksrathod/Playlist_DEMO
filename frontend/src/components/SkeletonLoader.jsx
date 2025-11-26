import React from 'react';

/**
 * Reusable skeleton loader components for different content types
 */

// Playlist Card Skeleton
export const PlaylistCardSkeleton = () => (
  <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl animate-pulse border border-blue-700/30">
    <div className="h-48 bg-gradient-to-br from-blue-900/40 to-blue-800/30" />
    <div className="p-4">
      <div className="h-4 bg-blue-900/40 rounded w-3/4 mb-2" />
      <div className="h-3 bg-blue-900/40 rounded w-1/2" />
    </div>
  </div>
);

// Track Row Skeleton
export const TrackRowSkeleton = () => (
  <div className="flex items-center gap-4 p-4 bg-slate-900/30 rounded-xl animate-pulse">
    <div className="w-12 h-12 bg-blue-900/40 rounded" />
    <div className="flex-1">
      <div className="h-4 bg-blue-900/40 rounded w-3/4 mb-2" />
      <div className="h-3 bg-blue-900/40 rounded w-1/2" />
    </div>
    <div className="h-8 w-20 bg-blue-900/40 rounded" />
  </div>
);

// Library Grid Item Skeleton
export const LibraryGridSkeleton = () => (
  <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl overflow-hidden border border-indigo-700/30 animate-pulse">
    <div className="h-32 bg-gradient-to-br from-indigo-900/40 to-purple-900/30" />
    <div className="p-4">
      <div className="h-4 bg-indigo-900/40 rounded w-3/4 mb-2" />
      <div className="h-3 bg-indigo-900/40 rounded w-1/2" />
    </div>
  </div>
);

// Track Detail Header Skeleton
export const TrackDetailSkeleton = () => (
  <div className="min-h-screen bg-slate-950">
    <div className="relative h-96 bg-gradient-to-b from-indigo-900/40 to-slate-950 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-48 h-48 bg-indigo-800/40 rounded-2xl" />
      </div>
    </div>
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="h-8 bg-indigo-900/40 rounded w-1/3 mb-4" />
      <div className="h-4 bg-indigo-900/40 rounded w-1/4 mb-2" />
      <div className="h-4 bg-indigo-900/40 rounded w-1/5" />
    </div>
  </div>
);

// Stats Card Skeleton
export const StatsCardSkeleton = () => (
  <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 bg-blue-900/40 rounded-full" />
      <div className="h-6 bg-blue-900/40 rounded w-16" />
    </div>
    <div className="h-4 bg-blue-900/40 rounded w-24" />
  </div>
);

// History Item Skeleton
export const HistoryItemSkeleton = () => (
  <div className="flex items-center gap-4 p-4 bg-slate-900/30 rounded-xl border border-purple-700/20 animate-pulse">
    <div className="w-10 h-10 bg-purple-900/40 rounded" />
    <div className="flex-1">
      <div className="h-4 bg-purple-900/40 rounded w-3/4 mb-2" />
      <div className="h-3 bg-purple-900/40 rounded w-1/2" />
    </div>
    <div className="h-8 w-16 bg-purple-900/40 rounded" />
  </div>
);

// Favorite Card Skeleton
export const FavoriteCardSkeleton = () => (
  <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl overflow-hidden border border-pink-700/30 animate-pulse">
    <div className="h-40 bg-gradient-to-br from-pink-900/40 to-rose-900/30" />
    <div className="p-4">
      <div className="h-4 bg-pink-900/40 rounded w-3/4 mb-2" />
      <div className="h-3 bg-pink-900/40 rounded w-1/2" />
    </div>
  </div>
);

// Generic Content Skeleton
export const ContentSkeleton = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="h-4 bg-slate-700/50 rounded w-full mb-2" />
    <div className="h-4 bg-slate-700/50 rounded w-5/6 mb-2" />
    <div className="h-4 bg-slate-700/50 rounded w-4/6" />
  </div>
);

// Playlist Grid Skeleton (multiple cards)
export const PlaylistGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(count)].map((_, i) => (
      <PlaylistCardSkeleton key={i} />
    ))}
  </div>
);

// Track List Skeleton (multiple rows)
export const TrackListSkeleton = ({ count = 5 }) => (
  <div className="space-y-2">
    {[...Array(count)].map((_, i) => (
      <TrackRowSkeleton key={i} />
    ))}
  </div>
);
