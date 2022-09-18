<template>
  <div class="goods">
    <GoodListItem v-for="item in goods"  :product="item" :key="item"></GoodListItem>

  </div>
  
</template>

<script>
  import GoodListItem from "./GoodListItem";
  export default {
    name: "GoodList",
    props:{
      goods: {
        type:Array,
        default() {
          return [];
        }
      }
    },

    components: {GoodListItem}
  }
</script>

<style scoped>
  .goods {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 15px 18px 42px 18px;
  }

</style>