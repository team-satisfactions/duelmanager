import LifePoint from "@/pages/LifePoint";
import VueRouter from 'vue-router'
import Vue from "vue";
import Player from "@/pages/Player";
import Audience from "@/pages/Audience";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: LifePoint},
  { path: "/duels/lp", component: LifePoint},
  { path: "/duels/:duelId/lp", component: LifePoint},
  { path: "/duels/players/:num", component: Player},
  { path: "/duels/audience", component: Audience},
  { path: "/duels/:duelId/players/:num", component: Player},
];

export default new VueRouter ({
  mode: 'history',
  routes
});
