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
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;

      const handleTrackChange = () => {
        if (videoRef.current && stream.getTracks().length > 0) {
          videoRef.current.srcObject = stream;
        }
      };

      stream.addEventListener("addtrack", handleTrackChange);
      stream.addEventListener("removetrack", handleTrackChange);

      return () => {
        stream.removeEventListener("addtrack", handleTrackChange);
        stream.removeEventListener("removetrack", handleTrackChange);
      };
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
