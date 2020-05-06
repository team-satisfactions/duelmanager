<template>
  <div class="overlay" @click.prevent="close" v-show="isShow">
    <div class="calc-box" @click.stop>
      <h2>
        {{player}}
      </h2>
      <div class="result" :class="{ red: sign, blue: !sign }">
        {{ sign ? "+" : "\u2212" }}{{ result }}
      </div>
      <div class="calc-button blue" @click="negative">-</div>
      <div class="calc-button red" @click="positive">+</div>
      <div class="calc-button yellow" @click="clearNumber">C</div>
      <div
        class="calc-button"
        v-for="v in [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]"
        :key="v"
        @click="addNumber(v)"
      >
        {{ v }}
      </div>
      <div class="calc-button" @click="multiplication(100)">00</div>
      <div class="calc-button green" @click="returnResult">=</div>
    </div>
  </div>
</template>
<script>
let calcRange = (num, max = 99999, min = -99999) => {
  return Math.max(Math.min(num, max), min);
};
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    player: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      result: 0,
      sign: false,
      updateStep: 1000,
    };
  },
  methods: {
    init() {
      this.sign = false;
      this.result = 0;
    },
    returnResult() {
      let num = this.sign ? this.result : -this.result;
      this.$emit("result", num);
      this.close();
    },
    close() {
      this.$emit("update:isShow", false);
    },
    addNumber(num) {
      this.result = calcRange(this.result * 10 + num);
    },
    clearNumber() {
      this.result = 0;
    },
    multiplication(num) {
      this.result = calcRange(this.result * num);
    },
    negative() {
      this.sign = false;
    },
    positive() {
      this.sign = true;
    },
  },
  watch: {
    isShow() {
      this.init();
    },
  },
  mounted() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Shift") {
        this.updateStep = 100;
      }
    });
    window.addEventListener("keyup", (e) => {
      console.log(e.key);
      if (e.key === "Shift") {
        this.updateStep = 1000;
      }
      if (e.key === "ArrowUp") {
        this.result = Math.max(this.result + this.updateStep, 0);
      }
      if (e.key === "ArrowDown") {
        this.result = Math.max(this.result - this.updateStep, 0);
      }
      if (e.key === "Enter") {
        this.returnResult();
      }
      if (e.key === "Escape") {
        this.close();
      }
    });
  },
};
</script>
<style>
.overlay {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.4);
}
.calc-box {
  width: 500px;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
}
.calc-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30%;
  height: 10vh;
  margin: 3px;
  font-size: 32px;
  border: 2px solid black;
}
.result {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: calc(100% - 10px);
  margin: 10px;
  font-size: 56px;
}
.result.red {
  background: rgba(255, 0, 0, 0.2);
}
.result.blue {
  background: rgba(0, 0, 255, 0.2);
}
.calc-button:hover {
  background: rgba(0, 0, 0, 0.1);
}
.calc-button.red {
  background: rgba(255, 0, 0, 0.2);
}
.calc-button.red:hover {
  background: rgba(255, 0, 0, 0.4);
}
.calc-button.blue {
  background: rgba(0, 0, 255, 0.2);
}
.calc-button.blue:hover {
  background: rgba(0, 0, 255, 0.4);
}
.calc-button.yellow {
  background: rgba(255, 255, 0, 0.2);
}
.calc-button.yellow:hover {
  background: rgba(255, 255, 0, 0.4);
}
.calc-button.green {
  background: rgba(0, 255, 0, 0.2);
}
.calc-button.green:hover {
  background: rgba(0, 255, 0, 0.4);
}
</style>
