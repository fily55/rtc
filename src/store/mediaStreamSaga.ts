import { takeLatest, put, call, select } from 'redux-saga/effects';
import { RootState } from './store';

interface MediaStreamState {
  client: MediaStream | null;
  publisher: MediaStream | null;
  hasRtcStarted: boolean;
  peer1: RTCPeerConnection | null;
  peer2: RTCPeerConnection | null;
}

function* handleStartAV(): Generator<unknown, void, MediaStream> {
  try {
    const stream = yield call(async () => {
      return await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
    });
    yield put({ type: "[media] client stream received", payload: stream });
  } catch (error) {
    console.error("getUserMedia error: ", error);
    yield put({ type: "[media] client stream received", payload: null });
  }
}

function* handleStartCall(): Generator<unknown, void, unknown> {
  try {
    const state = (yield select((state: RootState) => state.mediaStream)) as MediaStreamState;
    const pc1 = new RTCPeerConnection();
    const pc2 = new RTCPeerConnection();
    const publisherStream = new MediaStream();

    pc1.onicecandidate = (e: RTCPeerConnectionIceEvent) => e.candidate && pc2.addIceCandidate(e.candidate);
    pc2.onicecandidate = (e: RTCPeerConnectionIceEvent) => e.candidate && pc1.addIceCandidate(e.candidate);

    pc2.ontrack = (e: RTCTrackEvent) => {
      publisherStream.addTrack(e.track);
    };

    state.client?.getTracks().forEach((track: MediaStreamTrack) => pc1.addTrack(track));

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

    yield put({ type: "[media] peer connections established", payload: { peer1: pc1, peer2: pc2 } });
    yield put({ type: "[media] publisher stream received", payload: publisherStream });
  } catch (error) {
    console.error("Start call error: ", error);
  }
}

export function* mediaStreamSaga() {
  yield takeLatest('[media] start av requested', handleStartAV);
  yield takeLatest('[media] start call requested', handleStartCall);
} 