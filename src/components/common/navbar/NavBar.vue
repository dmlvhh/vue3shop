<template>
  <div class="nav-bar">
    <div @click="goback" class="left"><slot name="left">
      <img src="~assets/images/fanhui2.png" alt="">
    </slot></div>
    <div class="center"><slot>小熊优购</slot></div>
    <div class="right"><slot name="right"></slot></div>
  </div>
</template>

<script>
  import {useRouter} from 'vue-router';
  export default {
    name: "NavBar",
    setup() {
      const router = useRouter();
      const goback = () => {
        router.go(-1);
      }
      return {goback};

    }
  }
</script>

<style scoped>
  .nav-bar {
    display: flex;
    background-color: var(--color-tint);
    color: #FFFFFF;
    height: 45px;
    line-height: 45px;
    text-align: center;
    box-shadow: 0 2px 0px rgba(100,100,100,0.1);
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 30;
  }
  .left img{
    width: 50px;
    padding: 10px;
  }
  .left,.right{
    width: 60px;
  }

  .center {
    height: 45px;
    flex: 1;

  }

</style>