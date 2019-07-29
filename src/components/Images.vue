<template>
  <div class="container">
    <template v-if="images.length">
      <transition-group name="list-complete" tag="ol" class="images">
        <li class="image list-complete-item" v-for="photo in photos" :key="photo.iiifId"
          :style="{
            width: `${Math.floor(100 / photos.length )}%`
          }">
          <IIIFImage :iiifId="photo.iiifId" v-on:click="click"
            :dimensions="photo.dimensions" />
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
  computed: {
    photos: function () {
      if (this.images.length > 2) {
        return this.images.map((image) => image.properties.photos[0])
      } else {
        return this.images.map((image) => image.properties.photos).flat()
      }
    }
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
  text-align: center;

  display: flex;
  align-items: center;
  justify-content: center;
}

</style>

