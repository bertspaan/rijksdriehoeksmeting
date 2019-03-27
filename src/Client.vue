<template>
  <div id="app">
    <header>
      <span class="dutch">
        Beweeg de kaart om foto’s op het scherm te tonen.
      </span>
      <span class="english">
        Move the map to display photos on the screen.
      </span>
    </header>
    <main>
      <div id="map" ref="map"/>
      <div class="rectangle-container" :style="{
        padding: `${rectanglePadding}px`
      }">
        <div class="rectangle" />
      </div>
    </main>
    <footer :class="{
      active,
      inactive: !active
    }">
      <div v-if="active">
        <template v-if="highlightedIDs.length">
          <span class="dutch">
            De geselecteerde foto’s worden getoond op het scherm.
          </span>
          <span class="english">
            The selected photos are displayed on the screen.
          </span>
        </template>
        <template v-else>
          <span class="dutch">
            Geen meetpunten gevonden in de buurt van deze locatie.
          </span>
          <span class="english">
            No measuring points found around this location.
          </span>
        </template>
      </div>
      <div v-else>
        <span class="dutch">
          Een moment geduld a.u.b.: het scherm wordt door iemand anders bediend.
        </span>
        <span class="english">
          One moment, please: someone else is operating the screen.
        </span>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios'
import WebSocket from './components/mixins/WebSocket.js'
import { throttle } from 'lodash'

import KDBush from 'kdbush'
const geokdbush = require('geokdbush')

export default {
  name: 'client',
  mixins: [WebSocket],
  data () {
    return {
      active: true,
      timeout: undefined,
      highlightedIDs: [],
      locations: [],
      index: undefined,
      ttl: 10 * 1000,
      rectanglePadding: 30
    }
  },
  watch: {
    locations: function () {
      this.index = new KDBush(this.locations.features,
        (feature) => feature.geometry.coordinates[0], (feature) => feature.geometry.coordinates[1])
    },
    active: function () {
      if (this.timeout) {
        window.clearTimeout(this.timeout)
      }

      this.timeout = window.setTimeout(() => {
        this.active = true
      }, this.ttl)
    }
  },
  methods: {
    throttledSendData: throttle(function () {
      this.sendData()
    }, 500),
    sendData: function () {
      if (this.map && this.index && this.$refs.map) {
        const limit = 8

        const center = this.map.getCenter()

        const rect = this.$refs.map.getBoundingClientRect()
        const nw = this.map.unproject([this.rectanglePadding, this.rectanglePadding])
        const se = this.map.unproject([rect.width - this.rectanglePadding, rect.height - this.rectanglePadding])

        const nearest = geokdbush.around(this.index, center.lng, center.lat, limit, undefined, (feature) => {
          const [lng, lat] =  feature.geometry.coordinates
          const inLat = lat <= nw.lat && lat >= se.lat
          const inLng = lng >= nw.lng && lng <= se.lng
          return inLat && inLng
        })

        this.highlightedIDs.forEach((id) => {
          this.map.setFeatureState({
            id,
            source: 'points'
          }, {
            highlight: false
          })
        })

        this.highlightedIDs = nearest.map((feature) => feature.id)

        this.highlightedIDs.forEach((id) => {
          this.map.setFeatureState({
            id,
            source: 'points'
          }, {
            highlight: true
          })
        })

        this.wsSend('client', this.highlightedIDs)
      }
    }
  },
  created: function () {
    this.$on('ws:message', (message) => {
      this.active = message.active
    })
  },
  mounted: function () {
    // eslint-disable-next-line
    const map = new mapboxgl.Map({
      container: 'map',
      style: {
        version: 8,
        sources: {
          'basemap': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
              'https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
            ],
            tileSize: 256
          }
        },
        layers: [{
          id: 'basemap',
          type: 'raster',
          source: 'basemap',
          minzoom: 7,
          maxzoom: 17
        }]
      },
      minZoom: 7,
      maxZoom: 16.5,
      maxBounds: [[1.5, 49.8], [8.5, 55.0]],
      center: [4.922, 52.369],
      zoom: 9,
      hash: true
    })

    map.on('load', () => {
      axios
        .get('locations.client.geojson')
        .then((response) => {
          this.locations = response.data
          return this.locations
        }).then((locations) => {
          map.addSource('points', {
            type: 'geojson',
            data: locations
          })

          map.addLayer({
            id: 'points',
            type: 'circle',
            source: 'points',
            paint: {
              'circle-radius': [
                'interpolate', ['linear'], ['zoom'],
                8, 4,
                16, 10,
              ],
              'circle-opacity': ['case',
                ['boolean', ['feature-state', 'highlight'], false],
                1,
                0.4
              ],

              'circle-color': ['case',
                ['boolean', ['feature-state', 'highlight'], false],
                '#ed1c24', // red
                '#ede321' // yellow
              ]
            }
          })

          this.throttledSendData()
        })
    })

    map.on('move', () => {
      this.throttledSendData()
    })

    this.map = map
  }
}
</script>

<style>
@import './assets/fonts.css';

body {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  max-width: 1000px;
  margin: 0 auto;

  font-size: 70%;
  line-height: 1.2rem;
}

main {
  flex-grow: 1;
  position: relative;
}

#map {
  width: 100%;
  height: 100%;
}

.rectangle-container {
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  box-sizing: border-box;
}

.rectangle {
  border-style: dashed;
  stroke-linecap: round;
  stroke-linejoin: round;

  border-width: 2px;
  border-color: rgb(26, 43, 60);
  width: 100%;
  height: 100%;
}

header, footer {
  box-sizing: border-box;
  padding: 8px;
  text-align: center;
}

footer {
  font-size: 85%;
  line-height: 1rem;
}

footer.active {
  color: black;
  background-color: #eeec77;
}

footer.inactive {
  background-color: #ed1c24;
}
</style>
