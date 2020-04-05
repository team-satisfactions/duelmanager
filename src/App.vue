<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div style="display:flex; justify-content: space-around;">
      <div v-for="(life,player) in lifes()" :key="player" style="position:relative;">
        <img :src="'/' + player + '.jpeg'" :alt="player" style="width:400px;">
        <div class="life-box" @click="openCalc(player)">
          <h1 style="text-align:start">{{player}}</h1>
          <div class="life-display">
            <span>LP</span>
            <span>{{life}}</span>
            </div>
        </div>
      </div>
    </div>
    <Calculator :isShow.sync="isShowCalc" @result="calcLife"></Calculator>
  </div>
</template>

<script>
import Calculator from './components/Calculator.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations } = createNamespacedHelpers('life')

export default {
  name: 'App',
  data() {
    return {
      calcPlayer : '',
      isShowCalc : false
    }
  },
  components: {
    Calculator
  },
  mounted(){
    this.initialize2Players()
  },
  computed : {
  },
  methods: {
    openCalc(player){
      console.log({player})
      this.calcPlayer = player
      this.isShowCalc = true
    },
    calcLife(value){
      const player = this.calcPlayer
      this.addChangeHistory([player, value])
    },
    closeCalc(){
      this.isShowCalc = false
    },
    ...mapMutations([
      'initialize2Players',
      'addChangeHistory',
    ]),
    ...mapGetters([
      'lifes'
    ])
  },
}
</script>

<style>
body {
  height: 100vh;
  margin: 0px;
}
.life-box {
  position: absolute;
  bottom: 0;
  width: calc( 100% - 20px );
  padding : 10px;
  background: rgba(255,255,255,0.8);
}
.life-display {
  display: flex;
  justify-content: space-between;
  font-size: 86px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
