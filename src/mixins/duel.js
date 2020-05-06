import { createNamespacedHelpers } from "vuex";

const { mapActions } = createNamespacedHelpers("life");

export default {
  mounted() {
    const hash = location.hash.slice(1);
    if (!this.urlDuelId) {
      this.createNewDuel().then(() => {
        //location.hash = "#" + this.$store.state.duel.duelId;
        return this.onCreatedNewDuel(this.$store.state.duel.duelId);
      });
    } else {
      this.enterExistDuel(hash);
    }
    this.url = window.location;
  },
  methods: {
    ...mapActions(["createNewDuel", "enterExistDuel"]),
    async onCreatedNewDuel(duelId) {  // eslint-disable-line
      console.error("not implemented");
    }
  },
  computed: {
    urlDuelId() {
      return this.$route.params.duelId;
    }
  }
};
