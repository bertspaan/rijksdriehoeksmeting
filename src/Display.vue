<template>
  <div id="app">
    <template v-if="images.length || timeout">
      <Images :images="images" numbered />
    </template>
     <template v-else>
       <DisplayText :locations="locations" />
     </template>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import axios from 'axios'
import Images from './components/Images.vue'
import DisplayText from './components/DisplayText.vue'
import { useExhibitionSocket } from './composables/useExhibitionSocket'
import type { Locations, LocationFeature } from './types'

const locations = shallowRef<Locations>()
const images = ref<LocationFeature[]>([])
const timeout = ref<ReturnType<typeof setTimeout>>()

const { send } = useExhibitionSocket({
  onOpen() { send('display') },
  onMessage(message) {
    if (locations.value) update(message.data)
  }
})

function update(ids?: number[] | null) {
  clearTimeout(timeout.value)
  timeout.value = undefined
  images.value = ids?.map((id) => locations.value!.features[id]).filter(Boolean) ?? []
  if (ids) {
    timeout.value = setTimeout(() => {
      images.value = []
      timeout.value = undefined
    }, 20_000)
  }
}

onMounted(async () => {
  const response = await axios.get<Locations>(`${import.meta.env.BASE_URL}locations.display.geojson`)
  locations.value = response.data
})

onBeforeUnmount(() => clearTimeout(timeout.value))
</script>

<style>
@import './assets/main.css';

.clients {
  width: 100%;
}

.clients, .locations {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
}

.client {
  padding: 10px;
  flex-shrink: 0;
  box-sizing: border-box;
  height: 100vh;
}

.locations {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.location {
  height: 100%;
  box-sizing: border-box;
  padding: 5px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.message {
  text-align: center;
}
</style>
