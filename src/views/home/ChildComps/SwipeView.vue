<template>
  <van-swipe v-if="banners.length" class="my-swipe" :autoplay="2500" indicator-color="white">
    <van-swipe-item v-for="(item, index) in banners" :key="index">
      <img v-lazy="item.img_url">
    </van-swipe-item>

  </van-swipe>
</template>

<script>
  export default {
    name: "SwipeView",
    props: {
      banners:Array,
      default() {
        return []
      }
    }
  }
</script>

<style scoped>

  img {
    width: 100%;
    height: 185px;
  }
</style>