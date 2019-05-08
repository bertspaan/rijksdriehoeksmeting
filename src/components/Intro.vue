<template>
  <div class="panes">
    <div class="location">
      <IIIFImage v-if="photo" :iiifId="photo.iiifId" :dimensions="photo.dimensions" />
    </div>
    <hr class="vertical-line" />
    <div class="text">
      <div class="dutch">
        <h2>Verken zelf de hoogste punten met uw telefoon </h2>
        <p>
          Herkent u de meetpunten die gebruikt zijn voor de Rijksdriehoeksmeting tussen 1880 en 1960?
          Verken de digitale kaart met uw telefoon en zie hier op het scherm welke bouwwerken gebruikt werden als meetpunt.
          Voor het raadplegen van de digitale kaart op uw telefoon:
        </p>
        <ul>
          <li>Scan de QR-code hieronder met uw camera; </li>
          <li>Of open <a href="http://landmeten.tudelft.nl/tentoonstelling">landmeten.tudelft.nl/tentoonstelling</a> in uw browser. </li>
        </ul>
        <p>
          Als u inzoomt op de kaart, verschijnen de foto’s vanzelf op het beeldscherm.
        </p>
      </div>
      <div class="english">
        <h2>Explore the highest points on your phone</h2>
        <p>
          Do you recognise the measuring points used for the National Triangulation network, from 1880 to 1960?
          Browse this collection of photographs by opening the digital map on your phone:
        <p>
        <ul class="narrow">
          <li>Scan the QR code on the right with your camera;</li>
          <li>Or open <a href="http://landmeten.tudelft.nl/tentoonstelling">landmeten.tudelft.nl/tentoonstelling</a> in your browser.</li>
        </ul>
        <p class="narrow">
          When you zoom in on a particular region, the photos are displayed on this screen.
        </p>
      </div>
      <div class="qrcode">
        <div class="image-container">
          <img src="../assets/qrcode.svg" />
        </div>
        <p>
          <a href="http://landmeten.tudelft.nl/tentoonstelling">landmeten.tudelft.nl/
          <br />tentoonstelling</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import IIIFImage from './IIIFImage.vue'

export default {
  name: 'intro',
  props: ['locations'],
  components: {
    IIIFImage
  },
  data () {
    return {
      interval: undefined,
      photo: undefined,
      seconds: 20 * 1000
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
    this.update()
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

.narrow {
  width: 70%;
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
