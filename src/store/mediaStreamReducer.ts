import { AnyAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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

export const startCall = createAsyncThunk(
  'mediaStream/startCall',
  async (_, { getState }) => {
    const state = getState() as { mediaStream: MediaStreamState };
    const pc1 = new RTCPeerConnection();
    const pc2 = new RTCPeerConnection();

    const publisherStream = new MediaStream();

    pc1.onicecandidate = (e) => e.candidate && pc2.addIceCandidate(e.candidate);
    pc2.onicecandidate = (e) => e.candidate && pc1.addIceCandidate(e.candidate);

    pc2.ontrack = (e) => {
      publisherStream.addTrack(e.track);
    };

    state.mediaStream.client?.getTracks().forEach((track) => pc1.addTrack(track));

    const offer = await pc1.createOffer();
    await pc1.setLocalDescription(offer);
    await pc2.setRemoteDescription(offer);

    const answer = await pc2.createAnswer();
    await pc2.setLocalDescription(answer);
    await pc1.setRemoteDescription(answer);

    return { peer1: pc1, peer2: pc2, publisherStream };
  }
);

export const startAV = createAsyncThunk(
  'mediaStream/startAV',
  async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,  
      });
      return stream;
    } catch (e) {
      console.error("getUserMedia error: " + e);
    }
  }
);

const mediaStreamSlice = createSlice({
  name: 'mediaStream',
  initialState,
  reducers: {
    resetCall: (state) => {
      state.hasRtcStarted = false;
      state.client = null;
      state.publisher = null;

      state.peer1?.close();
      state.peer1 = null;
      state.peer2?.close();
      state.peer2 = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(startCall.fulfilled, (state, action) => {
      state.peer1 = action.payload.peer1;
      state.peer2 = action.payload.peer2;
      state.publisher = action.payload.publisherStream;
    });
    builder.addCase(startAV.fulfilled, (state, action) => {
      if (action.payload) {
        state.client = action.payload;
        state.hasRtcStarted = true;
      } else {
        state.hasRtcStarted = false;
      }
    });
  },
});

const mediaStreamReducer = (state = initialState, action: AnyAction) => {
  return mediaStreamSlice.reducer(state, action);
};

export const { resetCall } =
  mediaStreamSlice.actions;
export default mediaStreamReducer; 