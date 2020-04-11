<template>
  <div id="app">
    <audio id="life" preload="auto" ref="life-sound">
      <source src="./assets/SE/life-full.wav" type="audio/mp3">
    </audio>
    <img alt="Vue logo" src="./assets/logo.png" @click="resetHistory()">
    <div style="display:flex; justify-content: space-around;">
      <div v-for="(life,player) in viewLifes()" :key="player" style="position:relative;">
        <img @click="showPlayerNameModal = true; editingPlayer = player;" :src="'https://github.com/' + playerNames[player] + '.png'" :alt="player" style="width:400px;">
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
    <Modal v-if="showPlayerNameModal">
      <h3 slot="header">Playerの名前を設定してください</h3>
      <div slot="body">
        <input type="text" v-model="editingName" />
        <button @click="submitPlayerNameModel">OK</button>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import Calculator from './components/Calculator.vue'
  import { createNamespacedHelpers } from 'vuex'
  import Modal from "@/components/Modal";
  const { mapGetters, mapActions, mapState } = createNamespacedHelpers('life')

  export default {
    name: 'App',
    data() {
      return {
        calcPlayer : '',
        isShowCalc : false,
        isRealLife : true,
        viewLifes_ : null,
        editingPlayer: null,
        showPlayerNameModal: false,
        editingName: "",
      }
    },
    components: {
      Modal,
      Calculator
    },
    mounted(){
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
      ...mapState([
          'playerNames',
      ]),
      ...mapGetters([
        'lifes',
      ]),
    },
    methods: {
      ...mapActions([
        'createNewDuel',
        'addChangeHistory',
        'enterExistDuel',
        'resetHistory',
        'setPlayerName',
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
      submitPlayerNameModel() {
        if (this.editingName) {
          this.setPlayerName([this.editingPlayer, this.editingName]);
        }
        this.showPlayerNameModal = false;
        this.editingName = "";
        this.editingPlayer = null;
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


        let effectPromises = Object.keys(this.viewLifes_).filter(key=>{
          return newLifes[key] != this.viewLifes_[key]
        }).map(key=>{
          let player   = key
          let newValue = newLifes[player]
          let nowValue = () => this.viewLifes_[player]
          let oldValue = nowValue()

          let time = 900;
          let dt   = 50
          let v = Math.floor(newValue - oldValue);
          let myLogistic = x => 0.5 * (Math.tanh(Math.PI * ( 2 * x - 1)) + 1);

          if(this.$refs['life-sound']){
            // TODO(higumachan): SoundManager的なやつを作る
            this.$refs['life-sound'].play();
          }

          return new Promise((resolve)=>{
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
        })

        await Promise.all(effectPromises)

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
