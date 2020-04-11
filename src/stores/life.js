import { sum } from 'mathjs'
import _ from 'lodash';
import {HistoryType} from "./types.js";
import { firestoreAction } from 'vuexfire'
import {db} from "../plugins/firebase";



let DEFAULT_START_LIFE_POINT = 8000;

export default {
    namespaced: true,
    state: {
        histories: {},
        player_names: {},
        duelId: null,
    },
    mutations: {
        initialize2Players(state) {
            state.player_names = {"player1": "player1", "player2": "player2"};
            Object.keys(state.player_names).forEach((player) => {
                state.histories[player] = [{
                    value: DEFAULT_START_LIFE_POINT,
                    type: HistoryType.SET,
                    active: true,
                }];
            });
        },
        setDuelId(state, duelId) {
            state.duelId = duelId
        }
    },
    getters: {
        players(state) {
            return Object.keys(state.player_names);
        },
        life(state) {
            return (player) => {
                let actives = state.histories[player].filter(b => b.active);
                let tailChanges = _.takeRightWhile(actives, (b) => b.type === HistoryType.CHANGE).map((b) => b.value);
                tailChanges.push(0);
                let lastSet = actives[_.findLastIndex(actives, (b) => b.type === HistoryType.SET)];
                return Math.max(lastSet.value + sum(tailChanges), 0);
            }
        },
        lifes(state, getters) {
            let ret = {};
            getters.players.forEach((player) => {
                ret[player] = getters.life(player)
            });
            return ret;
        }
    },
    actions: {
        addChangeHistory({ state, dispatch }, [player, value]) {
            let histories = { ...state.histories };
            let newValue = {
                value,
                type: HistoryType.CHANGE,
                active: true,
            };

            histories[player] = [ ...state.histories[player], newValue ];

            return dispatch('getDuel').then((duel) => {
                return duel.get('histories').update(histories);
            });
        },
        getDuel({ state }) {
            return db.collection('duels')
                .doc(state.duelId).get();
        },
        resetHistory({ state, getters }) {
            let histories = { ...state.histories };
            getters.players.forEach((player) => {
                histories[player] = [{
                    value: DEFAULT_START_LIFE_POINT,
                    type: HistoryType.SET,
                    active: true,
                }];
            });
            db.collection('duels')
                .doc(state.duelId)
                .update(histories)
        },
        createNewDuel: firestoreAction( ({ state, getters, commit, bindFirestoreRef }) => {
            commit('initialize2Players');
            const hp = db.collection('histories').add(state.histories);
            const pp = db.collection('player_names').add(state.player_names);
            return Promise.all([hp, pp]).then(([historiesDocRef, playersDocRef]) => {
                return db.collection('duels').add({
                    histories: historiesDocRef,
                    player_names: playersDocRef,
                }).then((docRef) => {
                    getters.players.forEach((player) => {
                        state.histories[player].forEach((history) => {
                            docRef.collection(player).add(history);
                        });
                    });
                    commit('setDuelId', docRef.id);
                    Promise.all([bindFirestoreRef('histories', historiesDocRef),
                        bindFirestoreRef('player_names', playersDocRef)]);
                });
            });

        }),
        enterExistDuel: firestoreAction( ({ commit, bindFirestoreRef }, duelId) => {
            commit('initialize2Players');
            commit('setDuelId', duelId);
            return db.collection('duels').doc(duelId).get().then((doc) => {
                return bindFirestoreRef('histories', doc.get("histories"));
            });
        }),
    }
}
