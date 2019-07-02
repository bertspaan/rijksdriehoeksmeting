import Vue from 'vue'
import Standalone from './Standalone.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Standalone)
}).$mount('#app')
