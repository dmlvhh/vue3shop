<template>
  <div>
    <NavBar>
      <template v-slot:default>商品详情：{{id}}</template>
    </NavBar>
    <div>
      <van-image class="img"
              width="100%"
              fit="contain"
              :src="detail.cover_url"
                 v-lazy="true"
      />
      <van-card class="tag"
              :num="detail.stock"
              :price="detail.price+'.00'"
              :desc="detail.description"
              :title="detail.title"
      >
        <template #tags>
          <van-tag style="margin: 6px" plain type="danger">{{detail.is_on==1?'新品':'未上架'}}</van-tag>
          <van-tag plain type="danger">{{detail.is_recommend==1?'推荐':'不推荐 '}}</van-tag>
        </template>
        <template #footer>
          <van-button type="warning" @click="addToCart">加入购物车</van-button>
          <van-button type="danger" @click="buyNow">立即购买</van-button>
        </template>
      </van-card>

      <van-tabs v-model:active="active">
        <van-tab title="概述">
          <div class="content" v-html="detail.details"></div>
        </van-tab>
        <van-tab title="热评">
          <div v-for="item in detail.comments" :key="item.id">

          </div>
        </van-tab>
        <van-tab title="相关图书">
          <GoodList :goods="like_goods"></GoodList>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import GoodList from "components/content/goods/GoodList";
  import {useRoute} from 'vue-router';
  import {useRouter} from 'vue-router';
  import {ref, reactive ,toRefs} from 'vue';
  import {onMounted} from 'vue';
  import {getGoodsDetail} from 'network/detail';
  import {addCart,getCart} from 'network/cart';
  import { Toast } from 'vant';
  import { useStore } from "vuex";


  export default {
    name: "Detail",
    setup(){
      const route = useRoute();
      const router = useRouter();
      const active = ref();
      const store = useStore();
      // 创建数据模型
      let books = reactive({
        detail:{},
        like_goods:[],
        goods_comments:[]
      })

      let id = ref(0);


      onMounted(() => {
        id.value = route.query.id;

        // 获取商品详情数据赋值给模型
        getGoodsDetail(id.value).then((res) =>{
          books.detail = res.goods;
          books.goods_comments = res.goods.comments;
          books.like_goods = res.like_goods;

        })
      })
      // 添加到购物车
      const addToCart = () => {
        // 接口参数接收2个值goods_id，num
        addCart({goods_id:books.detail.id,num:1}).then((res) =>{
          if (res.status == "201" || res.status == "204") {
            Toast.success('添加成功');
            store.dispatch("updateCart");
          }else{
            Toast.success('图书已抢空');
          }
        })
      }
      // 立即购买只需要用点击跳转
      const buyNow = () => {
        // 接口参数接收2个值goods_id，num
        addCart({goods_id:books.detail.id,num:1}).then((res) =>{
          if (res.status == "201" || res.status == "204") {
              store.dispatch('updateCart');
              router.push({path:"/shopcart"});
          }else {
            Toast.success('图书已抢空');
          }
        })
      }

      return {id,...toRefs(books),active,addCart, buyNow,addToCart,store}
    },
    components: {NavBar,GoodList}
  }
</script>

<style lang="scss">
  .content {
    img {
      width: 90%;
      height: auto;
    }

  }
  .img{
    margin-top: 45px;
  }
  .tag {
    text-align: left;
    font-size: 12px;
  }

</style>