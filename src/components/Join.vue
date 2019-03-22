<template>
  <div class="panes">
    <div class="location">
      <IIIFImage v-if="iiifId" :iiifId="iiifId" />
    </div>
    <hr class="vertical-line" />
    <div class="text">
      <div class="dutch">
        <h2>Meetpunten</h2>
        <p>Doe mee, ga naar <a href="https://bertspaan.nl/rijksdriehoeksmeting/#7.82/52.065/5.47">bertspaan.nl/rijksdriehoeksmeting</a>
          en zoek je eigen rijksdriehoeksmeetpunt, het is écht leuk en mooi en goed!
        </p>
      </div>
      <div class="english">
        <h2>Measuring points</h2>
        <p><a href="https://bertspaan.nl/rijksdriehoeksmeting/#7.82/52.065/5.47">bertspaan.nl/rijksdriehoeksmeting</a>
          en zoek je eigen rijksdriehoeksmeetpunt, het is écht leuk en mooi en goed!
        </p>
      </div>
      <div>
        <img src="../assets/qrcode.svg" />
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
      iiifId: undefined,
      seconds: 5 * 1000
    }
  },
  methods: {
    update: function () {
      if (this.$props.locations) {
        const features = this.$props.locations.features
        const index = Math.round(Math.random() * features.length)
        this.iiifId = features[index].properties.photos[0].iiifId
      }
    }
  },
  mounted: function () {
    this.update()
    this.interval = window.setInterval(this.update, this.seconds)
  },
  destroyed: function () {
    if (this.interval) {
      window.clearInterval(this.interval)
    }
  }

}
</script>

<style>
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
  width: 8px;
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
  /* align-items: center; */
  /* justify-content: ; */
}

.dutch h2 {
  margin-top: 0;
}

</style>
