import { db } from "@/plugins/firebase";
import {firestoreAction} from "vuexfire";

export default {
  namespaced: true,
  state: {
    duelId: null,
    playerRTCIds: {
      player1: null,
      player2: null,
    }
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
    async getDuel({ state, dispatch }) {
      await dispatch("waitInitialized");
      return db.collection("duels").doc(state.duelId).get();
    },
    async setRTCId({state, dispatch}, {player, RTCId}) {
      await dispatch('waitInitialized');
      let playerRTCIds = { ...state.playerRTCIds };
      console.log({player, RTCId});
      playerRTCIds[player] = RTCId;
      let duel = await dispatch('getDuel');
      return duel.get('playerRTCIds').update(playerRTCIds);
    },
    async waitInitialized({ state }) {
      while (!state.duelId) {
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      }
    },
    bindPlayerRTCIds: firestoreAction(({ dispatch, bindFirestoreRef }) => {
      return dispatch('waitInitialized').then(() => {
        return dispatch('getDuel').then((duel) => {
          return bindFirestoreRef("playerRTCIds", duel.get("playerRTCIds"));
        });
      });
    }),
  },
};
