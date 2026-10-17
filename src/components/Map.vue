<template>
  <div class="component">
    <div class="map-container">
      <div class="map" ref="mapContainer"/>
    </div>
    <div class="rectangle-container" :style="{
        padding: `${rectanglePadding}px`
      }">
      <div class="rectangle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import throttle from 'lodash/throttle.js'
import KDBush from 'kdbush'
import { around } from 'geokdbush'
import { Map as MapLibreMap, setWorkerUrl } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Locations } from '../types'

setWorkerUrl(workerUrl)

const props = defineProps<{ locations: Locations }>()
const emit = defineEmits<{ update: [ids: number[], mapMoved: boolean] }>()
const container = useTemplateRef<HTMLDivElement>('mapContainer')
const rectanglePadding = 30
let map: MapLibreMap | undefined
let index: KDBush | undefined
let highlightedIds: number[] = []

function sendData(mapMoved = true) {
  if (!map?.getSource('points') || !index || !container.value) return

  const center = map.getCenter()
  const rect = container.value.getBoundingClientRect()
  const nw = map.unproject([rectanglePadding, rectanglePadding])
  const se = map.unproject([rect.width - rectanglePadding, rect.height - rectanglePadding])
  const nearest = around(index, center.lng, center.lat, 8, undefined, (id) => {
    const [lng, lat] = props.locations.features[id].geometry.coordinates
    return lat <= nw.lat && lat >= se.lat && lng >= nw.lng && lng <= se.lng
  })

  for (const id of highlightedIds) {
    map.setFeatureState({ id, source: 'points' }, { highlight: false })
  }
  highlightedIds = nearest.map((id) => props.locations.features[id].id)
  for (const id of highlightedIds) {
    map.setFeatureState({ id, source: 'points' }, { highlight: true })
  }
  emit('update', highlightedIds, mapMoved)
}

const throttledSendData = throttle(() => sendData(), 500)

onMounted(() => {
  if (!container.value) return
  index = new KDBush(props.locations.features.length)
  for (const feature of props.locations.features) {
    index.add(feature.geometry.coordinates[0], feature.geometry.coordinates[1])
  }
  index.finish()

  const instance = new MapLibreMap({
    container: container.value,
    style: 'https://tiles.openfreemap.org/styles/positron',
    minZoom: 7,
    maxZoom: 16.5,
    maxBounds: [[1.5, 49.8], [8.5, 55.0]],
    center: [4.922, 52.369],
    zoom: 9,
    hash: true,
    pitchWithRotate: false,
    dragRotate: false
  })
  map = instance

  instance.on('load', () => {
    instance.addSource('points', { type: 'geojson', data: props.locations })
    instance.addLayer({
      id: 'points',
      type: 'circle',
      source: 'points',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 4, 16, 10],
        'circle-opacity': ['case', ['boolean', ['feature-state', 'highlight'], false], 1, 0.4],
        'circle-color': ['case', ['boolean', ['feature-state', 'highlight'], false], '#ed1c24', '#ede321']
      }
    })
    sendData(false)
  })
  instance.on('move', () => throttledSendData())
})

onBeforeUnmount(() => {
  throttledSendData.cancel()
  map?.remove()
})
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

.map :deep(.maplibregl-ctrl-attrib a) {
  color: inherit;
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
