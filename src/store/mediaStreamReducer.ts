import { produce } from 'immer';
import { Action } from 'redux';
import { MediaStreamAction } from './mediaStreamTypes';

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

const isMediaStreamAction = (action: Action): action is MediaStreamAction => {
  return action.type.startsWith('[media]');
};

const mediaStreamReducer = (state = initialState, action: Action) => {
  if (!isMediaStreamAction(action)) return state;
  
  return produce(state, (draft) => {
    switch (action.type) {
      case '[media] client stream received':
        draft.client = action.payload;
        draft.hasRtcStarted = action.payload !== null;
        break;
      case '[media] add published tracks':
        draft.publisher?.addTrack(action.payload.track);
        break;
      case '[media] set up peer connections':
        draft.peer1 = action.payload.peer1;
        draft.peer2 = action.payload.peer2;
        draft.publisher = new MediaStream();
        draft.client?.getTracks().forEach((track: MediaStreamTrack) => draft.peer1!.addTrack(track));
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