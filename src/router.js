import LifePoint from "@/pages/LifePoint";
import VueRouter from 'vue-router'
import Vue from "vue";

Vue.use(VueRouter);

const routes = [
  { path: "", component: LifePoint},
  { path: "lp", component: LifePoint},
];

export default new VueRouter ({
  mode: 'history',
  routes
});
