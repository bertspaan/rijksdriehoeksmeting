<template>
  <a target="_blank" :href="`http://universalviewer.io/uv.html?manifest=https://dlc.services/iiif-manifest/delft/rijksdriehoeksmeting/${iiifId}`">
    <!-- <img :src="`https://dlc.services/thumbs/7/1/${iiifId}/full/,400/0/default.jpg`"> -->

    <img :srcset="`https://dlc.services/iiif-img/7/1/${iiifId}/full/250,/0/default.jpg 250w,
          https://dlc.services/iiif-img/7/1/${iiifId}/full/500,/0/default.jpg 500w,
          https://dlc.services/iiif-img/7/1/${iiifId}/full/1000,/0/default.jpg 1000w`"
     sizes="(max-width: 250px) 250px,
            (max-width: 500px) 500px,
            1000px"
     :src="`https://dlc.services/iiif-img/7/1/${iiifId}/full/1000,/0/default.jpg`">
  </a>
</template>

<script>

// https://dlc.services/thumbs/7/1/${iiifId}/full/,400/0/default.jpg
// https://dlc.services/iiif-img/7/1/0bb867be-a0e7-4e20-bc3a-21a19a5a062a/full/full/0/default.jpg

export default {
  name: 'iiifImage',
  props: ['iiifId']
}
</script>

<style scoped>
img {
  max-width: 100%;
  max-height: 100%;
}
</style>
