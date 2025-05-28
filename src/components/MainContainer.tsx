"use client";

import { CallButtons } from "./CallButtons";
import { VideoPlayer } from "./VideoPlayer";
import { useSelector } from "react-redux";
import {
  selectClientStream,
  selectPublisherStream,
} from "@/store/selectors/mediaStreamSelectors";

export const MainContainer = () => {
  const clientStream = useSelector(selectClientStream);
  const publisherStream = useSelector(selectPublisherStream);

  return (
    <div className="flex flex-col h-full w-full justify-center items-center gap-4">
      <div className="flex flex-row gap-4 h-1/2 w-full">
        <div className="w-1/2 h-full bg-red-500/25 rounded-lg">
          {clientStream ? <VideoPlayer stream={clientStream} muted /> : null}
        </div>
        <div className="w-1/2 h-full bg-blue-500/25 rounded-lg">
          {publisherStream ? (
            <VideoPlayer stream={publisherStream} muted={false} />
          ) : null}
        </div>
      </div>
      <CallButtons />
    </div>
  );
};
