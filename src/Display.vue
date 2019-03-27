<template>
  <div id="app">
    <template v-if="selected.length">
      <ul class="clients">
        <li v-for="(client) in selected" :key="client.clientId" class="client"
          :style="{
            width: `${Math.floor(100 / selected.length )}%`
          }">
          <template v-if="client.locations.length">
            <ol class="locations"
              :style="{
                gridTemplateColumns: `repeat(auto-fill, ${Math.round(100 / client.locations.length )}%)`
              }">
              <li class="location" v-for="feature in client.locations" :key="feature.properties.photos[0].iiifId"
                :style="{
                  width: `${Math.floor(100 / client.locations.length )}%`
                }">
                <IIIFImage :iiifId="feature.properties.photos[0].iiifId"
                  :dimensions="feature.properties.photos[0].dimensions" />
              </li>
            </ol>
          </template>
          <template v-else>
            <div class="locations">
              <div class="message">
                <p class="dutch">Geen meetpunten gevonden in de buurt van deze locatie.</p>
                <p class="english">No measuring points found around this location.</p>
              </div>
            </div>
          </template>
        </li>
      </ul>
    </template>
     <template v-else>
       <Intro :locations="locations" />
     </template>
  </div>
</template>

<script>
import axios from 'axios'

import WebSocket from './components/mixins/WebSocket.js'

import IIIFImage from './components/IIIFImage.vue'
import Intro from './components/Intro.vue'

export default {
  name: 'display',
  mixins: [WebSocket],
  components: {
    IIIFImage,
    Intro
  },
  props: {
    getImageUrl: Function
  },
  data () {
    return {
      locations: undefined,
      timeout: undefined,
      selected: [],
      clientData: {},
      ttl: 20 * 1000
    }
  },
  methods: {
    setClientData: function (clientId, data) {
      const timestamp = + new Date()

      Object.entries(this.clientData)
        .forEach((pair) => {
          if (pair[1].timestamp + this.ttl < timestamp) {
            delete this.clientData[pair[0]]
          }
        })

      this.clientData[clientId] = {
        timestamp,
        data
      }

      if (this.timeout) {
        window.clearTimeout(this.timeout)
      }

      this.timeout = window.setTimeout(() => {
        this.selected = []
      }, this.ttl)

      this.update()
    },
    update: function () {
      const selected = Object.entries(this.clientData)
        .map((pair) => {
          const clientId = pair[0]
          const data = pair[1]

          const ids = data.data

          const locations = this.locations.features.filter((location) => {
            return ids.includes(location.id)
          })

          return {
            clientId,
            locations
          }
        })
      this.selected = selected
    }
  },
  created: function () {
    this.$on('ws:open', () => {
      this.wsSend('display')
    })

    this.$on('ws:message', (message) => {
      this.setClientData(message.clientId, message.data)
    })
  },
  mounted: function () {
    axios
      .get('../locations.display.geojson')
      .then((response) => {
        this.locations = response.data
        return this.locations
      })
  }
}
</script>

<style>
#app {
}

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
