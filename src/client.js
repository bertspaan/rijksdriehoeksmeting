import Vue from 'vue'
import Client from './Client.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Client),
}).$mount('#app')
