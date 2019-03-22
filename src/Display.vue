<template>
  <div id="app">
    <template v-if="selected.length">
      <ul class="clients">
        <li v-for="(client, index) in selected" :key="client.clientId" class="client"
          :style="{
            borderColor: ['red', 'blue'][index],
            width: `${Math.round(100 / selected.length )}%`
          }">
          <ol class="locations"
            :style="{
              gridTemplateColumns: `repeat(auto-fill, ${Math.round(100 / client.locations.length )}%)`
            }">
            <li class="location" v-for="feature in client.locations" :key="feature.properties.photos[0].iiifId">
              <IIIFImage :iiifId="feature.properties.photos[0].iiifId" />
            </li>
          </ol>
        </li>
      </ul>
    </template>
     <template v-else>
       <Join :locations="locations" />
     </template>

    <div class="qrcode">
      <img src="./assets/qrcode.svg" />
      <p>
        <a href="https://landmeten.tudelft.nl/tentoonstelling">landmeten.tudelft.nl/
        <br />tentoonstelling</a>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import rbush from 'rbush'

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
      tree: undefined,
      timeout: undefined,
      selected: [],
      clientData: {},
      ttl: 10 * 1000
    }
  },
  methods: {
    locationsForBounds: function (bounds, limit=10) {
      if (this.locations && this.tree) {
        const results = this.tree.search({
          minX: bounds[0][0],
          minY: bounds[0][1],
          maxX: bounds[1][0],
          maxY: bounds[1][1]
        })

        const features = results.map((result) =>
          this.locations.features[result.index]
        )

        return features.slice(0, limit)
      }

      return []
    },
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

          const locations = this.locationsForBounds(data.data.bounds)

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
      .get('../locations.geojson')
      .then((response) => {
        this.locations = response.data
        return this.locations
      }).then((locations) => {
        const items = locations.features.map((feature, index) => {
          const x = feature.geometry.coordinates[0]
          const y = feature.geometry.coordinates[1]

          const item = {
            minX: x,
            minY: y,
            maxX: x,
            maxY: y,
            index: index
          }
          return item
        })

        const tree = rbush(items.length)
        tree.load(items)
        this.tree = tree
      })
  }
}
</script>

<style>
#app {
  display: flex;
  flex-direction: row;
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
  border-width: 10px;
  border-style: solid;
  flex-shrink: 0;
  box-sizing: border-box;
  height: 100vh;
}

.locations {
  display: grid;
  grid-auto-flow: row;
  width: 100%;
  height: 100%;
}

.qrcode {
  padding: 10px;
  /* position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: white; */
}

.qrcode p {
  font-size: 90%;
  padding: 5px;
  margin: 0;
  line-height: 1.2em;
}
</style>
