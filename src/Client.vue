<template>
  <div id="app">
    <header>
      <div class="dutch">
        Beweeg de kaart om foto's op het scherm te tonen
      </div>
      <div class="english">
        Move the map to display photos on the screen
      </div>
    </header>
    <main>
      <div id="map" />
      <footer v-if="!active">
      <div>
       <div class="dutch">
        Een moment geduld a.u.b.: het scherm wordt momenteel door iemand anders bediend
       </div>
       <div class="english">
         One moment, please: someone else is currently operating the screen
       </div>
      </div>
    </footer>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import WebSocket from './components/mixins/WebSocket.js'
import { throttle } from 'lodash'

export default {
  name: 'client',
  mixins: [WebSocket],
  data () {
    return {
      active: true,
      highlightedIDs: []
    }
  },
  methods: {
    throttledSendData: throttle(function () {
      this.sendData()
    }, 500),
    sendData: function () {
      if (this.map) {
        const features = this.map.queryRenderedFeatures({
          layers: ['points']
        })

        this.highlightedIDs.forEach((id) => {
          this.map.setFeatureState({
            id,
            source: 'points'
          }, {
            highlight: false
          })
        })

        this.highlightedIDs = features.slice(0, 8).map((feature) => feature.id)

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
    // Idee: laat rechthoek zien
    // var features = map.queryRenderedFeatures(bbox, { layers: ['counties'] });

    // eslint-disable-next-line
    // const map = new mapboxgl.Map({
    //   container: 'map',
    //   style: 'mapbox://styles/mapbox/dark-v9',
    //   center: [
    //     4.90706,
    //     52.35663
    //   ],
    //   zoom: 13.2,
    //   minZoom: 7,
    //   maxZoom: 17,
    //   hash: true
    // })

    // eslint-disable-next-line
    const map = new mapboxgl.Map({
      container: 'map',
      style: {
        version: 8,
        sources: {
          'basemap': {
            type: 'raster',
            tiles: [
              // 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
              // 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
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
      // BOUNDS!!!
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
          // const voronoi = geoVoronoi.geoVoronoi(locations)
          // const triangles = voronoi.triangles()

          // const maxArea = 1000 * 1000 * 250

          // const smallTriangles = {
          //   type: 'FeatureCollection',
          //   features: triangles.features
          //     .filter((triangle) => area(envelope(triangle)) < maxArea)
          // }

          map.addSource('points', {
            type: 'geojson',
            data: locations
          })

          // map.addSource('triangles', {
          //   type: 'geojson',
          //   data: smallTriangles
          // })

          // map.addLayer({
          //   id: 'triangles',
          //   type: 'line',
          //   source: 'triangles',
          //   'paint': {
          //     'line-color': '#fff',
          //     'line-opacity': 0.2
          //   }
          // }, firstSymbolId)

          map.addLayer({
            id: 'points',
            type: 'circle',
            source: 'points',
            paint: {
              'circle-radius': [
                'interpolate', ['linear'], ['zoom'],
                8, 3,
                16, 10,
              ],
              // 'circle-color': 'rgb(240, 75, 52)',
              'circle-opacity': ['case',
                ['boolean', ['feature-state', 'highlight'], false],
                1,
                0.2
              ],

              'circle-color': ['case',
                ['boolean', ['feature-state', 'highlight'], false],
                'green',
                'red'
              ]
            }
          })
          // }, firstSymbolId)

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

#app {
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100vh;
}

main {
  width: 100%;
  height: 100%;
}

#map {
  width: 100%;
  height: 100%;
}

footer {
  position: absolute;
  z-index: 1000;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  justify-content: center;
}

footer div {
  box-sizing: border-box;
  display: inline-block;
  background-color: #ed1c24;
  color: white;
  width: auto;
  padding: 10px;
}
</style>
