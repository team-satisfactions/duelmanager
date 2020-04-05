import Vue from 'vue'
import App from './App.vue'
import { store } from './store.js'
import './plugins/firebase'
import { firestorePlugin } from "vuefire";

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')

Vue.use(firestorePlugin)
