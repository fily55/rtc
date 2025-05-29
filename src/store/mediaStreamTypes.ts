export type MediaStreamAction = (
  | { type: '[media] start av requested' }
  | { type: '[media] start call requested' }
  | { type: '[media] client stream received'; payload: MediaStream | null }
  | { type: '[media] call reset requested' }
  | { type: '[media] set up peer connections'; payload: { peer1: RTCPeerConnection; peer2: RTCPeerConnection } }
  | { type: '[media] add published tracks'; payload: { track: MediaStreamTrack } }
); 