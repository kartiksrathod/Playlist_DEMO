import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDuration(duration) {
  if (!duration) return '0:00';
  // If duration is already formatted (mm:ss), return as is
  if (typeof duration === 'string' && duration.includes(':')) {
    return duration;
  }
  // If duration is in seconds, convert to mm:ss
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
