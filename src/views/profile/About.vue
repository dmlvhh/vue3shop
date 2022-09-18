<template>
  <div>
    <NavBar>
      <template v-slot:default>关于我们</template>
    </NavBar>
  </div>
</template>

<script>
  import NavBar from "../../components/common/navbar/NavBar";
  export default {
    name: "About",
    components: {
      NavBar
    }
  }
</script>

<style scoped>

</style>
