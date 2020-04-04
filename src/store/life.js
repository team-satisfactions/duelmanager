import { sum } from 'mathjs'

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
                state.histories[player] = []
            });
        },
        addHistory(state, [player, value]) {
            state.histories[player].push({
                value,
                active: true,
            });
        },
    },
    getters: {
        life(state) {
            return (player) => {
                return sum(state.histories[player].filter((b) => {
                    return b.active
                }).map((b) => b.value));
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
