<template>
  <div class="container" ref="galleryContainer" :class="{ scrollable: layout.scroll }">
    <ol v-if="photos.length" class="images" :style="{ gap: `${gap}px`, height: `${layout.height}px` }">
      <li v-for="(row, index) in layout.rows" :key="index" class="photo-row"
        :style="{ height: `${row.height}px`, gap: `${gap}px` }">
        <div v-for="item in row.photos" :key="photos[item.index].key" class="photo"
          :style="{ width: `${item.width}px`, height: `${row.height}px` }">
          <IIIFImage :iiifId="photos[item.index].iiifId" :dimensions="photos[item.index].dimensions"
            :alt="numbered ? `Photo of measuring point ${photos[item.index].number}` : 'Historic measuring point photograph'"
            v-on:click="click" />
          <PointNumber v-if="numbered" class="photo-number" :number="photos[item.index].number" />
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
import type { LocationFeature, Photo } from '../types'

const props = defineProps<{ images: LocationFeature[]; numbered?: boolean }>()
const emit = defineEmits<{ 'select-image': [iiifId: string, dimensions: Photo['dimensions']] }>()
const container = useTemplateRef<HTMLDivElement>('galleryContainer')
const width = ref(0)
const height = ref(0)
const gap = 8
let observer: ResizeObserver | undefined

const photos = computed(() => props.images.flatMap((image, index) => image.properties.photos.slice(0, 1).map((photo) => ({
  ...photo,
  key: `${image.id}:${photo.iiifId}`,
  number: index + 1
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

function click(iiifId: string, dimensions: Photo['dimensions']) {
  emit('select-image', iiifId, dimensions)
}
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
</style>
