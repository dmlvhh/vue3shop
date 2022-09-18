<template>
  <div class="uptop" @click="backtop">

  </div>
  
</template>

<script>

  export default {
    name: "UpBack",
    setup(props, {emit}) {
      return {
        backtop:()=> {
          emit('btop')


        }
      }
    }
  }
</script>

<style scoped>
.uptop{
  width: 35px;
  height: 35px;
  position: fixed;
  bottom: 90px;
  right: 36px;
  border-radius: 50%;
  opacity: 0.5;


  z-index: 20;
  cursor: pointer;
  background: #ffffff  url("~assets/images/up.png") no-repeat center center;
}
.uptop:hover {
  opacity: 1.0;
}
</style>