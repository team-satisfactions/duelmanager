import Vue from "vue";
import App from "./pages/LifePoint.vue";
import { store } from "./store.js";
import "./plugins/firebase";
import { firestorePlugin } from "vuefire";
import router from "@/router";

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");

Vue.use(firestorePlugin);
