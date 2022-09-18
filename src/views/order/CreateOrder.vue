<template>
  <div>
    <NavBar>
      <template v-slot:default>订单详情</template>
    </NavBar>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  export default {
    name: "CreateOrder",
    components: {
      NavBar
    }
  }
</script>

<style scoped>

</style>