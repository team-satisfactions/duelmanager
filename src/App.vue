<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div style="display:flex; justify-content: space-around;">
      <div v-for="(life,player) in lifes" :key="player">
        <h1 style="text-align:start">{{player}}</h1>
        <div class="font-big">LP {{life}}</div>
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
