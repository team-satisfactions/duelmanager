import { firestoreAction } from "vuexfire";

export default {
  namespaced: true,
  state: {
    voicelogs: {},
  },
  actions: {
    initializeVoiceLog: firestoreAction(async ({ state, rootGetters, bindFirestoreRef }) => {
      const duel = rootGetters['duel/duelRef']
      await duel.collection("voicelogs").add(state.voicelogs)

      const newLogs = duel
        .collection("voicelogs")
        .orderBy('time', 'desc')
        .limit(10);
      return bindFirestoreRef("voicelogs",newLogs);
    }),
    async updateVoiceLogs({ rootGetters }, log) {
      const duel = rootGetters['duel/duelRef']
      const voicelogs_doc = await duel.collection("voicelogs")
      await voicelogs_doc.add({
        time: +Date.now(),
        text: log
      })
    },
  },
};

