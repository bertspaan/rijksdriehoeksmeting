<template>
  <div id="app">
    <template v-if="showIntro">
      <StandaloneText v-on:close="showIntro = false" />
    </template>
    <template v-else-if="locations">
      <div id="split">
        <Map :locations="locations" v-on:update="updateImages" />
        <template v-if="images.length">
          <Images :images="images" v-on:select-image="modalImage"/>
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

<script>
import axios from 'axios'

import Map from './components/Map.vue'
import Images from './components/Images.vue'
import Loading from './components/Loading.vue'
import ModalImage from './components/ModalImage.vue'
import StandaloneText from './components/StandaloneText.vue'
import NoImagesFound from './components/NoImagesFound.vue'

export default {
  name: 'standalone',
  components: {
    Map,
    Images,
    StandaloneText,
    NoImagesFound,
    Loading,
    ModalImage
  },
  props: {
    getImageUrl: Function
  },
  data () {
    return {
      showIntro: true,
      locations: undefined,
      images: [],
      modal: undefined
    }
  },
  methods: {
    updateImages: function (ids, mapMoved) {
      if (mapMoved) {
        this.showIntro = false
      }
      this.images = ids.map((id) => this.locations.features[id])
    },
    modalImage: function (iiifId, dimensions) {
      this.modal = {
        iiifId,
        dimensions
      }
    }
  },
  mounted: function () {
    axios
      .get('locations.display.geojson')
      .then((response) => {
        this.locations = response.data
        return this.locations
      })
  }
}
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
