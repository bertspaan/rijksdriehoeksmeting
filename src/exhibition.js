import Vue from 'vue'
import Display from './Display.vue'

// eslint-disable-next-line no-unused-vars
function getImageUrl (id, size) {
  return undefined
}

new Vue({
  render: h => h(Display, {
    props: {
      getImageUrl: getImageUrl
    }
  }),
}).$mount('#app')
