'use client';

import { useRef, useState } from 'react';
import Icon from './Icon';
import { cn } from '@/lib/utils';

interface VideoPreviewProps {
  src: string;
  height?: number;
  rounded?: number;
  className?: string;
}

export default function VideoPreview({ src, height = 200, rounded = 16, className }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className={cn('relative overflow-hidden cursor-pointer group', className)}
      style={{ height, borderRadius: rounded }}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full object-cover"
        playsInline
        muted
        loop
        onEnded={() => setIsPlaying(false)}
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity group-hover:bg-black/30">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
            <Icon name="Play" size={24} color="white" />
          </div>
        </div>
      )}
    </div>
  );
}
