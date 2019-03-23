<template>
  <div class="panes">
    <div class="location">
      <IIIFImage v-if="photo" :iiifId="photo.iiifId" :dimensions="photo.dimensions" />
    </div>
    <hr class="vertical-line" />
    <div class="text">
      <div class="dutch">
        <h2>Animatie van meetpunten</h2>
        <p>
          8274 foto's van meetpunten in Nederland. Ga naar <a href="https://landmeten.tudelft.nl/tentoonstelling">landmeten.tudelft.nl/tentoonstelling</a>
          en zoek de rijksdriehoeksmeetpunten in je eigen woonplaats op de kaart.
        </p>
      </div>
      <div class="english">
        <h2>Animation of measuring points</h2>
        <p>
          8274 photos or measuring points in the Netherlands. Visit <a href="https://landmeten.tudelft.nl/tentoonstelling">landmeten.tudelft.nl/tentoonstelling</a>
          and find
        </p>
      </div>
      <div class="qrcode">
        <div class="image-container">
          <img src="../assets/qrcode.svg" />
        </div>
        <p>
          <a href="https://landmeten.tudelft.nl/tentoonstelling">landmeten.tudelft.nl/
          <br />tentoonstelling</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>

import IIIFImage from './IIIFImage.vue'

export default {
  name: 'join',
  props: ['locations'],
  components: {
    IIIFImage
  },
  data () {
    return {
      interval: undefined,
      photo: undefined,
      seconds: 5 * 1000
    }
  },
  watch: {
    locations: function () {
      this.update()
    }
  },
  methods: {
    update: function () {
      if (this.$props.locations) {
        const features = this.$props.locations.features
        const index = Math.round(Math.random() * features.length)
        this.photo = features[index].properties.photos[0]
      }
    }
  },
  mounted: function () {
    this.interval = window.setInterval(this.update, this.seconds)
  },
  destroyed: function () {
    if (this.interval) {
      window.clearInterval(this.interval)
    }
  }

}
</script>

<style scoped>
@import '../assets/fonts.css';

.panes {
  box-sizing: border-box;
  padding: 1em;
  display: flex;
  width: 100vw;
  height: 100vh;
}

.panes > * {
  width: 50%;
}

.vertical-line {
  background-color: white;
  width: 4px;
  margin: 0 1em;
  flex-shrink: 0;
}

.location {
  text-align: center;
}

.location img {
  max-width: 100%;
  max-height: 100%;
}

.text {
  display: flex;
  flex-direction: column;
}

.dutch h2 {
  margin-top: 0;
}

.qrcode {
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 10px;
  width: 200px;
  padding: 10px;
}

.qrcode img {
  width: 100%;
  display: block;
}

.qrcode p {
  font-size: 80%;
  padding: 5px;
  margin: 0;
  line-height: 1.2em;
}

</style>
