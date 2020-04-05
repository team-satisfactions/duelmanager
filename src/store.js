import Vue from 'vue'
import Vuex from 'vuex'
import life from './stores/life'
import {vuexfireMutations} from "vuexfire";


Vue.use(Vuex)

export const store = new Vuex.Store({
  mutations: vuexfireMutations,
  modules: {
    life,
  }
});
