import firebase from "firebase";

export default {
  namespaced: true,
  state: {
    coinFaces: [],
  },
  mutations: {
    addCoinRolls(state, coinFace) {
      const coinFaces = [...state.coinFaces];
      coinFaces.push(coinFace);
      state.coinFaces = coinFaces;
    },
  },
  actions: {
    async tossToShare({ rootGetters }, coinFace) {
      const duelRef = rootGetters["duel/duelRef"];
      console.log(duelRef);
      console.log(coinFace);
      return duelRef.collection("coinRolls").add({
        coinFace: coinFace,
        timestamp: firebase.firestore.Timestamp.now(),
      });
    },
    async subscribeFirestoreCoinRolls({ dispatch }) {
      await dispatch('waitInitialized');
      console.log(this.$store.state.duel);
      const duelRef = this.duelRef;
      const now = firebase.firestore.Timestamp.now();
      console.log(duelRef.collection);
      duelRef.collection("coinRolls").orderBy('timestamp', "desc").where("timestamp", '>', now).limit(1).onSnapshot(async (collectionSnapshot) => {
        console.log(collectionSnapshot.empty);
        if (collectionSnapshot.empty) {
          return;
        }
        console.log(collectionSnapshot[0]);
        const snapshot = collectionSnapshot[0];
        this.$store.commit('addCoinRolls', snapshot.coinFace);
      });
    },
    rolls({ state, dispatch }) {
      return dispatch("duel/getDuel", null, { root: true })
        .then((duel) => {
          duel.collection("coinRolls").on('child_added', (childSnapshot) => {
            const coinRolls = [...state.coinRolls];
            coinRolls.push(childSnapshot);
            state.coinRolls = coinRolls;
          });
        });
    },
  },
};
