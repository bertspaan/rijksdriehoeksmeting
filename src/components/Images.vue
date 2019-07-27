<template>
  <div class="container">
    <template v-if="images.length">
      <transition-group name="list-complete" tag="ol" class="images">
        <li class="image list-complete-item" v-for="image in images" :key="image.properties.photos[0].iiifId"
          :style="{
            width: `${Math.floor(100 / images.length )}%`
          }">
          <IIIFImage :iiifId="image.properties.photos[0].iiifId" v-on:click="click"
            :dimensions="image.properties.photos[0].dimensions" />
        </li>
      </transition-group>
    </template>
    <template v-else>
      <NoImagesFound />
    </template>
  </div>
</template>

<script>
import IIIFImage from './IIIFImage.vue'
import NoImagesFound from './NoImagesFound.vue'

export default {
  name: 'images',
  components: {
    IIIFImage,
    NoImagesFound
  },
  props: {
    images: Array
  },
  methods: {
    click: function (iiifId, dimensions) {
      this.$emit('select-image', iiifId, dimensions)
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.images {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.list-complete-item {
  transition: width .2s, height .2s, opacity .1s;
}
.list-complete-enter, .list-complete-leave-to {
  opacity: 1;
}

.list-complete-leave-active {
  opacity: 0;
}

.image {
  height: 100%;
  box-sizing: border-box;
  padding: 5px;

  display: flex;
  align-items: center;
  justify-content: center;
}

</style>

