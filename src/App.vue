<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div style="display:flex; justify-content: space-around;">
      <div v-for="(life,player) in lifes" :key="player" style="position:relative;">
        <img :src="'/' + player + '.jpeg'" :alt="player" style="width:400px;">
        <div class="life-box">
          <h1 style="text-align:start">{{player}}</h1>
          <div class="font-big">LP {{life}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations } = createNamespacedHelpers('life')

export default {
  name: 'App',
  mounted(){
    this.initialize2Players()
    this.addHistory({player:'player1', value : 8000})
    this.addHistory({player:'player2', value : 8000})
  },
  computed : {
    ...mapGetters([
      'lifes'
    ])
  },
  methods: {
    ...mapMutations([
      'initialize2Players',
      'addHistory',
    ]),
  },
}
</script>

<style>
.font-big {
  font-size: 96px;
}
body {
  height: 100vh;
  margin: 0px;
}
.life-box {
  width: 100%;
  padding : 10px;
  position: absolute;
  bottom: 0;
  background: rgba(255,255,255,0.8);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
