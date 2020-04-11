import Vuex from "vuex";
import life from "../../stores/life.js";
import { createLocalVue } from "@vue/test-utils";
import { HistoryType } from "../../stores/types.js";

const localVue = createLocalVue();

localVue.use(Vuex);

describe("stores/life.js", () => {
  let store;
  beforeEach(() => {
    store = new Vuex.Store(life);
  });
  describe("getters", () => {
    describe("life", () => {
      describe("通常の計算", () => {
        beforeEach(() => {
          store.state.players = ["player"];
          store.state.histories["player"] = [
            { active: true, type: HistoryType.SET, value: 8000 },
            { active: true, type: HistoryType.CHANGE, value: -100 },
            { active: true, type: HistoryType.CHANGE, value: -200 },
            { active: true, type: HistoryType.CHANGE, value: -300 },
          ];
        });
        test("計算結果は7400になる", () => {
          expect(store.getters["life"]("player")).toBe(7400);
        });
      });
      describe("0以下になったとき", () => {
        beforeEach(() => {
          store.state.players = ["player"];
          store.state.histories["player"] = [
            { active: true, type: HistoryType.SET, value: 8000 },
            { active: true, type: HistoryType.CHANGE, value: -8001 },
          ];
        });
        test("計算結果は0になる", () => {
          expect(store.getters["life"]("player")).toBe(0);
        });
      });
      describe("active=falseを含む場合", () => {
        beforeEach(() => {
          store.state.players = ["player"];
          store.state.histories["player"] = [
            { active: true, type: HistoryType.SET, value: 8000 },
            { active: true, type: HistoryType.CHANGE, value: -100 },
            { active: false, type: HistoryType.CHANGE, value: -200 },
            { active: true, type: HistoryType.CHANGE, value: -300 },
          ];
        });
        test("計算結果は7600になる", () => {
          expect(store.getters["life"]("player")).toBe(7600);
        });
      });
    });
  });
  describe("mutations", () => {
    describe("initialize", () => {
      describe("set2Players", () => {
        beforeEach(() => {
          store.commit("initialize2Players");
        });
        test("ライフ8000スタート", () => {
          expect(store.getters["life"]("player1")).toBe(8000);
          expect(store.getters["life"]("player2")).toBe(8000);
        });
      });
    });
  });
});
