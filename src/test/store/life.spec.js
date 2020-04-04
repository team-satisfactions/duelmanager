import Vuex from 'vuex';
import life from '../../store/life';
import { createLocalVue } from '@vue/test-utils';

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
                  {"active": true, "value": 100},
                  {"active": true, "value": 200},
                  {"active": true, "value": 300},
              ];
          });
          test('計算結果は600になる', () => {
              expect(store.getters['life']('player')).toBe(600);
          })
       });
   });
});
