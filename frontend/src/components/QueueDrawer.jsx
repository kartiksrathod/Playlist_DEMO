import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { X, Music, Trash2, Play, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const QueueDrawer = ({ isOpen, onClose }) => {
  const { queue, currentTrack, removeFromQueue, clearQueue, play } = usePlayer();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  if (!isOpen) return null;

  const getCoverImage = (track) => {
    if (track.coverImage) {
      return `${BACKEND_URL}${track.coverImage}`;
    }
    return 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200';
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-slate-900 z-50 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Queue</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">
              {queue.length} {queue.length === 1 ? 'track' : 'tracks'} in queue
            </p>
            {queue.length > 0 && (
              <button
                onClick={clearQueue}
                className="text-red-400 hover:text-red-300 text-sm font-medium transition"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Queue List */}
        <div className="flex-1 overflow-y-auto">
          {queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <Music className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-300 mb-2">Queue is empty</h3>
              <p className="text-slate-500 text-sm">
                Add tracks to your queue to see them here
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {queue.map((track, index) => {
                const isCurrentTrack = currentTrack?.id === track.id;

                return (
                  <div
                    key={`${track.id}-${index}`}
                    className={`group flex items-center gap-3 p-3 rounded-lg transition cursor-pointer ${
                      isCurrentTrack
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'
                        : 'hover:bg-slate-800'
                    }`}
                    onClick={() => play(track)}
                  >
                    {/* Track Number / Play Icon */}
                    <div className="w-8 flex-shrink-0 text-center">
                      {isCurrentTrack ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 bg-blue-500 rounded animate-pulse" />
                        </div>
                      ) : (
                        <span className="text-slate-500 group-hover:hidden text-sm">
                          {index + 1}
                        </span>
                      )}
                      <Play className="w-4 h-4 text-white hidden group-hover:block mx-auto" />
                    </div>

                    {/* Cover Image */}
                    <img
                      src={getCoverImage(track)}
                      alt={track.songName}
                      className="w-12 h-12 rounded object-cover"
                    />

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-medium truncate ${
                          isCurrentTrack ? 'text-blue-400' : 'text-white'
                        }`}
                      >
                        {track.songName}
                      </h4>
                      <p className="text-slate-400 text-sm truncate">
                        {track.artist || 'Unknown Artist'}
                      </p>
                    </div>

                    {/* Duration & Remove */}
                    <div className="flex items-center gap-2">
                      {track.duration && (
                        <span className="text-slate-500 text-sm">{track.duration}</span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromQueue(track.id);
                        }}
                        className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                        title="Remove from queue"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Note */}
        {queue.length > 0 && (
          <div className="p-4 border-t border-slate-700">
            <p className="text-slate-500 text-xs text-center">
              Click on any track to play it • Drag to reorder (coming soon)
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default QueueDrawer;
