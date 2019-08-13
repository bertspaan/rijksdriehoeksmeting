<template>
  <div class="component">
    <div class="map-container">
      <div class="map" ref="map"/>
    </div>
    <div class="rectangle-container" :style="{
        padding: `${rectanglePadding}px`
      }">
      <div class="rectangle" />
    </div>
  </div>
</template>

<script>
import { throttle } from 'lodash'
import KDBush from 'kdbush'
const geokdbush = require('geokdbush')

export default {
  props: {
    locations: Object
  },
  data () {
    return {
      highlightedIds: [],
      index: undefined,
      rectanglePadding: 30
    }
  },
  methods: {
    throttledSendData: throttle(function () {
      this.sendData()
    }, 500),
    sendData: function (mapMoved = true) {
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

        this.highlightedIds.forEach((id) => {
          this.map.setFeatureState({
            id,
            source: 'points'
          }, {
            highlight: false
          })
        })

        this.highlightedIds = nearest.map((feature) => feature.id)

        this.highlightedIds.forEach((id) => {
          this.map.setFeatureState({
            id,
            source: 'points'
          }, {
            highlight: true
          })
        })

        this.$emit('update', this.highlightedIds, mapMoved)
      }
    }
  },
  mounted: function () {
    this.index = new KDBush(this.locations.features,
      (feature) => feature.geometry.coordinates[0], (feature) => feature.geometry.coordinates[1])

    // eslint-disable-next-line
    const map = new mapboxgl.Map({
      container: this.$refs.map,
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
      hash: true,

      pitchWithRotate: false,
      dragRotate: false
    })

    map.on('load', () => {
      map.addSource('points', {
        type: 'geojson',
        data: this.locations
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

      this.sendData(false)
    })

    map.on('move', () => {
      this.throttledSendData()
    })

    this.map = map
  }
}
</script>

<style scoped>

.component {
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.map-container {
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.map {
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
</style>
