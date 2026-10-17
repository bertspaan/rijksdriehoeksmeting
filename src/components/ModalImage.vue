<template>
  <div class="modal">
    <div class="container">
      <div class="image" ref="imageContainer">
        <IIIFImage :iiifId="iiifId" :dimensions="dimensions" :style="imageSize" v-on:click="close" />
      </div>
      <div class="centered">
        <button v-on:click="close">Sluiten - Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import IIIFImage from './IIIFImage.vue'
import type { Photo } from '../types'

const props = defineProps<Photo>()
const emit = defineEmits<{ close: [] }>()
const container = useTemplateRef<HTMLDivElement>('imageContainer')
const bounds = ref({ width: 0, height: 0 })
const imageSize = computed(() => {
  const scale = Math.min(bounds.value.width / props.dimensions[0], bounds.value.height / props.dimensions[1])
  return { width: `${props.dimensions[0] * scale}px`, height: `${props.dimensions[1] * scale}px` }
})
let observer: ResizeObserver | undefined

onMounted(() => {
  if (!container.value) return
  observer = new ResizeObserver(([entry]) => {
    bounds.value = { width: entry.contentRect.width, height: entry.contentRect.height }
  })
  observer.observe(container.value)
})
onBeforeUnmount(() => observer?.disconnect())

function close() { emit('close') }
</script>

<style scoped>
.modal {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  box-sizing: border-box;
  padding: 1em;
}

.container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.image {
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.centered {
  flex-shrink: 0;
  padding: 10px;
  box-sizing: border-box;
}
</style>
