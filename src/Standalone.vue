<template>
  <div id="app">
    <template v-if="locations">
      <Map :locations="locations" v-on:update="updateImages" />
      <template v-if="showIntro">
        <StandaloneText type="intro" />
      </template>
      <template v-else-if="images.length">
        <Images :images="images" />
      </template>
      <template v-else>
        <StandaloneText type="empty" />
      </template>
    </template>
    <template v-else>
      Laden…
    </template>
  </div>
</template>

<script>
import axios from 'axios'

import Map from './components/Map.vue'
import Images from './components/Images.vue'
import StandaloneText from './components/StandaloneText.vue'

export default {
  name: 'standalone',
  components: {
    Map,
    Images,
    StandaloneText
  },
  props: {
    getImageUrl: Function
  },
  data () {
    return {
      showIntro: true,
      locations: undefined,
      images: []
    }
  },
  methods: {
    updateImages: function (ids, mapMoved) {
      if (mapMoved) {
        this.showIntro = false
      }
      this.images = ids.map((id) => this.locations.features[id])
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

#app {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

#app > * {
  width: 50%;
  height: 100%;
}

@media screen and (orientation: portrait) {
  #app {
    flex-direction: column;
  }

  #app > * {
    width: 100%;
    height: 50%;
  }
}
</style>
