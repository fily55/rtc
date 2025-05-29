import { AnyAction } from '@reduxjs/toolkit';
import { produce } from 'immer';

interface MediaStreamState {
  client: MediaStream | null;
  publisher: MediaStream | null;
  hasRtcStarted: boolean;
  peer1: RTCPeerConnection | null;
  peer2: RTCPeerConnection | null;
}

const initialState: MediaStreamState = {
  client: null,
  publisher: null,
  hasRtcStarted: false,
  peer1: null,
  peer2: null,
};

const mediaStreamReducer = (state = initialState, action: AnyAction) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case '[media] client stream received':
        draft.client = action.payload;
        draft.hasRtcStarted = action.payload !== null;
        break;
      case '[media] publisher stream received':
        draft.publisher = action.payload;
        break;
      case '[media] peer connections established':
        draft.peer1 = action.payload.peer1;
        draft.peer2 = action.payload.peer2;
        break;
      case '[media] call reset requested':
        draft.peer1?.close();
        draft.peer2?.close();
        draft.hasRtcStarted = false;
        draft.client = null;
        draft.publisher = null;
        draft.peer1 = null;
        draft.peer2 = null;
        break;
    }
  });
};

export default mediaStreamReducer; 