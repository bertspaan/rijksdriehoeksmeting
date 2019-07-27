<template>
  <div class="modal">
    <div class="container">
      <div class="image">
        <IIIFImage :iiifId="iiifId" :dimensions="dimensions" v-on:click="close" />
      </div>
      <div class="centered">
        <button v-on:click="close">Sluiten - Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import IIIFImage from './IIIFImage.vue'

export default {
  name: 'modal-image',
  components: {
    IIIFImage
  },
  props: {
    iiifId: String,
    dimensions: Array
  },
  methods: {
    close: function () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  box-sizing: border-box;
  padding: 1em;
}

.container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.image {
  max-height: calc(100% - 2em);
}

.centered {
  padding: 10px;
  box-sizing: border-box;
}
</style>
