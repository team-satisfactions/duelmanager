import Peer from "skyway-js";
import {skywayApiKey} from "../../config/skyway-config";

export default {
  data() {
    return {
      localStream: null,
      peer: null,
    };
  },
  methods: {
    makeCall(theirId) {
      const mediaConnection = this.peer.call(theirId, this.localStream);
      this.onGetMediaConnection(mediaConnection);
    },
    onGetMediaConnection(mediaConnection) {  // eslint-disable-line
      console.error("not implemented")
    },
    onPeerOpen() {
    },
    onPeerCall(mediaConnection) { // eslint-disable-line
    },
    onGetUserMediaStream(stream) { // eslint-disable-line
    },
  },
  mounted() {
    // カメラ映像取得
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
      .then( stream => {
        this.onGetUserMediaStream(stream);
        this.localStream = stream;
      }).catch( error => {
      // 失敗時にはエラーログを出力
      console.error('mediaDevice.getUserMedia() error:', error);
      return;
    });
    this.peer = new Peer({
      key: skywayApiKey,
      debug: 3
    });
    this.peer.on('open', this.onPeerOpen);
    this.peer.on('call', this.onPeerCall);
  }
}