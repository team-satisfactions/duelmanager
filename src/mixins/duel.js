import { createNamespacedHelpers } from "vuex";

const { mapActions } = createNamespacedHelpers("life");

export default {
  mounted() {
    if (!this.urlDuelId) {
      this.createNewDuel().then(() => {
        //location.hash = "#" + this.$store.state.duel.duelId;
        return this.onCreatedNewDuel(this.$store.state.duel.duelId);
      });
    } else {
      this.enterExistDuel(this.urlDuelId);
    }
    this.url = window.location;
  },
  methods: {
    ...mapActions(["createNewDuel", "enterExistDuel"]),
    // eslint-disable-next-line
    async onCreatedNewDuel(duelId) {
      console.error("not implemented");
    }
  },
  computed: {
    urlDuelId() {
      return this.$route.params.duelId;
    }
  }
};
