import LifePoint from "@/pages/LifePoint";
import VueRouter from 'vue-router'
import Vue from "vue";
import Player from "@/pages/Player";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: LifePoint},
  { path: "/lp", component: LifePoint},
  { path: "/player/:num", component: Player},
];

export default new VueRouter ({
  mode: 'history',
  routes
});
