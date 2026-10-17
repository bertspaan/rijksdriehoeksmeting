<template>
  <span class="iiif-image" :class="`is-${state}`" :aria-busy="state === 'loading'"
    :style="{ aspectRatio: `${dimensions[0]} / ${dimensions[1]}` }" v-on:click="click">
    <span class="loading-placeholder" aria-hidden="true" />
    <img ref="imageElement" :srcset="imgSrcset" :sizes="imgSizes" :src="imgSrc" :alt="alt"
      :width="dimensions[0]" :height="dimensions[1]" loading="lazy" decoding="async"
      v-on:load="state = 'loaded'" v-on:error="state = 'error'" />
    <span v-if="state === 'error'" class="image-error">Image unavailable</span>
  </span>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import type { Photo } from '../types'

const props = withDefaults(defineProps<Photo & { alt?: string }>(), {
  alt: 'Historic measuring point photograph'
})
const emit = defineEmits<{ click: [iiifId: string, dimensions: Photo['dimensions']] }>()
const image = useTemplateRef<HTMLImageElement>('imageElement')
const state = ref<'loading' | 'loaded' | 'error'>('loading')
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

watch(imgSrc, async () => {
  state.value = 'loading'
  await nextTick()
  if (image.value?.complete && image.value.naturalWidth > 0) state.value = 'loaded'
}, { immediate: true })

function click() {
  emit('click', props.iiifId, props.dimensions)
}
</script>

<style scoped>
.iiif-image {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  cursor: pointer;
}

img, .loading-placeholder {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 250ms ease;
}

img {
  display: block;
  object-fit: contain;
}

.loading-placeholder {
  background: #414141;
}

.is-loading .loading-placeholder {
  animation: loading-fade 1.4s ease-in-out infinite;
}

.is-loaded img {
  opacity: 1;
}

.is-error .loading-placeholder {
  opacity: 0.4;
}

.image-error {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  text-align: center;
  font-size: 14px;
}

@keyframes loading-fade {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.8; }
}

@media (prefers-reduced-motion: reduce) {
  img, .loading-placeholder {
    transition: none;
  }

  .is-loading .loading-placeholder {
    animation: none;
    opacity: 0.5;
  }
}
</style>
