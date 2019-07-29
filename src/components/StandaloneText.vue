<template>
  <div class="container">
    <div class="dutch">
      <Images :images="images1" v-on:select-image="close"/>
      <p>
        Verken via de kaart meer dan 8000 foto's van meetpunten van de Rijksdriehoeksmeting.
      </p>
      <p>
        Deze website is gemaakt voor de tentoonstelling <a href="https://www.panorama-mesdag.nl/ontdek/tentoonstellingen/vanaf-het-hoogste-punt-landmeten-in-mesdags-tijd/">Vanaf het Hoogste Punt: Landmeten in Mesdags Tijd</a>,
        te zien tot en met 22 september 2019 in Panorama Mesdag.
      </p>
      <div class="centered">
        <button v-on:click="close">Start</button>
      </div>
      <ul class="light">
        <li>Tentoonstelling: Panorama Mesdag &amp; TU Delft Library</li>
        <li>Fotocollectie: Kadastermuseum</li>
        <li>Dataset: Herman de Koning</li>
        <li>Applicatie: Bert Spaan</li>
      </ul>
      <p class="light">De broncode en data staat <a href="https://github.com/bertspaan/rijksdriehoeksmeting">op GitHub</a>.</p>
    </div>
    <hr class="horizontal-line" />
    <div class="english">
      <Images :images="images2" v-on:select-image="close"/>
      <p>
        Use the map to explore more than 8000 photos of the Dutch National Triangulation Network.
      <p>
      <p>
        This website is made for the the exhibition <a href="https://www.panorama-mesdag.nl/ontdek/tentoonstellingen/vanaf-het-hoogste-punt-landmeten-in-mesdags-tijd/">Vanaf het Hoogste Punt: Landmeten in Mesdags Tijd</a>,
         through 22 september 2019 in Panorama Mesdag.
      </p>
      <div class="centered">
        <button v-on:click="close">Start</button>
      </div>
      <ul class="light">
        <li>Exhibition: Panorama Mesdag &amp; TU Delft Library</li>
        <li>Foto collection: Kadastermuseum</li>
        <li>Dataset: Herman de Koning</li>
        <li>Application: Bert Spaan</li>
      </ul>
      <p class="light">The source code and data is available <a href="https://github.com/bertspaan/rijksdriehoeksmeting">on GitHub</a>.</p>
    </div>
  </div>
</template>

<script>
import Images from './Images.vue'

const images1 = [
  {"type":"Feature","id":4186,"properties":{"photos":[{"iiifId":"5359b9bf-d6c7-4c81-a396-53f9a2a5c8b9","dimensions":[1151,1969]}]},"geometry":{"type":"Point","coordinates":[6.1026787,52.5136313]}},
  {"type":"Feature","id":4189,"properties":{"photos":[{"iiifId":"b13a9cf7-9bad-4622-a3c4-f4f76fe837fd","dimensions":[1232,1963]}]},"geometry":{"type":"Point","coordinates":[6.1043682,52.5126098]}},
  {"type":"Feature","id":4197,"properties":{"photos":[{"iiifId":"8b0df0dc-a5e2-4692-87b0-b81b4e52ffcf","dimensions":[1154,1962]}]},"geometry":{"type":"Point","coordinates":[6.1114736,52.5171234]}},
  {"type":"Feature","id":4185,"properties":{"photos":[{"iiifId":"8303d0e5-a803-426d-a2d7-b566d6d93e1d","dimensions":[1050,1656]}]},"geometry":{"type":"Point","coordinates":[6.0954251,52.516169]}}
]

const images2 = [
  {"type":"Feature","id":3195,"properties":{"photos":[{"iiifId":"afdda991-5491-4358-962f-1147f6f6da11","dimensions":[1756,2677]}]},"geometry":{"type":"Point","coordinates":[4.2678564,52.0805105]}},
  {"type":"Feature","id":3112,"properties":{"photos":[{"iiifId":"8048810f-7408-45fa-a533-79be301a21f2","dimensions":[1246,1739]}]},"geometry":{"type":"Point","coordinates":[4.26828,52.1041366]}},
  {"type":"Feature","id":3110,"properties":{"photos":[{"iiifId":"b956d6b9-8359-45c8-8b14-17815252ce0e","dimensions":[1302,2218]}]},"geometry":{"type":"Point","coordinates":[4.26828,52.1041366]}},
  {"type":"Feature","id":3107,"properties":{"photos":[{"iiifId":"9ddcb4b4-139c-4223-9ca3-41f49680fb82","dimensions":[1162,2187]}]},"geometry":{"type":"Point","coordinates":[4.2818475,52.1131241]}}
]

export default {
  name: 'standalone-text',
  components: {
    Images
  },
  props: {
    type: String
  },
  data () {
    return {
      images1,
      images2
    }
  },
  methods: {
    close: function () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.container {
  box-sizing: border-box;
  padding: 1em;
  width: 800px;
  margin: 0 auto;
  max-width: 100%;
}

p:first-child {
  margin-top: 0;
}

h2 {
  line-height: 1.2;
  font-size: 2rem;
}

.centered {
  text-align: center;
}

.light {
  font-weight: lighter;
  font-size: smaller;
}
</style>
