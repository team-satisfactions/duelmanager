<template>
  <div class="overlay" @click.prevent="close" v-if="isShow">
    <div class="table" @click.stop>
      <div style="display: flex; justify-content: end;">
        <button @click="close">x</button>
      </div>
      <div style="display: flex;">
        <div class="coin-wrap">
          <div class="coin" ref="coin">
            <div class="front">表</div>
            <div class="back">裏</div>
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
  mapGetters: mapDuelGetters,
  mapActions: mapDuelActions,
} = createNamespacedHelpers("duel");
const { mapActions: mapCoinActions } = createNamespacedHelpers("coin");

let dt = 20;
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isToss: false,
      unsubscribe: null,
    };
  },
  mounted() {
    this.subscribeFirestoreCoinRolls();
    this.unsubscribe = this.$store.subscribe(async (mutation, state) => {
      if (mutation.type === "coin/setCoinRolls") {
        this.open();
        await this.$nextTick();
        this.role(this.coinRolls(state.coin.lastCoinFace));
        this.close();
      }
    });
  },
  destroyed() {
    this.unsubscribe();
  },
  methods: {
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

      await new Promise((resolve) => {
        let interval = () => {
          let t = Date.now() - st;
          if (t >= time) {
            this.coinStyle({
              transform: `rotateX(${(roleN * 180) % 360}deg)`,
              bottom: "0px",
            });
            this.isToss = false;
            resolve();
            return;
          }
          this.coinStyle({
            transform: `rotateX(${(t * rad) % 360}deg)`,
            bottom: Math.max(Math.sin((t / time) * Math.PI) * 200, 0) + "px",
          });
          setTimeout(interval, dt);
        };
        interval();
      });
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
    ...mapDuelActions(["waitInitialized"]),
    ...mapCoinActions(["subscribeFirestoreCoinRolls", "tossToShare"]),
  },
  computed: {
    ...mapDuelGetters(["duelRef"]),
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
  background: rgba(255, 0, 0, 0.8);
}
.back {
  position: absolute;
  background: rgba(0, 0, 255, 0.8);
  transform: rotateX(180deg) translateZ(2px);
}
</style>
