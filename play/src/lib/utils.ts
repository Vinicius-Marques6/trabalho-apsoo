import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a consistent RGB color based on the provided seed string.
 * @param seed - The seed string to generate the color for.
 * @returns A string representing an RGB color in the format 'rgb(r,g,b)'.
 */
export function getRandomColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const r = (hash >> 16) & 0xFF;
  const g = (hash >> 8) & 0xFF;
  const b = hash & 0xFF;

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  const factor = brightness < 128 ? 1.5 : 1;
  const nr = Math.min(255, Math.floor(r * factor));
  const ng = Math.min(255, Math.floor(g * factor));
  const nb = Math.min(255, Math.floor(b * factor));

  return `rgb(${nr},${ng},${nb})`;
}