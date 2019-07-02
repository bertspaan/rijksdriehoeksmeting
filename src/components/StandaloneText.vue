<template>
  <div class="container">
    <template v-if="type === 'intro'">
      <div class="dutch">
        <p>
          Verken via de kaart meer dan 8000 foto's van de meetpunten van de Rijksdriehoeksmeting.</p>
        <p>
        </p>
          Deze website is gemaakt voor de tentoonstelling <a href="https://www.panorama-mesdag.nl/ontdek/tentoonstellingen/vanaf-het-hoogste-punt-landmeten-in-mesdags-tijd/">Vanaf het Hoogste Punt: Landmeten in Mesdags Tijd</a>,
          tot 22 september 2019 in Panorama Mesdag.
        </p>
      </div>
    </template>
    <template v-else>
      <div class="dutch">
        Geen meetpunten gevonden in de buurt van deze locatie.
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'standalone-text',
  props: {
    type: String
  },
}
</script>

<style scoped>
.container {
  box-sizing: border-box;
  padding: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
}

h2 {
  line-height: 1.2;
  font-size: 2rem;
}
</style>
