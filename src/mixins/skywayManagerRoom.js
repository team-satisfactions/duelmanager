import Peer from "skyway-js";
import {skywayApiKey} from "../../config/skyway-config";
import {createNamespacedHelpers} from "vuex";

const { mapActions } = createNamespacedHelpers("duel");


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
    onPeerJoin(peerId) { // eslint-disable-line
    },
    onGetUserMediaStream(stream) { // eslint-disable-line
    },
    ...mapActions(["waitInitialized"]),
  },
  computed: {
    roomId() {
      console.error("not implemented")
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
    this.peer.on('open', async () => {
      await this.waitInitialized();
      this.room = this.peer.joinRoom(this.roomId, {
        mode: "sfu",
        stream: this.localStream,
      });
      this.room.on('peerJoin', this.onPeerJoin);
      this.room.on('peerLeave', this.onPeerLeave);
      this.room.on('stream', this.onGetStream);
      this.onPeerOpen();
    });

  }
}