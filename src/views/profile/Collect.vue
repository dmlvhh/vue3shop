<template>
  <div>
    <NavBar>
    <template v-slot:default>收藏页面</template>
    </NavBar>
    <div class="content">
      <van-card
              num="2"
              price="2.00"
              desc="描述信息"
              title="商品标题"
              thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
      />
      <van-card
              num="2"
              price="2.00"
              desc="描述信息"
              title="商品标题"
              thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
      />
      <van-card
              num="2"
              price="2.00"
              desc="描述信息"
              title="商品标题"
              thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
      />
      <van-card
              num="2"
              price="2.00"
              desc="描述信息"
              title="商品标题"
              thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
      />
    </div>
  </div>
</template>

<script>
  import NavBar from "../../components/common/navbar/NavBar";
  export default {
    name: "collect",
    components: {
      NavBar
    }
  }
</script>

<style lang="scss" >
.content {
  margin-top: 50px;
}
.van-card {
  .van-card__content {
    margin-left: -200px;
  }
}


</style>
