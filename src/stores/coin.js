import firebase from "firebase";

export default {
  namespaced: true,
  state: {
    lastCoinFace: null,
    timestamp : null
  },
  mutations: {
    setCoinRolls(state, {coinFace,timestamp}) {
      state.lastCoinFace = coinFace;
      state.timestamp = timestamp;
    },
  },
  actions: {
    async tossToShare({ rootGetters }, coinFace) {
      const duelRef = rootGetters["duel/duelRef"];
      return duelRef.collection("coinRolls").add({
        coinFace: coinFace,
        timestamp: firebase.firestore.Timestamp.now(),
      });
    },
    async subscribeFirestoreCoinRolls({ rootGetters, commit, dispatch }) {
      await dispatch("duel/waitInitialized", null, { root: true });
      const duelRef = rootGetters["duel/duelRef"];
      const now = firebase.firestore.Timestamp.now();
      duelRef
        .collection("coinRolls")
        .orderBy("timestamp", "desc")
        .where("timestamp", ">", now)
        .limit(1)
        .onSnapshot(async (collectionSnapshot) => {
          if (collectionSnapshot.empty) {
            return;
          }
          const snapshot = collectionSnapshot.docs[0];
          commit("setCoinRolls", {
            coinFace: snapshot.get("coinFace"),
            timestamp:snapshot.get("timestamp")
          });
        });
    },
    rolls({ state, dispatch }) {
      return dispatch("duel/getDuel", null, { root: true }).then((duel) => {
        duel.collection("coinRolls").on("child_added", (childSnapshot) => {
          const coinRolls = [...state.coinRolls];
          coinRolls.push(childSnapshot);
          state.coinRolls = coinRolls;
        });
      });
    },
  },
};
