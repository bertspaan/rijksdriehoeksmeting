<template>
  <div class="component">
    <div class="map-container">
      <div class="map" ref="mapContainer"/>
    </div>
    <div class="number-layer" aria-label="Selected measuring points">
      <svg class="marker-lines" aria-hidden="true">
        <template v-for="point in numberedPoints" :key="point.number">
          <line v-if="point.x !== point.pointX || point.y !== point.pointY"
            :x1="point.pointX" :y1="point.pointY" :x2="point.x" :y2="point.y" class="line-halo" />
          <line v-if="point.x !== point.pointX || point.y !== point.pointY"
            :x1="point.pointX" :y1="point.pointY" :x2="point.x" :y2="point.y" class="line" />
        </template>
      </svg>
      <PointNumber v-for="point in numberedPoints" :key="point.number" class="map-number"
        :number="point.number" :style="{ left: `${point.x}px`, top: `${point.y}px` }" />
    </div>
    <div class="rectangle-container" :style="{
        padding: `${rectanglePadding}px`
      }">
      <div class="rectangle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from 'vue'
import throttle from 'lodash/throttle.js'
import KDBush from 'kdbush'
import { around } from 'geokdbush'
import { Map as MapLibreMap, setWorkerUrl } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Locations } from '../types'
import PointNumber from './PointNumber.vue'

setWorkerUrl(workerUrl)

const props = defineProps<{ locations: Locations }>()
const emit = defineEmits<{ update: [ids: number[], mapMoved: boolean] }>()
const container = useTemplateRef<HTMLDivElement>('mapContainer')
const rectanglePadding = 30
let map: MapLibreMap | undefined
let index: KDBush | undefined
let highlightedIds: number[] = []
interface NumberedPoint {
  number: number
  pointX: number
  pointY: number
  x: number
  y: number
}
const numberedPoints = shallowRef<NumberedPoint[]>([])

function updateNumberedPoints() {
  if (!map || !container.value) return
  const { width, height } = container.value.getBoundingClientRect()
  const points: NumberedPoint[] = []
  for (const [index, id] of highlightedIds.entries()) {
    const coordinates = props.locations.features[id].geometry.coordinates
    const anchor = map.project([coordinates[0], coordinates[1]])
    if (anchor.x < 0 || anchor.x > width || anchor.y < 0 || anchor.y > height) continue
    let x = anchor.x
    let y = anchor.y
    // Keep nearby and coincident numbers legible, with a line to the true point.
    search: for (let ring = 0; ring <= 8; ring++) {
      const steps = ring === 0 ? 1 : 16
      for (let step = 0; step < steps; step++) {
        const angle = step * Math.PI * 2 / steps
        const candidateX = Math.min(width - 15, Math.max(15, anchor.x + Math.cos(angle) * ring * 28))
        const candidateY = Math.min(height - 15, Math.max(15, anchor.y + Math.sin(angle) * ring * 28))
        if (points.every((point) => Math.hypot(point.x - candidateX, point.y - candidateY) >= 28)) {
          x = candidateX
          y = candidateY
          break search
        }
      }
    }
    points.push({ number: index + 1, pointX: anchor.x, pointY: anchor.y, x, y })
  }
  numberedPoints.value = points
}

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
  updateNumberedPoints()
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
        'circle-radius': ['interpolate', ['linear'], ['zoom'],
          8, ['case', ['boolean', ['feature-state', 'highlight'], false], 6, 4],
          16, ['case', ['boolean', ['feature-state', 'highlight'], false], 6, 7]],
        'circle-color': ['case', ['boolean', ['feature-state', 'highlight'], false], '#b5232d', '#087f8c'],
        'circle-stroke-color': '#fff',
        'circle-stroke-width': 1.5
      }
    })
    sendData(false)
  })
  instance.on('move', () => {
    updateNumberedPoints()
    throttledSendData()
  })
  instance.on('resize', () => {
    updateNumberedPoints()
    throttledSendData()
  })
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

.number-layer, .marker-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.map-number {
  position: absolute;
  transform: translate(-50%, -50%);
}

.line-halo {
  stroke: white;
  stroke-width: 4px;
}

.line {
  stroke: #b5232d;
  stroke-width: 1.5px;
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
