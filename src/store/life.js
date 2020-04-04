import { sum } from 'mathjs'
import _ from 'lodash';
import {HistoryType} from "./types.js";


let DEFAULT_START_LIFE_POINT = 8000;

export default {
    namespaced: true,
    state: {
        histories: {},
        players: [],
    },
    mutations: {
        initialize2Players(state) {
            state.players = ["player1", "player2"];
            state.players.forEach((player) => {
                state.histories[player] = [{
                    value: DEFAULT_START_LIFE_POINT,
                    type: HistoryType.get("SET"),
                    active: true,
                }]
            });
        },
        addChangeHistory(state, [player, value]) {
            state.histories[player].push({
                value,
                type: HistoryType.get("CHANGE"),
                active: true,
            });
        },
    },
    getters: {
        life(state) {
            return (player) => {
                let actives = state.histories[player].filter(b => b.active);
                let tailChanges = _.takeRightWhile(actives, (b) => b.type === HistoryType.get("CHANGE")).map((b) => b.value);
                tailChanges.push(0);
                let lastSet = actives[_.findLastIndex(actives, (b) => b.type === HistoryType.get("SET"))];
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
    }
}
