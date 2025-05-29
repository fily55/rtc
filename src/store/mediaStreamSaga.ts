import { call } from 'redux-saga/effects';
import { takeLatestMedia, putMedia } from './utils/sagaUtils';
import { store } from './store';

function* handleStartAV(): Generator<unknown, void, MediaStream> {
  try {
    const stream = yield call(async () => {
      return await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
    });
    yield putMedia({ type: "[media] client stream received", payload: stream });
  } catch (error) {
    console.error("getUserMedia error: ", error);
    yield putMedia({ type: "[media] client stream received", payload: null });
  }
}

function* handleStartCall(): Generator<unknown, void, unknown> {
  try {
    const pc1 = new RTCPeerConnection();
    const pc2 = new RTCPeerConnection();
    yield putMedia({ type: "[media] set up peer connections", payload: { peer1: pc1, peer2: pc2 } });

    pc1.onicecandidate = (e: RTCPeerConnectionIceEvent) => e.candidate && pc2.addIceCandidate(e.candidate);
    pc2.onicecandidate = (e: RTCPeerConnectionIceEvent) => e.candidate && pc1.addIceCandidate(e.candidate);

    pc2.ontrack = (e: RTCTrackEvent) => {
      store.dispatch({ 
        type: "[media] add published tracks", 
        payload: { track: e.track } 
      });
    };
    
    yield call(async () => {
      const offer = await pc1.createOffer();
      await pc1.setLocalDescription(offer);
      await pc2.setRemoteDescription(offer);
    });
    
    yield call(async () => {
      const answer = await pc2.createAnswer();
      await pc2.setLocalDescription(answer);
      await pc1.setRemoteDescription(answer);
    });
  } catch (error) {
    console.error("Start call error: ", error);
  }
}

export function* mediaStreamSaga() {
  yield takeLatestMedia('[media] start av requested', handleStartAV);
  yield takeLatestMedia('[media] start call requested', handleStartCall);
} 