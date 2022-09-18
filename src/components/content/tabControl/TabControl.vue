<template>
  <div class="tab-control">

    <div class="tab-control-item"
         v-for="(item, index) in titles"
         :key="index"
         @click="itemIndex(index)"
         :class="{active:index == currentIndex}"
    >
      <span>{{item}}</span>
    </div>

  </div>
</template>

<script>
  import {ref} from 'vue';
  export default {
    name: "TabControl",
    props:{
      titles:{
        type:Array,
        default() {
          return [];
        }
      }
    },
    setup(props, {emit}) {

      let currentIndex = ref(0);

      const itemIndex = (index) => {
        currentIndex.value=index;
        emit('tabClick', index);

      }

      return {currentIndex,itemIndex};
    }
  }
</script>

<style scoped lang="scss">
  .tab-control {
    width: 100%;
    height: 40px;
    line-height: 40px;
    display: flex;
    font-size: 15px;
    background-color: #FFFFFF;
    position: sticky;
    top: 44px;
    z-index: 10;


    .tab-control-item {
      flex: 1;

      span {
        padding: 6px;
      }

    }
    .active {
      color: var(--color-tint);
      span {
        border-bottom: 3px solid var(--color-tint);
      }
    }
  }

</style>