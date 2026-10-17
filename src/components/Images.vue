<template>
  <div class="container" ref="galleryContainer" :class="{ scrollable: layout.scroll }">
    <ol v-if="photos.length" class="images" :style="{ gap: `${gap}px`, height: `${layout.height}px` }">
      <li v-for="(row, index) in layout.rows" :key="index" class="photo-row"
        :style="{ height: `${row.height}px`, gap: `${gap}px` }">
        <div v-for="item in row.photos" :key="photos[item.index].key" class="photo"
          :style="{ width: `${item.width}px`, height: `${row.height}px` }">
          <IIIFImage :iiifId="photos[item.index].iiifId" :dimensions="photos[item.index].dimensions"
            :alt="numbered ? `Photo of measuring point ${photos[item.index].number}` : 'Historic measuring point photograph'"
            v-on:click="emit('select-image', photos[item.index].location, photos[item.index].number)" />
          <PointNumber v-if="numbered" class="photo-number" :number="photos[item.index].number" />
          <span v-if="photos[item.index].count > 1" class="photo-count"
            :aria-label="`${photos[item.index].count} photos`">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 11H1V1h10v2" />
              <rect x="5" y="5" width="10" height="10" rx="1" />
            </svg>
            {{ photos[item.index].count.toLocaleString() }}
          </span>
        </div>
      </li>
    </ol>
    <NoImagesFound v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import IIIFImage from './IIIFImage.vue'
import NoImagesFound from './NoImagesFound.vue'
import PointNumber from './PointNumber.vue'
import { photoLayout } from '../utils/photo-layout'
import type { LocationFeature } from '../types'

const props = defineProps<{ images: LocationFeature[]; numbered?: boolean }>()
const emit = defineEmits<{ 'select-image': [location: LocationFeature, number: number] }>()
const container = useTemplateRef<HTMLDivElement>('galleryContainer')
const width = ref(0)
const height = ref(0)
const gap = 8
let observer: ResizeObserver | undefined

const photos = computed(() => props.images.flatMap((image, index) => image.properties.photos.slice(0, 1).map((photo) => ({
  ...photo,
  key: `${image.id}:${photo.iiifId}`,
  number: index + 1,
  location: image,
  count: image.properties.photos.length
}))))
const layout = computed(() => photoLayout(
  photos.value.map((photo) => photo.dimensions[0] / photo.dimensions[1]),
  width.value,
  height.value,
  gap
))

onMounted(() => {
  if (!container.value) return
  observer = new ResizeObserver(([entry]) => {
    width.value = entry.contentRect.width
    height.value = entry.contentRect.height
  })
  observer.observe(container.value)
})
onBeforeUnmount(() => observer?.disconnect())

</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.container.scrollable {
  display: block;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.images {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-shrink: 0;
}

.photo-row {
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

.photo {
  position: relative;
  flex-shrink: 0;
}

.photo :deep(.iiif-image) {
  display: block;
  width: 100%;
  height: 100%;
}

.photo-number {
  position: absolute;
  top: 6px;
  left: 6px;
  pointer-events: none;
}

.photo-count {
  position: absolute;
  right: 6px;
  bottom: 6px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 6px;
  border: 1px solid rgb(255 255 255 / 40%);
  border-radius: 4px;
  background: rgb(0 0 0 / 80%);
  color: white;
  font: 600 12px/1 system-ui, sans-serif;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
}

.photo-count svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
}
</style>
