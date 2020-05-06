<template>
  <div>
    <div class="warpper">
      <video
              v-show="isFoundOtherPlayerRTCId"
              id="their-video"
              :height="height + 'px'"
              :width="width + 'px'"
              autoplay
              :muted="!!mute"
              playsinline
      ></video>
    </div>

    <h1 v-show="!isFoundOtherPlayerRTCId">対戦相手がまだいません</h1>
    <button v-if="!mute" @click="mute = true">ミュート</button>
    <button v-else @click="mute = false">ミュート解除</button>
    <button @click="openCalc(player)">自分</button>
    <button @click="openCalc(rival)">相手</button>
    <Calculator :isShow.sync="isShowCalc" @result="calcLife"></Calculator>
  </div>
</template>

<script>
import Calculator from "../components/Calculator.vue";
import { createNamespacedHelpers } from "vuex";
import duel from "@/mixins/duel";
import router from "@/router";
import skywayManagerRoom from "@/mixins/skywayManagerRoom";
const {
  mapActions: mapDuelActions,
  mapState: mapDuelState
} = createNamespacedHelpers("duel");
const {
  mapActions: mapLifeActions,
  mapGetters: mapLifeGetters
} = createNamespacedHelpers("life");

export default {
  name: "Player",
  mixins: [duel, skywayManagerRoom],
  data() {
    return {
      mute: true,
      isShowCalc: false,
      calcPlayer: "",
      streamHeight: 0,
      streamWidth: 0,
      rivalStream: null,
      audienceStreams: [],
    };
  },
  methods: {
    ...mapDuelActions(["setRTCId", "bindPlayerRTCIds"]),
    ...mapLifeActions(["addChangeHistory", "resetHistory", "setPlayerName"]),
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
    splitStreams() {
      console.log({remoteStreams: this.room.remoteStreams});
      const audienceStreams = [];
      for (const key in this.room.remoteStreams) {
        const stream = this.room.remoteStreams[key];
        console.log({stream})
        const peerId = stream.peerId;
        if (this.rivalRTCId === peerId) {
          this.rivalStream = stream;
          const videoElm = document.getElementById("their-video");
          videoElm.srcObject = this.rivalStream;
          videoElm.play();
        } else {
          audienceStreams.push(stream);
        }
        this.audienceStreams = audienceStreams;
      }
    },

    onGetStream() {
      this.splitStreams();
    },
    onGetRivalStream(stream) {
      const videoElm = document.getElementById("their-video");
      console.log({ stream });

      videoElm.srcObject = stream;
      videoElm.play();
    },
    onPeerJoin() {
      this.splitStreams();
    },
    onPeerLeave(peerId) {
      if (this.playerRTCIds[this.rival] === peerId) {
        this.setRTCId({
          player: this.rival,
          RTCId: null
        });
      }
      this.splitStreams();
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
    }
  },
  computed: {
    player() {
      return "player" + this.$route.params.num;
    },
    rival() {
      return "player" + (((parseInt(this.$route.params.num) - 1 + 1) % 2) + 1);
    },
    rivalRTCId() {
      return this.playerRTCIds[this.rival];
    },
    isFoundOtherPlayerRTCId() {
      return this.playerRTCIds[this.rival] !== null;
    },
    roomId() {
      return this.duelId;
    },
    width() {
      return document.body.clientWidth;
    },
    height() {
      return document.body.clientHeight;
    },
    ...mapLifeGetters(["lifes"]),
    ...mapDuelState(["playerRTCIds", "duelId"])
  },
  components: {
    Calculator
  },
  mounted() {},
  watch: {
    playerRTCIds(newValue) {
      console.log(newValue);
      this.splitStreams();
    },

  }
};
</script>

<style scoped></style>
