import Vuex from 'vuex';
import life from '../../store/life.js';
import { createLocalVue } from '@vue/test-utils';
import {HistoryType} from "../../store/types.js";

const localVue = createLocalVue();

localVue.use(Vuex);


describe('store/life.js', () => {
   let store ;
   beforeEach(() => {
      store = new Vuex.Store(life);
   });
   describe('getters', () => {
       describe('life', () => {
          beforeEach(() => {
              store.state.players = ["player"];
              store.state.histories["player"] = [
                  {"active": true, "type": HistoryType.get("SET"), "value": 8000},
                  {"active": true, "type": HistoryType.get("CHANGE"), "value": -100},
                  {"active": true, "type": HistoryType.get("CHANGE"), "value": -200},
                  {"active": true, "type": HistoryType.get("CHANGE"), "value": -300},
              ];
          });
          test('計算結果は7400になる', () => {
              expect(store.getters['life']('player')).toBe(7400);
          })
       });
   });
   describe('mutations', () => {
       describe('initialize', () => {
           describe('set2Players', () => {
               beforeEach(() => {
                   store.commit('initialize2Players');
               })
               test('ライフ8000スタート', () => {
                   expect(store.getters['life']('player1')).toBe(8000);
                   expect(store.getters['life']('player2')).toBe(8000);
               })
           })
       })
   })
});
