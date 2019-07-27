<template>
  <img :srcset="this.imgSrcset" :sizes="this.imgSizes"
    v-on:click="click" :src="this.imgSrc" />
</template>

<script>
const BASE_URL = 'https://dlc.services/thumbs/7/1'
const IMAGE_SIZES = [
  100,
  200,
  400,
  1024
]

export default {
  name: 'iiifImage',
  props: {
    iiifId: String,
    dimensions: Array
  },
  data () {
    return {
      baseUrl: BASE_URL,
      imageSizes: IMAGE_SIZES
    }
  },
  methods: {
    sizeStr: function (size) {
      return this.orientation === 'landscape' ? `${size},` : `,${size}`
    },
    url: function (size) {
      return `${this.baseUrl}/${this.iiifId}/full/${this.sizeStr(size)}/0/default.jpg`
    },
    click: function () {
      this.$emit('click', this.iiifId, this.dimensions)
    }
  },
  computed: {
    orientation: function () {
      return this.dimensions[0] > this.dimensions[1] ? 'landscape' : 'portrait'
    },
    imgSrcset: function () {
      return this.imageSizes.map((size) => `${this.url(size)} ${size}w`)
        .join(', ')
    },
    imgSizes: function () {
      const n = this.imageSizes.length
      return this.imageSizes
        .map((size, index) => `${index < n - 1 ? `(max-width: ${size})` : ''} ${size}px`)
        .join(', ')
    },
    imgSrc: function () {
      return this.url(this.imageSizes[this.imageSizes.length - 1])
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
