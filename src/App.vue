<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div style="display:flex; justify-content: space-around;">
      <div v-for="(life,player) in viewLifes()" :key="player" style="position:relative;">
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
  const { mapGetters, mapActions } = createNamespacedHelpers('life')

  export default {
    name: 'App',
    data() {
      return {
        calcPlayer : '',
        isShowCalc : false,
        isRealLife : true,
        viewLifes_ : null
      }
    },
    components: {
      Calculator
    },
    mounted(){
        const hash = location.hash.slice(1);
        if (!hash) {
          this.createNewDuel();
        }
        else {
          this.enterExistDuel(hash);
        }
    },
    computed : {
      ...mapGetters([
        'lifes'
      ]),
    },
    methods: {
      ...mapActions([
        'createNewDuel',
        'addChangeHistory',
        'enterExistDuel',
      ]),
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
      viewLifes() {
        return this.isRealLife ? this.lifes : this.viewLifes_
      },
      async viewLifeCalc(){
        this.isRealLife = false

        let newLifes = this.lifes

        let diffPlayers = Object.keys(this.viewLifes_).filter(key=>{
          return newLifes[key] != this.viewLifes_[key]
        })
        let player   = diffPlayers[0]
        let newValue = newLifes[player]
        let nowValue = () => this.viewLifes_[player]

        let time = 500
        let dt = time / 50
        let dv = Math.floor((newValue - nowValue()) / (time / dt))

        await new Promise((resolve)=>{
          let f = () =>{
            this.viewLifes_[player] += dv
            if( (dv <= 0 && newValue < nowValue())
                    ||(dv >  0 && newValue > nowValue()) ) {
              setTimeout(f,dt)
              return
            }
            console.log('resolve()')
            resolve()
            return
          };
          f();
        })
        this.isRealLife = true
        this.viewLifes_ = newLifes
      },
    },
    watch: {
      lifes(newLifes){
        if(this.viewLifes_ == null) {
          this.viewLifes_ = newLifes
          return
        }
        this.viewLifeCalc()
      }
    }
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
