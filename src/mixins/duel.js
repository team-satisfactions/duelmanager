import {createNamespacedHelpers} from "vuex";

const { mapActions, } = createNamespacedHelpers("life");


export default {
  mounted() {
    const hash = location.hash.slice(1);
    if (!hash) {
      this.createNewDuel().then(() => {
        location.hash = "#" + this.$store.state.duel.duelId;
      });
    } else {
      this.enterExistDuel(hash);
    }
    this.url = window.location;
  },
  methods: {
    ...mapActions([
      "createNewDuel",
      "enterExistDuel",
    ])
  }

};
