<template>
  <div>
    <NavBar>
      <template v-slot:default>账号管理</template>
    </NavBar>
  </div>
</template>

<script>
  import NavBar from "../../components/common/navbar/NavBar";
  export default {
    name: "Account",
    components: {
      NavBar
    }
  }
</script>

<style scoped>

</style>
