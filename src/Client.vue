<template>
  <div id="app">
    <!-- <header>
      <h1>Client</h1>
    </header> -->
    <main>
      <div id="map" />
    </main>
    <!-- <footer></footer> -->
  </div>
</template>

<script>
import axios from 'axios'
import WebSocket from './components/mixins/WebSocket.js'
// const geoVoronoi = require('d3-geo-voronoi')

import area from '@turf/area'
import envelope from '@turf/envelope'

export default {
  name: 'client',
  mixins: [WebSocket],
  methods: {
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
  mounted: function () {
    // eslint-disable-next-line
    mapboxgl.accessToken = 'pk.eyJ1IjoiYmVydHNwYWFuIiwiYSI6ImR3dERiQk0ifQ.DLbScmbRohc3Sqv7prfhqw'

    // turf.envelope(features);

    // eslint-disable-next-line
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [
        4.90706,
        52.35663
      ],
      zoom: 13.2,
      minZoom: 7,
      maxZoom: 17,
      hash: true
    })

    map.on('load', () => {
      this.sendBounds()

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
          }, firstSymbolId)

        })
    })

    map.on('move', () => {
      this.sendBounds()
    })

    this.map = map
  }
}
</script>

<style>
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
</style>
