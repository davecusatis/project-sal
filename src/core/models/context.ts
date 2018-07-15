export interface Context {
  mode: string;
  language: string;
  bitrate?: number;
  bufferSize?: number;
  displayResolution?: string;
  hlsLatencyBroadcaster?: number;
  isFullScreen?: string;
  isPaused?: boolean;
  isTheatreMode?: boolean;
  videoResolution?: string;
  game?: string;
  theme?: number;
  playbackMode?: string;

  [key: string]: undefined | string | number | boolean;
}
