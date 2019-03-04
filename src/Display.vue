<template>
  <div id="app">
     <ul class="tags">
      <li v-for="feature in selected" :key="feature.properties.picture">
        <a target="_blank" :href="`http://universalviewer.io/uv.html?manifest=https://dlc.services/iiif-manifest/delft/rijksdriehoeksmeting/${feature.properties.photos[0].iiifId}`">
          <img :src="`https://dlc.services/thumbs/7/1/${feature.properties.photos[0].iiifId}/full/,400/0/default.jpg`">
        </a>

        <!-- <img srcset="elva-fairy-320w.jpg 320w,
             elva-fairy-480w.jpg 480w,
             elva-fairy-800w.jpg 800w"
     sizes="(max-width: 320px) 280px,
            (max-width: 480px) 440px,
            800px"
     src="elva-fairy-800w.jpg" alt="Elva dressed as a fairy"> -->
      </li>
     </ul>
  </div>
</template>

<script>
import axios from 'axios'
import rbush from 'rbush'

import WebSocket from './components/mixins/WebSocket.js'

export default {
  name: 'display',
  mixins: [WebSocket],
  data () {
    return {
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

      this.update()
    },
    // https://dlc.services/thumbs/7/1/00225b52-2bf3-491b-a3bb-d679e4e4e684/full/57,100/0/default.jpg
    update: function () {
      let selected = []

      Object.entries(this.clientData)
        .forEach((pair) => {
          // const clientId = pair[0]
          const data = pair[1]

          const locations = this.locationsForBounds(data.data.bounds)
          selected = [...selected, ...locations]
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
    // setTimeout(() => {
    //   this.yourMethod()
    // }, 1000)

    axios
      .get('locations.geojson')
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
html, body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.tags {
  list-style-type: none;
  margin: 0;
  padding: 0;

  display: flex;
  flex-wrap: wrap;
}
</style>
