import Vue from 'vue'
import Vuex from 'vuex'
import life from './store/life'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    life
  }
});
