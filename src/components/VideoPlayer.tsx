import { useEffect, useRef } from "react";

export const VideoPlayer = ({
  stream,
  muted,
}: {
  stream: MediaStream;
  muted: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream && stream.getTracks().length > 0) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      autoPlay
      playsInline
      muted={muted}
      ref={videoRef}
      className="w-full h-full aspect-video"
    />
  );
};
