<template>
  <div id="app">
    <audio id="life" preload="auto" ref="life-sound">
    </audio>
    <div class="header">
      <div
        class="logo-wrapper"
        @click="resetHistory()">
        <img
          class="logo"
          alt="Vue logo"
          src="./assets/logo.png"
        />
        <img
          class="logo-mini"
          alt="Vue logo"
          src="./assets/logo-mini.png"
        />
      </div>
      <img
        class="logo"
        alt="Coin logo"
        src="./assets/coin.png"
        @click="isShowCoin = true"
      />
    </div>
    <div style="display: flex; justify-content: space-around;"
         @keypress.left="openCalc(Object.keys(playerNames)[0]);">
      <div
        v-for="(life, player) in viewLifes()"
        :key="player"
        style="position: relative;"
      >
        <img
          :src="'https://github.com/' + playerNames[player] + '.png'"
          :alt="player"
          style="width: 400px;"
        />
        <div class="life-box" @click="openCalc(player)">
          <h1 style="text-align: start;">
            {{ playerNames[player] }}
            <img
              style="margin-left: 1%;"
              @click.stop="
                showPlayerNameModal = true;
                editingPlayer = player;
              "
              src="./assets/edit.svg"
              width="20vm"
              alt=""
            />
            <img
              style="margin-left: 1%;"
              @click.stop="
                showEditHistoryModal = true;
                editingPlayer = player;
              "
              src="./assets/editHistory.svg"
              width="20vm"
              alt=""
            />
          </h1>
          <div class="life-display">
            <span>LP</span>
            <span>{{ life }}</span>
          </div>
        </div>
      </div>
    </div>
    <h3 class="url-head">URLを共有して友達とデュエルだ！</h3>
    <p class="url-text">{{ url }}</p>
    <Calculator :player="calcPlayer" :isShow.sync="isShowCalc" @result="calcLife"></Calculator>
    <CoinToss :isShow.sync="isShowCoin"></CoinToss>
    <Modal v-if="showPlayerNameModal" @close="showPlayerNameModal = false">
      <h3 slot="header">Playerの名前を設定してください</h3>
      <div slot="body">
        <input
          type="text"
          @keypress.enter="submitPlayerNameModel"
          v-model="editingName"
          autocomplete="on"
          list="player-history"
        />
        <datalist id="player-history">
          <option value="higumachan"></option>
          <option value="amanoese"></option>
          <option value="goya813"></option>
          <option value="archiba"></option>
        </datalist>
        <button @click="submitPlayerNameModel">OK</button>
      </div>
      <div slot="footer"></div>
    </Modal>
    <EditHistory
      v-if="showEditHistoryModal"
      :player="editingPlayer"
      @close="showEditHistoryModal = false"
    ></EditHistory>
    <VoiceSearch></VoiceSearch>
  </div>
</template>

<script>
import Calculator from "./components/Calculator.vue";
import CoinToss from "./components/CoinToss.vue";
import VoiceSearch from "./components/VoiceSearch.vue";
import { createNamespacedHelpers } from "vuex";
import Modal from "@/components/Modal";
import EditHistory from "@/components/EditHistory";
const { mapGetters, mapActions, mapState } = createNamespacedHelpers("life");

export default {
  name: "App",
  data() {
    return {
      calcPlayer: "",
      isShowCalc: false,
      isShowCoin: false,
      isRealLife: true,
      viewLifes_: null,
      editingPlayer: null,
      showPlayerNameModal: false,
      editingName: "",
      showEditHistoryModal: false,
      url: '',
    };
  },
  components: {
    Modal,
    EditHistory,
    CoinToss,
    Calculator,
    VoiceSearch,
  },
  mounted() {
    const hash = location.hash.slice(1);
    if (!hash) {
      this.createNewDuel().then(() => {
        location.hash = "#" + this.$store.state.duel.duelId;
      });
    } else {
      this.enterExistDuel(hash);
    }
    this.url = window.location

    window.addEventListener('keyup', (e) => {
      console.log(e.key);
      if (e.key === 'ArrowLeft') {
        this.openCalc(Object.keys(this.playerNames)[1]);
      }
      if (e.key === 'ArrowRight') {
        this.openCalc(Object.keys(this.playerNames)[0]);
      }
    });
  },
  computed: {
    ...mapState(["playerNames"]),
    ...mapGetters(["lifes"]),
  },
  methods: {
    ...mapActions([
      "createNewDuel",
      "addChangeHistory",
      "enterExistDuel",
      "resetHistory",
      "setPlayerName",
    ]),
    openCalc(player) {
      this.calcPlayer = player;
      this.isShowCalc = true;
    },
    calcLife(value) {
      const player = this.calcPlayer;
      this.addChangeHistory([player, value]);
    },
    submitPlayerNameModel() {
      if (this.editingName) {
        this.setPlayerName([this.editingPlayer, this.editingName]);
      }
      this.showPlayerNameModal = false;
      this.editingName = "";
      this.editingPlayer = null;
    },
    closeCalc() {
      this.isShowCalc = false;
    },
    viewLifes() {
      return this.isRealLife ? this.lifes : this.viewLifes_;
    },
    async viewLifeCalc() {
      this.isRealLife = false;

      let newLifes = this.lifes;

      let effectPromises = Object.keys(this.viewLifes_)
        .filter((key) => {
          return newLifes[key] !== this.viewLifes_[key];
        })
        .map((key) => {
          let player = key;
          let newValue = newLifes[player];
          let nowValue = () => this.viewLifes_[player];
          let oldValue = nowValue();

          let time = 900;
          let dt = 50;
          let v = Math.floor(newValue - oldValue);
          let myLogistic = (x) => 0.5 * (Math.tanh(Math.PI * (2 * x - 1)) + 1);

          //if (this.$refs["life-sound"]) {
          //  // TODO(higumachan): SoundManager的なやつを作る
          //  this.$refs["life-sound"].play();
          //}

          return new Promise((resolve) => {
            let startTime = +new Date();

            let interval = () => {
              let t = +new Date() - startTime;
              let x = t / time;

              if (t > time) {
                console.log("resolve()");
                resolve();
                return;
              }
              this.viewLifes_[player] = Math.floor(
                oldValue + myLogistic(x) * v
              );
              setTimeout(interval.bind(this), dt);
            };
            interval();
          });
        });

      await Promise.all(effectPromises);

      this.isRealLife = true;
      this.viewLifes_ = newLifes;
    },
  },
  watch: {
    lifes(newLifes) {
      if (this.viewLifes_ == null) {
        this.viewLifes_ = newLifes;
        return;
      }
      this.viewLifeCalc();
    },
  },
};
</script>

<style>
body {
  height: 100vh;
  margin: 0px;
}
.header {
  display:flex;
  justify-content:center;
}
.logo-wrapper {
  position:relative;
}
.logo {
  height: 25vh;
}
.logo-mini {
  position: absolute;
  height: 25vh ;
  left: 0;
  filter: drop-shadow(2px 2px 1px rgba(0,0,0,0.8));
}
.logo-mini:active {
  filter: drop-shadow(0px 0px 1px rgba(0,0,0,1));
}
.life-box {
  position: absolute;
  bottom: 0;
  width: calc(100% - 20px);
  padding: 10px;
  background: rgba(255, 255, 255, 0.8);
}
.life-display {
  display: flex;
  justify-content: space-between;
  font-size: 86px;
}
.url-head {
  margin-bottom:0px;
}
.url-text {
  margin-top:0px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
