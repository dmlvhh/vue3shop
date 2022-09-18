<template>
  <router-view/>
<!--  缓存页面数据-->
<!--  <router-view v-slot="{ Component }">-->
<!--    <transition>-->
<!--      <keep-alive exclude="Detail,NavBar,Address,EditAddress,Personal">-->
<!--        <component :is="Component"/>-->
<!--      </keep-alive>-->
<!--    </transition>-->
<!--  </router-view>-->

  <div id="nav">

    <router-link class="tab-bar-item" to="/">
      <div class="icon"><i class="iconfont icon-shouyeshouye"></i></div>
      <div>首页</div>
    </router-link>

    <router-link class="tab-bar-item" to="/category">
      <div class="icon"><i class="iconfont icon-fenlei"></i></div>
      <div>分类</div>

    </router-link>
    <router-link class="tab-bar-item" to="/shopcart">
      <van-badge :content="$store.state.cartCount" max="9">
        <div class="icon"><i class="iconfont icon-gouwuche"></i></div>
      </van-badge>

      <div>购物车</div>
    </router-link>
    <router-link class="tab-bar-item" to="/personal">
      <div class="icon">
        <i class="iconfont icon-yonghu"></i></div>
      <div>我的</div>
    </router-link>
  </div>

</template>
<script>
  import {onMounted} from 'vue';
  import { useStore } from "vuex";

  export default {
    setup() {
      // 刷新后购物车数量保持显示
      const store = useStore();
      onMounted(() => {
        store.dispatch('updateCart');
      })
      return {
        store
      }
    }
  }

</script>




<style lang="scss">
  @import "assets/css/iconfont.css";
  @import "assets/css/base.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  background-color: #F6F6F6;
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: 0 -3px 1px rgba(100,100,100,0.1);

  a {
    color: var(--color-text);

    &.router-link-exact-active {
      color: var(--color-high-text);
    }
  }

  .tab-bar-item {
    flex: 1;
    text-align: center;
    height: 50px;
    font-size: var(--font-size);

    .icon {
      width: 24px;
      height: 24px;
      margin-top: 5px;
      vertical-align: middle;
      display: inline-block;
    }

  }
}
</style>
