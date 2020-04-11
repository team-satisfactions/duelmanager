import { firestoreAction } from 'vuexfire'
import {db} from "../plugins/firebase";

export default {
  namespaced: true,
  state: {
      rollN: 1,
  },
  mutations: {
    setRollN(state,rollN) {
      state.rollN = rollN
    }
  },
  actions: {
    tossRollN: firestoreAction( ({ state, commit, bindFirestoreRef }) => {
      return db.collection('duels').add(state.histories).then((docRef) => {
          commit('setDuelId', docRef.id);
          return bindFirestoreRef('histories', docRef);
      });
    })
  }
}
