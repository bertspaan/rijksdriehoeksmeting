<template>
  <img :srcset="this.imgSrcset" :sizes="this.imgSizes"
    :src="this.imgSrc" />
</template>

<script>
export default {
  name: 'iiifImage',
  props: {
    'iiifId': String,
    'dimensions': Array
  },
  data () {
    return {
      // baseUrl: 'https://dlc.services/iiif-img/7/1',
      baseUrl: 'https://dlc.services/thumbs/7/1',
      thumbnailSizes: [
        100,
        200,
        400,
        1024
      ]
    }
  },
  methods: {
    sizeStr: function (size) {
      return this.orientation === 'landscape' ? `${size},` : `,${size}`
    },
    url: function (size) {
      return `${this.baseUrl}/${this.iiifId}/full/${this.sizeStr(size)}/0/default.jpg`
    }
  },
  computed: {
    orientation: function () {
      return this.dimensions[0] > this.dimensions[1] ? 'landscape' : 'portrait'
    },
    imgSrcset: function () {
      return this.thumbnailSizes.map((size) => `${this.url(size)} ${size}w`)
        .join(', ')
    },
    imgSizes: function () {
      const n = this.thumbnailSizes.length
      return this.thumbnailSizes
        .map((size, index) => `${index < n - 1 ? `(max-width: ${size})` : ''} ${size}px`)
        .join(', ')
    },
    imgSrc: function () {
      return this.url(this.thumbnailSizes[this.thumbnailSizes.length - 1])
    }
  }
}
</script>

<style scoped>
img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
