import { db } from "@/plugins/firebase";

export default {
  namespaced: true,
  state: {
    duelId: null,
  },
  mutations: {
    setDuelId(state, duelId) {
      state.duelId = duelId;
    },
  },
  getters: {
    duelRef(state) {
      return db.collection("duels").doc(state.duelId);
    },
  },
  actions: {
    async getDuel({ state }) {
      return db.collection("duels").doc(state.duelId).get();
    },
    async waitInitialized({ state }) {
      while (!state.duelId) {
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      }
    },
  },
};
