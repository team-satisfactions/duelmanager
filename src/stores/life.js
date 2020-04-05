import { sum } from 'mathjs'
import _ from 'lodash';
import {HistoryType} from "./types.js";
import { firestoreAction } from 'vuexfire'
import {db} from "@/plugins/firebase";



let DEFAULT_START_LIFE_POINT = 8000;

export default {
    namespaced: true,
    state: {
        histories: {},
        players: [],
        duelId: null,
    },
    mutations: {
        initialize2Players(state) {
            state.players = ["player1", "player2"];
            state.players.forEach((player) => {
                state.histories[player] = [{
                    value: DEFAULT_START_LIFE_POINT,
                    type: HistoryType.SET,
                    active: true,
                }];
            });
        },
    },
    getters: {
        life(state) {
            return (player) => {
                let actives = state.histories[player].filter(b => b.active);
                let tailChanges = _.takeRightWhile(actives, (b) => b.type === HistoryType.CHANGE).map((b) => b.value);
                tailChanges.push(0);
                let lastSet = actives[_.findLastIndex(actives, (b) => b.type === HistoryType.SET)];
                return lastSet.value + sum(tailChanges);
            }
        },
        lifes(state, getters) {
            let ret = {};
            state.players.forEach((player) => {
                ret[player] = getters.life(player)
            });
            return ret;
        }
    },
    actions: {
        addChangeHistory({ state }, [player, value]) {
            let histories = { ...state.histories }
            let newValue = {
                value,
                type: HistoryType.CHANGE,
                active: true,
            };

            histories[player] = [ ...state.histories[player], newValue ];
            db.collection('duels')
                .doc(state.duelId)
                .update(histories)
        },
        createNewDuel: firestoreAction( ({ state, commit, bindFirestoreRef }) => {
            commit('initialize2Players');
            db.collection('duels').add(state.histories).then((docRef) => {
                bindFirestoreRef('histories', docRef);
                state.duelId = docRef.id;
            });
        }),
        enterExistDuel: firestoreAction( ({ bindFirestoreRef }, duelId) => {
            bindFirestoreRef('histories', db.collection('duels').doc(duelId));
        }),
    }
}
