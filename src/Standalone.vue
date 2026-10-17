<template>
  <div id="app">
    <template v-if="showIntro">
      <StandaloneText v-on:close="showIntro = false" />
    </template>
    <template v-else-if="locations">
      <div id="split">
        <LocationsMap :locations="locations" v-on:update="updateImages" />
        <template v-if="images.length">
          <Images :images="images" numbered v-on:select-image="modalImage"/>
        </template>
        <template v-else>
          <NoImagesFound />
        </template>
      </div>
      <template v-if="modal">
        <ModalImage :iiifId="modal.iiifId" :dimensions="modal.dimensions"
          v-on:close="modal=undefined" />
      </template>
    </template>
    <template v-else>
      <Loading />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import axios from 'axios'
import LocationsMap from './components/Map.vue'
import Images from './components/Images.vue'
import Loading from './components/Loading.vue'
import ModalImage from './components/ModalImage.vue'
import StandaloneText from './components/StandaloneText.vue'
import NoImagesFound from './components/NoImagesFound.vue'
import type { Locations, LocationFeature, Photo } from './types'

const showIntro = ref(true)
const locations = shallowRef<Locations>()
const images = ref<LocationFeature[]>([])
const modal = ref<Photo>()

function updateImages(ids: number[], mapMoved: boolean) {
  if (mapMoved) showIntro.value = false
  images.value = ids.map((id) => locations.value!.features[id])
}

function modalImage(iiifId: string, dimensions: Photo['dimensions']) {
  modal.value = { iiifId, dimensions }
}

onMounted(async () => {
  const response = await axios.get<Locations>(`${import.meta.env.BASE_URL}locations.display.geojson`)
  locations.value = response.data
})
</script>

<style>
@import './assets/main.css';

#split {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

#split > * {
  width: 50%;
  height: 100%;
  position: relative;
}

@media screen and (orientation: portrait) {
  #split {
    flex-direction: column;
  }

  #split > * {
    width: 100%;
    height: 50%;
  }
}
</style>
