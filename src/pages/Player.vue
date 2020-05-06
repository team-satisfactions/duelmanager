<template>
  <div>
    <video
      v-if="isFoundOtherPlayerRTCId"
      id="their-video"
      height="100%"
      autoplay
      muted
      playsinline
    ></video>
    <h1 v-else>対戦相手がまだいません</h1>
  </div>
</template>

<script>
import skywayManager from "@/mixins/skywayManager";
import { createNamespacedHelpers } from "vuex";
import duel from "@/mixins/duel";
const {
  mapActions: mapDuelActions,
  mapState: mapDuelState
} = createNamespacedHelpers("duel");

export default {
  name: "Player",
  mixins: [duel, skywayManager],
  methods: {
    ...mapDuelActions(["setRTCId", "bindPlayerRTCIds"]),
    onPeerOpen() {
      console.log("onp");
      console.log(this.peer.id);
      this.bindPlayerRTCIds().then(() => {
        return this.setRTCId({
          player: this.player,
          RTCId: this.peer.id
        });
      });
    },
    onGetMediaConnection(mediaConnection) {
      mediaConnection.on("stream", stream => {
        const videoElm = document.getElementById("their-video");
        videoElm.srcObject = stream;
        videoElm.play();
      });
    },
    onPeerCall(mediaConnection) {
      mediaConnection.answer(this.localStream);
      this.onGetMediaConnection(mediaConnection);
    }
  },
  computed: {
    player() {
      return "player" + this.$route.params.num;
    },
    otherPlayer() {
      return "player" + (((parseInt(this.$route.params.num) - 1 + 1) % 2) + 1);
    },
    isFoundOtherPlayerRTCId() {
      return this.playerRTCIds[this.otherPlayer] !== null;
    },
    ...mapDuelState(["playerRTCIds"])
  },
  mounted() {},
  watch: {
    playerRTCIds(newValue) {
      const theirId = newValue[this.otherPlayer];
      if (this.player === "player1" && theirId !== null) {
        this.makeCall(theirId);
      }
    }
  }
};
</script>

<style scoped></style>
