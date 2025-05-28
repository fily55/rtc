import { useDispatch, useSelector } from "react-redux";
import { resetCall, startCall, startAV } from "../store/mediaStreamReducer";
import {
  selectClientStream,
  selectPeer1,
  selectHasRtcStarted,
} from "../store/selectors/mediaStreamSelectors";
import { useCallback, useState } from "react";
import { AppDispatch } from "../store/store";

export const CallButtons = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hasRtcStarted = useSelector(selectHasRtcStarted);
  const clientStream = useSelector(selectClientStream);
  const peer1 = useSelector(selectPeer1);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  const onStartCamera = useCallback(async () => {
    dispatch(startAV());
  }, [dispatch]);

  const onCall = useCallback(async () => {
    if (!clientStream) return;
    dispatch(startCall());
  }, [dispatch, clientStream]);

  const onHangUp = useCallback(() => {
    dispatch(resetCall());
  }, [dispatch]);

  const toggleAudioMute = useCallback(() => {
    if (!clientStream) return;
    clientStream.getTracks().forEach((track) => {
      if (track.kind === "audio") {
        track.enabled = !track.enabled;
        setIsAudioMuted(!track.enabled);
      }
    });
  }, [clientStream]);

  const toggleVideoMute = useCallback(() => {
    if (!clientStream) return;
    clientStream.getTracks().forEach((track) => {
      if (track.kind === "video") {
        track.enabled = !track.enabled;
        setIsVideoMuted(!track.enabled);
      }
    });
  }, [clientStream]);

  return (
    <div className="flex flex-row gap-4 w-full justify-center items-center">
      <button
        className="bg-green-500 text-white p-2 rounded-md disabled:opacity-50"
        onClick={onStartCamera}
        disabled={hasRtcStarted}
      >
        Start A/V
      </button>
      <button
        onClick={onCall}
        disabled={!hasRtcStarted || Boolean(peer1)}
        className="bg-blue-500 text-white p-2 rounded-md disabled:opacity-50"
      >
        Call
      </button>
      <button
        disabled={!peer1}
        className="bg-red-500 text-white p-2 rounded-md disabled:opacity-50"
        onClick={onHangUp}
      >
        Hang Up
      </button>
      <button
        onClick={toggleAudioMute}
        disabled={!clientStream}
        className="bg-gray-500 text-white p-2 rounded-md disabled:opacity-50"
      >
        {isAudioMuted ? "Audio On" : "Audio Off"}
      </button>
      <button
        onClick={toggleVideoMute}
        disabled={!clientStream}
        className="bg-gray-500 text-white p-2 rounded-md disabled:opacity-50"
      >
        {isVideoMuted ? "Video On" : "Video Off"}
      </button>
    </div>
  );
};
