<template>
  <img :srcset="imgSrcset" :sizes="imgSizes" style="cursor: pointer;" loading="lazy" decoding="async"
    v-on:click="click" :src="imgSrc" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Photo } from '../types'

const props = defineProps<Photo>()
const emit = defineEmits<{ click: [iiifId: string, dimensions: Photo['dimensions']] }>()
const baseUrl = 'https://dlc.services/thumbs/7/1'
const imageSizes = [100, 200, 400, 1024]
const orientation = computed(() => props.dimensions[0] > props.dimensions[1] ? 'landscape' : 'portrait')

function url(size: number) {
  const sizeStr = orientation.value === 'landscape' ? `${size},` : `,${size}`
  return `${baseUrl}/${props.iiifId}/full/${sizeStr}/0/default.jpg`
}

const imgSrcset = computed(() => imageSizes.map((size) => `${url(size)} ${size}w`).join(', '))
const imgSizes = computed(() => imageSizes
  .map((size, index) => `${index < imageSizes.length - 1 ? `(max-width: ${size}px)` : ''} ${size}px`)
  .join(', '))
const imgSrc = computed(() => url(imageSizes[imageSizes.length - 1]))

function click() {
  emit('click', props.iiifId, props.dimensions)
}
</script>

<style scoped>
img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
