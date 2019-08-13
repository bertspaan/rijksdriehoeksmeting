<template>
  <div id="app">
    <header>
      <span class="dutch">
        Beweeg de kaart om foto’s op het scherm te tonen.
      </span>
      <span class="english">
        Move the map to display photos on the screen.
      </span>
    </header>
    <main>
      <template v-if="locations">
        <Map :locations="locations" v-on:update="updateImages" />
      </template>
      <template v-else>
        <Loading />
      </template>
    </main>
    <footer :class="{
      active,
      inactive: !active
    }">
      <div v-if="active">
        <template v-if="ids.length">
          <span class="dutch">
            De geselecteerde foto’s worden getoond op het scherm.
          </span>
          <span class="english">
            The selected photos are displayed on the screen.
          </span>
        </template>
        <template v-else>
          <span class="dutch">
            Geen meetpunten gevonden in de buurt van deze locatie.
          </span>
          <span class="english">
            No measuring points found around this location.
          </span>
        </template>
      </div>
      <div v-else>
        <span class="dutch">
          Een moment geduld a.u.b.: het scherm wordt door iemand anders bediend.
        </span>
        <span class="english">
          One moment, please: someone else is operating the screen.
        </span>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios'
import Map from './components/Map.vue'
import Loading from './components/Loading.vue'
import WebSocket from './components/mixins/WebSocket.js'

export default {
  name: 'client',
  mixins: [WebSocket],
  components: {
    Map,
    Loading
  },
  data () {
    return {
      active: true,
      timeout: undefined,
      ids: [],
      locations: undefined,
      ttl: 20 * 1000
    }
  },
  watch: {
    active: function () {
      if (this.timeout) {
        window.clearTimeout(this.timeout)
      }

      this.timeout = window.setTimeout(() => {
        this.active = true
      }, this.ttl)
    }
  },
  methods: {
    updateImages: function (ids) {
      this.ids = ids
      this.wsSend('client', this.ids)
    }
  },
  created: function () {
    this.$on('ws:message', (message) => {
      this.active = message.active
    })
  },
  mounted: function () {
    axios
      .get('../locations.display.geojson')
      .then((response) => {
        this.locations = response.data
        return this.locations
      })
  }
}
</script>

<style>
@import './assets/main.css';

body {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  max-width: 1000px;
  margin: 0 auto;

  font-size: 70%;
  line-height: 1.2rem;
}

main {
  flex-grow: 1;
  position: relative;
  display: flex;
}

header, footer {
  box-sizing: border-box;
  padding: 8px;
  text-align: center;
}

footer {
  font-size: 85%;
  line-height: 1rem;
}

footer.active {
  color: black;
  background-color: #eeec77;
}

footer.inactive {
  background-color: #ed1c24;
}
</style>
