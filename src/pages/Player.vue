<template>
  <div>
    <video
      v-if="isFoundOtherPlayerRTCId"
      id="their-video"
      height="100%"
      autoplay
      :muted="!!mute"
      playsinline
    ></video>
    <h1 v-else>対戦相手がまだいません</h1>
    <button v-if="!mute" @click="mute = true">ミュート</button>
    <button v-else @click="mute = false">ミュート解除</button>
    <button @click="openCalc(player)">自分</button>
    <button @click="openCalc(otherPlayer)">相手</button>
    <Calculator :isShow.sync="isShowCalc" @result="calcLife"></Calculator>
  </div>
</template>

<script>
import Calculator from "../components/Calculator.vue";
import skywayManager from "@/mixins/skywayManager";
import { createNamespacedHelpers } from "vuex";
import duel from "@/mixins/duel";
import router from "@/router";
const {
  mapActions: mapDuelActions,
  mapState: mapDuelState
} = createNamespacedHelpers("duel");
const {
  mapActions: mapLifeActions,
  mapGetters: mapLifeGetters,
} = createNamespacedHelpers("life");


export default {
  name: "Player",
  mixins: [duel, skywayManager],
  data() {
    return {
      mute: true,
      isShowCalc: false,
      calcPlayer: "",
    };
  },
  methods: {
    ...mapDuelActions(["setRTCId", "bindPlayerRTCIds"]),
    ...mapLifeActions([
      "addChangeHistory",
      "resetHistory",
      "setPlayerName"
    ]),
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
    },
    calcLife(value) {
      const player = this.calcPlayer;
      this.addChangeHistory([player, value]);
    },
    openCalc(player) {
      console.log({ player });
      this.calcPlayer = player;
      this.isShowCalc = true;
    },
    onCreatedNewDuel(duelId) {
      return router.push(`/duels/${duelId}/players/${this.$route.params.num}`);
    },
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
    ...mapLifeGetters(["lifes"]),
    ...mapDuelState(["playerRTCIds"])
  },
  components: {
    Calculator,
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
