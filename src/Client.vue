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
        <LocationsMap :locations="locations" v-on:update="updateImages" />
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

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import axios from 'axios'
import LocationsMap from './components/Map.vue'
import Loading from './components/Loading.vue'
import { useExhibitionSocket } from './composables/useExhibitionSocket'
import type { Locations } from './types'

const active = ref(true)
const ids = ref<number[]>([])
const locations = shallowRef<Locations>()
let timeout: ReturnType<typeof setTimeout> | undefined

const { send } = useExhibitionSocket({
  onMessage(message) {
    if (typeof message.active === 'boolean') active.value = message.active
  }
})

watch(active, () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => { active.value = true }, 20_000)
})

function updateImages(selectedIds: number[]) {
  ids.value = selectedIds
  send('client', selectedIds)
}

onMounted(async () => {
  const response = await axios.get<Locations>(`${import.meta.env.BASE_URL}locations.display.geojson`)
  locations.value = response.data
})

onBeforeUnmount(() => clearTimeout(timeout))
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
