<template>
  <div class="overlay" @click.prevent="close" v-if="isShow">
    <div class="table" @click.stop>
      <div style="display: flex; justify-content: end;">
        <button @click="close">x</button>
      </div>
      <div style="display: flex;">
        <div class="coin-wrap">
          <div class="coin" ref="coin">
            <div class="front"></div>
            <div class="back">back</div>
          </div>
        </div>
      </div>
      <div>
        <button v-if="!isToss" @click.stop="toss">toss</button>
        <button v-else disabled>toss</button>
      </div>
    </div>
  </div>
</template>
<script>
import chancer from "chancer";
import { createNamespacedHelpers } from "vuex";
import { waitFor } from "@/lib/promiseTools";
const {
  mapState: mapCoinState,
  mapActions: mapCoinActions
} = createNamespacedHelpers("coin");

let dt = 20;
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      isToss: false,
    };
  },
  mounted() {
    this.subscribeFirestoreCoinRolls();
  },
  watch : {
    async timestamp(){
      await this.autoAnimation()
    },
    async lastCoinFace(){
      await this.autoAnimation()
    }
  },
  methods: {
    async autoAnimation(){
      this.open();
      await this.$nextTick();
      await this.role(this.coinRolls(this.lastCoinFace));
    },
    async toss() {
      if (this.isToss) {
        return;
      }
      this.isToss = true;
      const coinFace = chancer.coinToss(true, false);

      await this.tossToShare(coinFace);
    },
    async role(roleN = 3) {
      this.isToss = true;
      let time = 700;
      let st = Date.now();
      let rad = 180 / (time / roleN);

      let t = Date.now() - st;
      while (t < time) {
        this.coinStyle({
          transform: `rotateX(${(t * rad) % 360}deg)`,
          bottom: Math.max(Math.sin((t / time) * Math.PI) * 200, 0) + "px",
        });
        await waitFor(dt);
        t = Date.now() - st;
      }
      this.coinStyle({
        transform: `rotateX(${(roleN * 180) % 360}deg)`,
        bottom: "0px",
      });
      this.isToss = false;
    },
    coinStyle(newStyle = {}) {
      Object.entries(newStyle).forEach(([key, value]) => {
        this.$refs["coin"].style[key] = value;
      });
    },
    open() {
      this.$emit("update:isShow", true);
    },
    close() {
      this.$emit("update:isShow", false);
    },
    coinRolls(coinFace) {
      if (coinFace === undefined) {
        console.error("undefined");
      }
      return coinFace ? 4 : 5;
    },
    ...mapCoinActions(["subscribeFirestoreCoinRolls", "tossToShare"]),
  },
  computed: {
    ...mapCoinState(["lastCoinFace","timestamp"]),
  },
};
</script>
<style scoped>
.overlay {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.4);
}
.table {
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.8);
}
.coin-wrap {
  height: 300px;
  width: 200px;
  position: relative;
}
.coin {
  font-size: 50px;
  width: 100px;
  height: 100px;
  perspective: 550px;
  transform-style: preserve-3d;
  position: absolute;
  bottom: 0;
}
.coin > * {
  width: inherit;
  height: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
}
.front {
  position: absolute;
  background: #ffff7f;
  background-image: url(../assets/coin.png);
  background-size: 100px;
}
.back {
  font-size: 16px;
  position: absolute;
  background: #ffff7f;
  transform: rotateX(180deg) translateZ(2px);
  background-image: url(../assets/coin-back.png);
  background-size: 100px;
}
</style>
