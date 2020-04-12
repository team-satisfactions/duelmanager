import { sum } from "mathjs";
import _ from "lodash";
import { HistoryType } from "./types.js";
import { firestoreAction } from "vuexfire";
import { db } from "../plugins/firebase";

let DEFAULT_START_LIFE_POINT = 8000;

export default {
  namespaced: true,
  state: {
    histories: {},
    playerNames: {},
  },
  mutations: {
    initialize2Players(state) {
      state.playerNames = { player1: "player1", player2: "player2" };
      Object.keys(state.playerNames).forEach((player) => {
        state.histories[player] = [
          {
            value: DEFAULT_START_LIFE_POINT,
            type: HistoryType.SET,
            active: true,
          },
        ];
      });
    },
  },
  getters: {
    players(state) {
      return Object.keys(state.playerNames).sort();
    },
    life(state) {
      return (player) => {
        let actives = state.histories[player].filter((b) => b.active);
        let tailChanges = _.takeRightWhile(
          actives,
          (b) => b.type === HistoryType.CHANGE
        ).map((b) => b.value);
        tailChanges.push(0);
        let lastSet =
          actives[_.findLastIndex(actives, (b) => b.type === HistoryType.SET)];
        return Math.max(lastSet.value + sum(tailChanges), 0);
      };
    },
    lifes(state, getters) {
      let ret = {};
      getters.players.forEach((player) => {
        ret[player] = getters.life(player);
      });
      return ret;
    },
  },
  actions: {
    async addChangeHistory({ state, dispatch }, [player, value]) {
      let histories = { ...state.histories };
      let newValue = {
        value,
        type: HistoryType.CHANGE,
        active: true,
      };

      histories[player] = [...state.histories[player], newValue];

      return dispatch("updateHistories", histories);
    },
    async modifyHistoryActive({ state, dispatch }, [player, index, active]) {
      let histories = { ...state.histories };
      histories[player] = [...state.histories[player]];
      histories[player][index].active = active;

      return dispatch("updateHistories", histories);
    },
    async setPlayerName({ state, dispatch }, [player, name]) {
      const playerNames = { ...state.playerNames };
      playerNames[player] = name;
      const duel = await dispatch("duel/getDuel", null, { root: true });
      return duel.get("playerNames").update(playerNames);
    },
    async updateHistories({ dispatch }, histories) {
      const duel = await dispatch("duel/getDuel", null, { root: true });
      return duel.get("histories").update(histories);
    },
    async resetHistory({ state, dispatch, getters }) {
      let histories = { ...state.histories };
      getters.players.forEach((player) => {
        histories[player] = [
          {
            value: DEFAULT_START_LIFE_POINT,
            type: HistoryType.SET,
            active: true,
          },
        ];
      });
      return dispatch("updateHistories", histories);
    },
    createNewDuel: firestoreAction(
      ({ state, getters, commit, bindFirestoreRef }) => {
        commit("initialize2Players");
        const hp = db.collection("histories").add(state.histories);
        const pp = db.collection("playerNames").add(state.playerNames);
        return Promise.all([hp, pp]).then(
          ([historiesDocRef, playersDocRef]) => {
            return db
              .collection("duels")
              .add({
                histories: historiesDocRef,
                playerNames: playersDocRef,
              })
              .then((docRef) => {
                getters.players.forEach((player) => {
                  state.histories[player].forEach((history) => {
                    docRef.collection(player).add(history);
                  });
                });
                commit("duel/setDuelId", docRef.id, { root: true });
                Promise.all([
                  bindFirestoreRef("histories", historiesDocRef),
                  bindFirestoreRef("playerNames", playersDocRef),
                ]);
              });
          }
        );
      }
    ),
    enterExistDuel: firestoreAction(
      ({ commit, dispatch, bindFirestoreRef }, duelId) => {
        commit("initialize2Players");
        commit("duel/setDuelId", duelId, { root: true });
        return dispatch("duel/getDuel", null, { root: true }).then((duel) => {
          return Promise.all([
            bindFirestoreRef("histories", duel.get("histories")),
            bindFirestoreRef("playerNames", duel.get("playerNames")),
          ]);
        });
      }
    ),
  },
};
