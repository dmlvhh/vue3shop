<template>
  <div>
    <NavBar>
      <template v-slot:default>商品分类</template>
    </NavBar>
    <div id="main">

      <div class="top-order">
        <van-tabs v-model:active="active" @click-tab="tabClick">
          <van-tab title="销量排序"></van-tab>
          <van-tab title="价格排序"></van-tab>
          <van-tab title="评论排序"></van-tab>
        </van-tabs>
      </div>

      <van-sidebar v-model="activeKey" class="left-menu">
        <van-collapse v-model="activeName" accordion>

          <van-collapse-item
                  v-for="(item,index) in categories"
                  :title="item.name"
                  :key="index"
                  :name="item.name">

            <van-sidebar-item
                    v-for="sub in item.children"
                    :title="sub.name"
                    :key="sub.id"
                    @click="getGoods(sub.id)"
            />
          </van-collapse-item>
        </van-collapse>
      </van-sidebar>

      <div class="right-goods">
        <div class="content">
          <van-card
                  v-for="item in showGoods"
                  :key="item"
                  :num="item.collects_count"
                  :tag="item.comments_count >= 0 ? '流行' : '标签'"
                  :price="item.price"
                  :desc="item.updated_at"
                  :title="item.title"
                  :thumb="item.cover_url"
                  :lazy-load="true"
                  @click="goodsDetail(item.id)"
          />
        </div>

      </div>

    </div>
    <UpBack @btop="btop" v-show="backTop"></UpBack>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import {ref, reactive, onMounted, computed, watchEffect, nextTick} from "vue";
  import {getCategroyData,getCategroyGoods} from "network/categroy";
  import BScroll from "better-scroll";
  import UpBack from "components/common/upback/UpBack";
  import {useRouter} from "vue-router";

  export default {
    name: "Categroy",

    setup () {
      const active = ref(1);//选项卡
      let activeKey = ref(0);//标签索引
      let activeName = ref('1');// 二级索引
      let categories = ref([]);// 分类数据
      let currentOrder = ref('sales');
      let currentSubId = ref(0);//当前分类 id
      let backTop = ref(false);//声明 bscroll 对象
      const router = useRouter(); //  获取路由器


      // 创建数据模型
      const goodlist = reactive({
        sales:{ page:1 , list:[] },
        price:{ page:1 , list:[] },
        comments_count:{ page:1 , list: [] }
      })
      const showGoods = computed(() => {
        return goodlist[currentOrder.value].list;
      })
      // console.log(showGoods);

      // 获取分类商品列表接口数据，并赋值给数据模型
      const init = () => {
        getCategroyGoods("sales",currentSubId.value).then((res) =>{
          goodlist.sales.list = res.goods.data;
        })
        getCategroyGoods("price",currentSubId.value).then((res) =>{
          goodlist.price.list = res.goods.data;

        })
        getCategroyGoods("comments_count",currentSubId.value).then((res) =>{
          goodlist.comments_count.list = res.goods.data;

        })

      }

      let scroll = reactive({});

      onMounted(() => {

        getCategroyData().then((res) =>{
          categories.value = res.categories;
          // console.log(res.categories);
        })
        // 初始化默认的商品
        init()
        // 创建wrapper对象

        scroll = new BScroll(".right-goods",{
          // 可选值：1|2|3
          // 1. probeType 为 0，在任何时候都不派发 scroll 事件，
          // 2. probeType 为 1，仅仅当手指按在滚动区域上，每隔 momentumLimitTime 毫秒派发一次 scroll 事件，
          // 3. probeType 为 2，仅仅当手指按在滚动区域上，一直派发 scroll 事件，
          // 4. probeType 为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画
          probeType: 3,
          click: true,
          // 触发上拉事件的阈值。
          pullUpLoad: true,
        })
        scroll.on("scroll", (position) => {

          // console.log(-position.y)

          // 固定导航栏使得下滑时显示，平时隐藏 判断进行布尔值赋值为true
          backTop.value = (-position.y) > 300;
        })
        // 当接近底部边距时pullingUp加载并触发refresh重新计算
        scroll.on("pullingUp", () => {


          const page = goodlist[currentOrder.value].page+1;

          getCategroyGoods(currentOrder.value,currentSubId.value).then((res) =>{
            goodlist[currentOrder.value].list.push(...res.goods.data);
            goodlist[currentOrder.value].page += 1;


          })
          // 完成上拉，等数据请求完成，要将新数据展示出来
          scroll.finishPullUp();

          nextTick(()=> {

            // refresh 重新计算
            scroll && scroll.refresh();

          })
          // console.log('当前类型：'+currentOrder.value+',当前页：'+page);
          // console.log(document.querySelector('.content').clientHeight);
        })
      })

      const tabClick = (index) => {
        let orders = ['sales','price','comments_count'];
        currentOrder.value = orders[index.name];

        getCategroyGoods(currentOrder.value,currentSubId.value).then((res) =>{
          goodlist[currentOrder.value].list = res.goods.data;
          nextTick(()=> {
            // refresh 重新计算
            scroll && scroll.refresh();

          })
          // console.log(goodlist[currentOrder.value]);
        })
        // console.log(currentOrder.value);
      }
      const getGoods = (id) => {

        currentSubId.value = id;
        init();
        // console.log('order---'+currentOrder.value);
        // console.log('subid---'+currentSubId.value);
      }

      // 滚动开始监听 任何一个变量有变量
      watchEffect(()=> {
        nextTick(() => {
          // refresh 重新计算
          scroll && scroll.refresh();

        })
      })
      const btop = () => {
        scroll.scrollTo(0,0,700);
      }

      return {
        activeKey,
        categories,
        activeName,
        active,
        tabClick,
        getGoods,
        currentSubId,
        goodlist,
        showGoods,
        init,
        scroll,
        backTop,
        btop,
        goodsDetail:(id) => {
          router.push({path:"/detail",query:{id}});
        },

      }

    },
    components:{
      NavBar,UpBack
    }
  }
</script>

<style lang="scss">
  #main {

    display: flex;
    margin-top: 45px;

    .top-order {
      flex: 1;
      height: 52px;
      position: fixed;
      left: 140px;
      right: 10px;
      top: 45px;
      z-index: 9;

    }
    .left-menu {
      position: fixed;
      top: 100px;
      width: 140px;
      left: 0;
      height: 600px;

    }
    .right-goods {
      flex: 1;
      position: absolute;
      top: 100px;
      right: 0;
      left: 140px;
      height: 90vh;
      padding: 8px;
      text-align: left !important;


    }
  }
 .van-card__thumb {
    width: 68px;
  }
</style>