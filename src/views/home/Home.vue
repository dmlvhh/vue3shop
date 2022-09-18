<template>
  <div class="home">
<!--     固定导航栏使得下滑时显示，平时隐藏-->
    <tab-control v-show="isTabFixed" @tabClick="tabClick" :titles="['畅销','新书','精选']"></tab-control>
    <NavBar>
      <template v-slot:left></template>
      <template v-slot:default>小熊优购</template>
      <template v-slot:right></template>
    </NavBar>

    <div class="wrapper">

      <div class="content">

        <div ref="banref">

          <SwipeView :banners="banners"></SwipeView>
          <recommend-view :recommends="recommends"></recommend-view>

        </div>

        <tab-control @tabClick="tabClick" :titles="['畅销','新书','精选']"></tab-control>
        <GoodList :goods="showGoods"></GoodList>

      </div>

    </div>
    <UpBack @btop="btop" v-show="backTop"></UpBack>

  </div>
</template>

<script>
  import NavBar from "../../components/common/navbar/NavBar";
  import TabControl from "../../components/content/tabControl/TabControl";
  import RecommendView from "./ChildComps/RecommendView";
  import GoodList from "../../components/content/goods/GoodList";
  import UpBack from "../../components/common/upback/UpBack";
  import SwipeView from "./ChildComps/SwipeView";
  import {getHomeAllData,getHomeGoods} from "../../network/home";
  import {ref, reactive, onMounted, computed, watchEffect ,nextTick} from 'vue';

  import BScroll from 'better-scroll';

  export default {
    name: "Home",

    setup() {
      let isTabFixed = ref(false);
      let backTop = ref(false);
      let banref = ref(null);
      let banners = ref([]);

      const recommends = ref([]);

      // 商品列表数据模型
      const goods = reactive({
        recommend:{page:1,list:[]},
        sales:{page:1,list:[]},
        new:{page:1,list:[]}
      })

      let currentType = ref('sales');

      const showGoods = computed(() => {
        return goods[currentType.value].list;
      })

      let scroll = reactive({});

      onMounted(() => {
        getHomeAllData().then((res)=>{
          // console.log(res.goods);
          recommends.value = res.goods.data;
          banners.value = res.slides;

        })


        // 获取sales数据
        getHomeGoods("sales").then((res)=>{
          goods.sales.list = res.goods.data;
        })
        // 获取new数据
        getHomeGoods("new").then((res)=>{
          goods.new.list = res.goods.data;
        })
        // 获取recommed数据
        getHomeGoods("recommed").then((res)=>{
          goods.recommend.list = res.goods.data;
        })

        // 创建wrapper对象

        scroll = new BScroll('.wrapper',{
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

        // 触发下拉滚动
        scroll.on("scroll", (position) => {

          // console.log(-position.y)
          // console.log(banref.value.offsetHeight)
          // 固定导航栏使得下滑时显示，平时隐藏 判断进行布尔值赋值为true
          backTop.value = isTabFixed.value = (-position.y) > banref.value.offsetHeight;

        })
        // 当接近底部边距时pullingUp加载并触发refresh重新计算
        scroll.on("pullingUp", () => {


          const page = goods[currentType.value].page+1;
          getHomeGoods('sales',page).then((res) =>{
            goods[currentType.value].list.push(...res.goods.data);
            goods[currentType.value].page += 1;

          })
          // 完成上拉，等数据请求完成，要将新数据展示出来
          scroll.finishPullUp();


          // console.log('下拉底部边距超过阈值')
          scroll.refresh();
          // console.log('当前类型：'+currentType.value+',当前页：'+page);
          // console.log(document.querySelector('.content').clientHeight);

        })



        // console.log(goods);
      })

      const tabClick = (index)=>{
        // console.log(tabClick)
        nextTick(()=> {
          // refresh 重新计算
          scroll && scroll.refresh();

        })
        let types = ['sales','new','recommend'];
        // console.log(types);
        currentType.value = types[index]

      }

      // 滚动开始监听 任何一个变量有变量
      watchEffect(()=> {
        nextTick(()=> {
          // refresh 重新计算
          scroll && scroll.refresh();

        })
      })
      const btop = ()=> {
        scroll.scrollTo(0,0,700);
      }

      return {recommends, tabClick, goods, showGoods, isTabFixed, banref ,backTop ,btop, banners};
    },


    components: {RecommendView, NavBar,TabControl,GoodList, UpBack, SwipeView}

  }
</script>

<style scoped>
  .banners {

  }
  img {
    width: 100%;
    height: 200px;
  }
  .home {
    height: 100vh;
    position: relative;
  }
  .wrapper {
    position: absolute;
    top: 45px;
    bottom: 50px;
    left: 0;
    right: 0;
    overflow: hidden;

  }


</style>