import { RootState } from "../store";

export const selectHasRtcStarted = (state: RootState) => state.mediaStream.hasRtcStarted;
export const selectClientStream = (state: RootState) => state.mediaStream.client; 
export const selectPublisherStream = (state: RootState) => state.mediaStream.publisher; 
export const selectPeer1 = (state: RootState) => state.mediaStream.peer1;
export const selectPeer2 = (state: RootState) => state.mediaStream.peer2;