import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
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

// Sortable Track Item Component
const SortableTrackItem = ({ track, index, isCurrentTrack, onPlay, onRemove, getCoverImage, themeConfig }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 p-3 rounded-lg transition cursor-pointer ${
        isCurrentTrack
          ? `bg-gradient-to-r ${themeConfig.classes.gradient} border ${themeConfig.classes.accent}`
          : `${themeConfig.classes.button.secondary}`
      }`}
      onClick={() => onPlay(track)}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className={`cursor-grab active:cursor-grabbing ${themeConfig.classes.text.muted} hover:${themeConfig.classes.text.secondary} transition`}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-5 h-5" />
      </button>

      {/* Track Number / Play Icon */}
      <div className="w-8 flex-shrink-0 text-center">
        {isCurrentTrack ? (
          <div className="flex items-center justify-center">
            <div className={`w-4 h-4 ${themeConfig.classes.button.primary} rounded animate-pulse`} />
          </div>
        ) : (
          <span className={`${themeConfig.classes.text.muted} group-hover:hidden text-sm`}>
            {index + 1}
          </span>
        )}
        <Play className={`w-4 h-4 ${themeConfig.classes.text.primary} hidden group-hover:block mx-auto`} />
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
            isCurrentTrack ? themeConfig.classes.accent : themeConfig.classes.text.primary
          }`}
        >
          {track.songName}
        </h4>
        <p className={`${themeConfig.classes.text.secondary} text-sm truncate`}>
          {track.artist || 'Unknown Artist'}
        </p>
      </div>

      {/* Duration & Remove */}
      <div className="flex items-center gap-2">
        {track.duration && (
          <span className={`${themeConfig.classes.text.muted} text-sm`}>{track.duration}</span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(track.id);
          }}
          className={`p-1.5 rounded ${themeConfig.classes.button.secondary} hover:text-red-400 transition opacity-0 group-hover:opacity-100`}
          title="Remove from queue"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const QueueDrawer = ({ isOpen, onClose }) => {
  const { themeConfig } = useTheme();
  const { queue, currentTrack, removeFromQueue, clearQueue, play, reorderQueue } = usePlayer();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!isOpen) return null;

  const getCoverImage = (track) => {
    if (track.coverImage) {
      return `${BACKEND_URL}${track.coverImage}`;
    }
    return 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200';
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = queue.findIndex((track) => track.id === active.id);
      const newIndex = queue.findIndex((track) => track.id === over.id);
      
      reorderQueue(oldIndex, newIndex);
    }
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={queue.map((track) => track.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="p-4 space-y-2">
                  {queue.map((track, index) => {
                    const isCurrentTrack = currentTrack?.id === track.id;

                    return (
                      <SortableTrackItem
                        key={track.id}
                        track={track}
                        index={index}
                        isCurrentTrack={isCurrentTrack}
                        onPlay={play}
                        onRemove={removeFromQueue}
                        getCoverImage={getCoverImage}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Footer Note */}
        {queue.length > 0 && (
          <div className="p-4 border-t border-slate-700">
            <p className="text-slate-500 text-xs text-center">
              Click on any track to play it • Drag to reorder
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default QueueDrawer;
