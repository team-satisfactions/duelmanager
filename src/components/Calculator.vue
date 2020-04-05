<template>
  <div class="overlay" @click.prevent="close" v-show="isShow">
    <div class="calc-box" @click.stop>
      <div class="result">{{ sign ? '+' : '\u2212'}}{{ result }}</div>
      <div class="calc-button red"   @click="negative">-</div>
      <div class="calc-button blue"  @click="positive">+</div>
      <div class="calc-button green" @click="returnResult">=</div>
      <div class="calc-button"
        v-for="v in [1,2,3,4,5,6,7,8,9,0]" :key="v"  @click="addNumber(v)">{{v}}</div>
      <div class="calc-button" @click="multiplication(100)">00</div>
      <div class="calc-button yellow" @click="clearNumber">C</div>
    </div>
  </div>
</template>
<script>
export default {
  props : {
    isShow :  {
      type : Boolean,
      default : false,
    },
  },
  data() {
    return {
      result : 0,
      sign: true,
    }
  },
  methods : {
    returnResult(){
      this.$emit('result',this.result)
      this.close()
    },
    close(){
      this.$emit('update:isShow',false)
    },
    addNumber(num){
      this.result = Math.max(Math.min(this.result * 10 + num,99999),-99999)
    },
    clearNumber(){
      this.result = 0
    },
    multiplication(num){
      this.result = this.result * num
    },
    negative(){
      this.sign = false
    },
    positive(){
      this.sign = true
    }
  }
}
</script>
<style>
.overlay {
  display:flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index:9999;
  background-color : rgba(0,0,0,0.4);
}
.calc-box {
  width: 500px;
  background-color: rgba(255,255,255,0.8);
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
}
.calc-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width:30%;
  height:10vh;
  margin:3px;
  font-size:32px;
  border: 2px solid black;
}
.result {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0px;
  height:100px;
  width:100%;
  font-size:56px;
}
.calc-button:hover {
  background:rgba(0,0,0,0.1);
}
.calc-button.red {
  background:rgba(255,0,0,0.2);
}
.calc-button.red:hover {
  background:rgba(255,0,0,0.4);
}
.calc-button.blue {
  background:rgba(0,0,255,0.2)
}
.calc-button.blue:hover {
  background:rgba(0,0,255,0.4)
}
.calc-button.yellow {
  background:rgba(255,255,0,0.2)
}
.calc-button.yellow:hover {
  background:rgba(255,255,0,0.4)
}
.calc-button.green {
  background:rgba(0,255,0,0.2)
}
.calc-button.green:hover {
  background:rgba(0,255,0,0.4)
}
</style>
