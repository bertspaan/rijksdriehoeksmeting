<template>
  <div id="app">
    <template v-if="selected.length">
      <ul class="clients">
        <li v-for="(client) in selected" :key="client.clientId" class="client"
          :style="{
            width: `${Math.floor(100 / selected.length )}%`
          }">
          <ol class="locations"
            :style="{
              gridTemplateColumns: `repeat(auto-fill, ${Math.round(100 / client.locations.length )}%)`
            }">
            <li class="location" v-for="feature in client.locations" :key="feature.properties.photos[0].iiifId"
              :style="{
                width: `${Math.floor(100 / client.locations.length )}%`
                //width: `${Math.floor(100 / client.locations.length ) * (client.locations.length > 4 ? 2 : 1)}%`,
                //height: client.locations.length > 4 ? '50%' : '100%'
              }">
              <IIIFImage :iiifId="feature.properties.photos[0].iiifId"
                :dimensions="feature.properties.photos[0].dimensions" />
            </li>
          </ol>
        </li>
      </ul>
    </template>
     <template v-else>
       <Join :locations="locations" />
     </template>
  </div>
</template>

<script>
import axios from 'axios'

import WebSocket from './components/mixins/WebSocket.js'

import IIIFImage from './components/IIIFImage.vue'
import Join from './components/Join.vue'

export default {
  name: 'display',
  mixins: [WebSocket],
  components: {
    IIIFImage,
    Join
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
      ttl: 10 * 1000
    }
  },
  methods: {
    // locationsForBounds: function (bounds, limit=10) {
    //   if (this.locations && this.tree) {
    //     const results = this.tree.search({
    //       minX: bounds[0][0],
    //       minY: bounds[0][1],
    //       maxX: bounds[1][0],
    //       maxY: bounds[1][1]
    //     })

    //     const features = results.map((result) =>
    //       this.locations.features[result.index]
    //     )

    //     return features.slice(0, limit)
    //   }

    //   return []
    // },
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
    // https://dlc.services/thumbs/7/1/00225b52-2bf3-491b-a3bb-d679e4e4e684/full/57,100/0/default.jpg
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
  padding: 5px;
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
</style>
