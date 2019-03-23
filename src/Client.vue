<template>
  <div id="app">
    <header>
      <div class="dutch">
        <p>
        Beweeg de kaart
        </p>
      </div>
      <div class="english">
        Move the map!
      </div>
    </header>
    <main>
      <div id="map" />
    </main>
    <footer v-if="!active">
      <div>
        Nee, het is niet goed! Wacht even tot de ander klaar is
      </div>
    </footer>
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
      active: true
    }
  },
  methods: {
    throttledSendBounds: throttle(function () {
      this.sendBounds()
    }, 200),
    sendBounds: function () {
      if (this.map) {
        const bounds = this.map.getBounds().toArray()
        const zoom = this.map.getZoom()
        this.wsSend('client', {
          bounds,
          zoom
        })
      }
    }
  },
  created: function () {
    this.$on('ws:message', (message) => {
      this.active = message.active
    })
  },
  mounted: function () {


    // turf.envelope(features);


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
      this.throttledSendBounds()

      // const layers = map.getStyle().layers
      // // Find the index of the first symbol layer in the map style
      let firstSymbolId = 'waterway-label'
      // for (var i = 0; i < layers.length; i++) {
      //   if (layers[i].type === 'symbol') {
      //     firstSymbolId = layers[i].id
      //     break
      //   }
      // }

      axios
        // TODO: make locations-small.geojson
        .get('locations.geojson')
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
              'circle-color': 'rgb(240, 75, 52)'
            }
          })
          // }, firstSymbolId)

        })
    })

    map.on('move', () => {
      this.throttledSendBounds()
    })

    this.map = map
  }
}
</script>

<style>
@import './assets/fonts.css';

body {
  margin: 0;
  padding: 0;
}

#app {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100vh;
}

header {
  height: 200px;
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
  /* width: 400px; */
  width: auto;
  /* max-width: 100%; */
  padding: 10px;
}
</style>
