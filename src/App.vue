<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div style="display:flex;">
      lifes:{{lifes}}
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
