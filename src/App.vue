<template>
  <div id="app">
    <audio id="life" preload="auto" ref="life-sound">
      <source src="./assets/SE/life-full.wav" type="audio/mp3">
    </audio>
    <img class="logo" alt="Vue logo" src="./assets/logo.png" @click="resetHistory()">
    <img class="logo" alt="Coin logo" src="./assets/coin.png" @click="isShowCoin = true">
    <div style="display:flex; justify-content: space-around;">
      <div v-for="(life,player) in viewLifes()" :key="player" style="position:relative;">
        <img :src="'https://github.com/' + playerNames[player] + '.png'" :alt="player" style="width:400px;">
        <div class="life-box" @click="openCalc(player)">
          <h1 style="text-align:start">{{playerNames[player]}}</h1>
          <div class="life-display">
            <span>LP</span>
            <span>{{life}}</span>
          </div>
        </div>
      </div>
    </div>
    <Calculator :isShow.sync="isShowCalc" @result="calcLife"></Calculator>
    <CoinToss :isShow.sync="isShowCoin"></CoinToss>
  </div>
</template>

<script>
  import Calculator from './components/Calculator.vue'
  import CoinToss from './components/CoinToss.vue'
  import { createNamespacedHelpers } from 'vuex'
  import queryString from 'query-string'
  const { mapGetters, mapActions } = createNamespacedHelpers('life')

  export default {
    name: 'App',
    data() {
      return {
        calcPlayer : '',
        isShowCalc : false,
        isShowCoin : false,
        isRealLife : true,
        viewLifes_ : null,
        playerNames: {
          player1: "higumachan",
          player2: "amanoese",
        }
      }
    },
    components: {
      Calculator,
      CoinToss
    },
    mounted(){
      const parsed = queryString.parse(location.search);

      console.log(parsed);

      if (parsed['player1']) {
        this.playerNames.player1 = parsed['player1'];
      }
      if (parsed['player2']) {
        this.playerNames.player2 = parsed['player2'];
      }

      const hash = location.hash.slice(1);
      if (!hash) {
        this.createNewDuel().then(() => {
          location.hash = "#" + this.$store.state.life.duelId;
        });
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
        'resetHistory',
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
        let oldValue = nowValue()

        let time = 900;
        let dt   = 50
        let v = Math.floor(newValue - oldValue);
        let myLogistic = x => 0.5 * (Math.tanh(Math.PI * ( 2 * x - 1)) + 1);

        if(this.$refs['life-sound']){
          this.$refs['life-sound'].play();
        }

        // TODO(higumachan): SoundManager的なやつを作る
        document.getElementById("life").play();
        await new Promise((resolve)=>{
          let startTime = +(new Date())

          let interval = () => {
            let t = (+(new Date())-startTime)
            let x = t / time

            if(t > time) {
              console.log('resolve()')
              resolve()
              return
            }
            this.viewLifes_[player] = Math.floor(oldValue + myLogistic(x) * v)
            setTimeout(interval.bind(this),dt)
          };
          interval();
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
  .logo {
    height: 25vh;
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
