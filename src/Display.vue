<template>
  <div id="app">
    <template v-if="images.length || timeout">
      <Images :images="images" />
    </template>
     <template v-else>
       <DisplayText :locations="locations" />
     </template>
  </div>
</template>

<script>
import axios from 'axios'

import WebSocket from './components/mixins/WebSocket.js'

import Images from './components/Images.vue'
import DisplayText from './components/DisplayText.vue'

export default {
  name: 'display',
  mixins: [WebSocket],
  components: {
    Images,
    DisplayText
  },
  props: {
    getImageUrl: Function
  },
  data () {
    return {
      locations: undefined,
      timeout: undefined,
      images: [],
      clientData: {},
      ttl: 20 * 1000
    }
  },
  methods: {
    update: function (ids) {
      if (this.timeout) {
        window.clearTimeout(this.timeout)
      }

      if (ids) {
        this.images = ids.map((id) => this.locations.features[id])

        this.timeout = window.setTimeout(() => {
          this.images = []

          window.clearTimeout(this.timeout)
          this.timeout = undefined
        }, this.ttl)
      } else {
        this.images = []
      }
    }
  },
  created: function () {
    this.$on('ws:open', () => {
      this.wsSend('display')
    })

    this.$on('ws:message', (message) => {
      this.update(message.data)
    })
  },
  mounted: function () {
    axios
      .get('../../locations.display.geojson')
      .then((response) => {
        this.locations = response.data
        return this.locations
      })
  }
}
</script>

<style>
@import './assets/main.css';

.clients {
  width: 100%;
}

.clients, .locations {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
}

.client {
  padding: 10px;
  flex-shrink: 0;
  box-sizing: border-box;
  height: 100vh;
}

.locations {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.location {
  height: 100%;
  box-sizing: border-box;
  padding: 5px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.message {
  text-align: center;
}
</style>
