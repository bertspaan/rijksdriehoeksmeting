<template>
  <div class="modal" ref="dialogElement" role="dialog" aria-modal="true"
    :aria-label="`Photos of measuring point ${pointNumber}`"
    v-on:keydown.left.prevent="previous" v-on:keydown.right.prevent="next"
    v-on:keydown.esc.prevent.stop="close" v-on:keydown.tab="trapFocus">
    <div class="container">
      <div class="image" ref="imageContainer">
        <div v-if="currentPhoto" class="photo-frame" :style="imageSize">
          <IIIFImage :key="currentPhoto.iiifId" :iiifId="currentPhoto.iiifId" :dimensions="currentPhoto.dimensions"
            :alt="`Photo ${photoIndex + 1} of ${photos.length} of measuring point ${pointNumber}`" v-on:click="close" />
          <PointNumber class="photo-number" :number="pointNumber" />
        </div>
      </div>
      <div class="centered">
        <div v-if="photos.length > 1" class="photo-navigation" role="group" aria-label="Photo navigation">
          <button type="button" aria-label="Previous photo" :disabled="photoIndex === 0" v-on:click="previous">←</button>
          <span class="photo-counter" role="status" aria-live="polite" aria-atomic="true"
            :aria-label="`Photo ${photoIndex + 1} of ${photos.length}`">{{ photoIndex + 1 }} / {{ photos.length }}</span>
          <button type="button" aria-label="Next photo" :disabled="photoIndex === photos.length - 1" v-on:click="next">→</button>
        </div>
        <button ref="closeButton" type="button" v-on:click="close">Sluiten - Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import IIIFImage from './IIIFImage.vue'
import PointNumber from './PointNumber.vue'
import type { Photo } from '../types'

const props = defineProps<{ photos: Photo[]; pointNumber: number }>()
const emit = defineEmits<{ close: [] }>()
const photoIndex = ref(0)
const currentPhoto = computed(() => props.photos[photoIndex.value])
const dialog = useTemplateRef<HTMLDivElement>('dialogElement')
const closeButton = useTemplateRef<HTMLButtonElement>('closeButton')
const container = useTemplateRef<HTMLDivElement>('imageContainer')
const bounds = ref({ width: 0, height: 0 })
const imageSize = computed(() => {
  const dimensions = currentPhoto.value?.dimensions
  if (!dimensions) return { width: '0px', height: '0px' }
  const scale = Math.min(bounds.value.width / dimensions[0], bounds.value.height / dimensions[1])
  return { width: `${dimensions[0] * scale}px`, height: `${dimensions[1] * scale}px` }
})
let observer: ResizeObserver | undefined
let previousFocus: Element | null = null

onMounted(() => {
  previousFocus = document.activeElement
  closeButton.value?.focus({ preventScroll: true })
  if (!container.value) return
  observer = new ResizeObserver(([entry]) => {
    bounds.value = { width: entry.contentRect.width, height: entry.contentRect.height }
  })
  observer.observe(container.value)
})
onBeforeUnmount(() => {
  observer?.disconnect()
  if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true })
})

function previous() {
  if (photoIndex.value > 0) photoIndex.value--
}

function next() {
  if (photoIndex.value < props.photos.length - 1) photoIndex.value++
}

function trapFocus(event: KeyboardEvent) {
  const buttons = dialog.value?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')
  if (!buttons?.length) return
  const first = buttons[0]
  const last = buttons[buttons.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px 24px;
  flex-shrink: 0;
  padding: 10px;
  box-sizing: border-box;
}

.photo-frame {
  position: relative;
  flex-shrink: 0;
}

.photo-number {
  position: absolute;
  top: 6px;
  left: 6px;
  pointer-events: none;
}

.photo-navigation {
  display: flex;
  align-items: center;
  gap: 12px;
}

.photo-navigation button {
  min-width: 44px;
  min-height: 44px;
  text-decoration: none;
}

.photo-navigation button:disabled {
  opacity: 0.3;
  cursor: default;
  background: none;
}

.photo-counter {
  min-width: 6ch;
  text-align: center;
  font: 14px/1.2 system-ui, sans-serif;
  font-variant-numeric: tabular-nums;
}
</style>
