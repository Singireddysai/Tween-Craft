/**
 * Type declaration for tween.js
 */

declare module '../utils/tween.js' {
  /**
   * Process a video using GMFSS Fortuna
   * @param videoPath Path to the input video file
   * @param multiplier Frame multiplication factor (default: 6)
   * @returns Promise that resolves to the output video file path
   */
  export default function tween(videoPath: string, multiplier?: number): Promise<string>;
}