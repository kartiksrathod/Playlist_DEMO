import React from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Reusable skeleton loader components for different content types
 */

// Playlist Card Skeleton
export const PlaylistCardSkeleton = () => {
  const { themeConfig } = useTheme();
  return (
    <div className={`${themeConfig.classes.card} backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl animate-pulse`}>
      <div className={`h-48 bg-gradient-to-br ${themeConfig.classes.gradient}`} />
      <div className="p-4">
        <div className={`h-4 ${themeConfig.classes.card} rounded w-3/4 mb-2`} />
        <div className={`h-3 ${themeConfig.classes.card} rounded w-1/2`} />
      </div>
    </div>
  );
};

// Track Row Skeleton
export const TrackRowSkeleton = () => {
  const { themeConfig } = useTheme();
  return (
    <div className={`flex items-center gap-4 p-4 ${themeConfig.classes.card} rounded-xl animate-pulse`}>
      <div className={`w-12 h-12 ${themeConfig.classes.card} rounded`} />
      <div className="flex-1">
        <div className={`h-4 ${themeConfig.classes.card} rounded w-3/4 mb-2`} />
        <div className={`h-3 ${themeConfig.classes.card} rounded w-1/2`} />
      </div>
      <div className={`h-8 w-20 ${themeConfig.classes.card} rounded`} />
    </div>
  );
};

// Library Grid Item Skeleton
export const LibraryGridSkeleton = () => {
  const { themeConfig } = useTheme();
  return (
    <div className={`${themeConfig.classes.card} backdrop-blur-xl rounded-xl overflow-hidden animate-pulse`}>
      <div className={`h-32 bg-gradient-to-br ${themeConfig.classes.gradient}`} />
      <div className="p-4">
        <div className={`h-4 ${themeConfig.classes.card} rounded w-3/4 mb-2`} />
        <div className={`h-3 ${themeConfig.classes.card} rounded w-1/2`} />
      </div>
    </div>
  );
};

// Track Detail Header Skeleton
export const TrackDetailSkeleton = () => {
  const { themeConfig } = useTheme();
  return (
    <div className="min-h-screen">
      <div className={`relative h-96 bg-gradient-to-b ${themeConfig.classes.gradient} animate-pulse`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-48 h-48 ${themeConfig.classes.card} rounded-2xl`} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className={`h-8 ${themeConfig.classes.card} rounded w-1/3 mb-4`} />
        <div className={`h-4 ${themeConfig.classes.card} rounded w-1/4 mb-2`} />
        <div className={`h-4 ${themeConfig.classes.card} rounded w-1/5`} />
      </div>
    </div>
  );
};

// Stats Card Skeleton
export const StatsCardSkeleton = () => {
  const { themeConfig } = useTheme();
  return (
    <div className={`${themeConfig.classes.card} backdrop-blur-xl rounded-xl p-6 animate-pulse`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 ${themeConfig.classes.card} rounded-full`} />
        <div className={`h-6 ${themeConfig.classes.card} rounded w-16`} />
      </div>
      <div className={`h-4 ${themeConfig.classes.card} rounded w-24`} />
    </div>
  );
};

// History Item Skeleton
export const HistoryItemSkeleton = () => {
  const { themeConfig } = useTheme();
  return (
    <div className={`flex items-center gap-4 p-4 ${themeConfig.classes.card} rounded-xl animate-pulse`}>
      <div className={`w-10 h-10 ${themeConfig.classes.card} rounded`} />
      <div className="flex-1">
        <div className={`h-4 ${themeConfig.classes.card} rounded w-3/4 mb-2`} />
        <div className={`h-3 ${themeConfig.classes.card} rounded w-1/2`} />
      </div>
      <div className={`h-8 w-16 ${themeConfig.classes.card} rounded`} />
    </div>
  );
};

// Favorite Card Skeleton
export const FavoriteCardSkeleton = () => {
  const { themeConfig } = useTheme();
  return (
    <div className={`${themeConfig.classes.card} backdrop-blur-xl rounded-xl overflow-hidden animate-pulse`}>
      <div className={`h-40 bg-gradient-to-br ${themeConfig.classes.gradient}`} />
      <div className="p-4">
        <div className={`h-4 ${themeConfig.classes.card} rounded w-3/4 mb-2`} />
        <div className={`h-3 ${themeConfig.classes.card} rounded w-1/2`} />
      </div>
    </div>
  );
};

// Generic Content Skeleton
export const ContentSkeleton = ({ className = '' }) => {
  const { themeConfig } = useTheme();
  return (
    <div className={`animate-pulse ${className}`}>
      <div className={`h-4 ${themeConfig.classes.card} rounded w-full mb-2`} />
      <div className={`h-4 ${themeConfig.classes.card} rounded w-5/6 mb-2`} />
      <div className={`h-4 ${themeConfig.classes.card} rounded w-4/6`} />
    </div>
  );
};

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
