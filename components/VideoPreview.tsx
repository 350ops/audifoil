import React, { useRef } from 'react';
import { View, ViewStyle } from 'react-native';
import { useVideoPlayer, VideoView, VideoSource } from 'expo-video';

interface VideoPreviewProps {
  source: VideoSource;
  height?: number;
  rounded?: number;
  muted?: boolean;
  loop?: boolean;
  style?: ViewStyle;
}

export default function VideoPreview({
  source,
  height = 220,
  rounded = 16,
  muted = true,
  loop = true,
  style,
}: VideoPreviewProps) {
  const videoRef = useRef(null);

  const player = useVideoPlayer(source, (p) => {
    p.loop = loop;
    p.muted = muted;
    p.play();
  });

  return (
    <View
      style={[
        {
          height,
          borderRadius: rounded,
          overflow: 'hidden',
          backgroundColor: '#000',
        },
        style,
      ]}
    >
      <VideoView
        ref={videoRef}
        player={player}
        style={{ flex: 1 }}
        contentFit="cover"
        nativeControls={false}
      />
    </View>
  );
}
