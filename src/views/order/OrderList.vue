<template>
  <div class="content">
    <NavBar class="nav-bar">
      <template v-slot:default>订单列表</template>
    </NavBar>
    <div class="tabs">
      <van-tabs @click-tab="onClickTab"  v-model:active="active">
        <van-tab title="全部"></van-tab>
        <van-tab title="待付款"></van-tab>
        <van-tab title="已支付"></van-tab>
        <van-tab title="发货"></van-tab>
        <van-tab title="交易完成"></van-tab>
        <van-tab title="过期"></van-tab>
      </van-tabs>
    </div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          @offset="10"
      >
        <div @click="goTo(item.id)" class="order-item-box" v-for="(item,index) in list" :key="index">
          <div class="order-item-header">
            <span style="line-height: 30px;">订单号：{{item.order_no}}<br>创建时间：{{item.created_at}}</span>
          </div>
          <van-card
                  v-for="sub in item.orderDetails.data"
                  :key="sub.id"
                  :num="sub.num"
                  :price="sub.goods.price"
                  desc="全场包邮"
                  :title="sub.goods.title"
                  :thumb="sub.goods.cover_url"
          />
        </div>

        <van-cell v-for="item in list" :key="item" :title="item" />
      </van-list>
    </van-pull-refresh>


  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import {onMounted,reactive,computed,toRefs,ref} from 'vue';
  import {useRouter,useRoute} from 'vue-router';
  import {orderList} from 'network/order';


  export default {
    name: "OrderList",
    setup() {
      let active = ref(0);
      const router = useRouter();
      const route = useRoute();
      const state = reactive({
        loading: false,
        finished: false,
        refreshing: false,
        list: [],
        page: 1,
        totalPage: 0,
        status: 0,

      })

      onMounted(() => {
        onRefresh();
      })

      const loadData = () => {
        orderList({page:state.page,status: state.status,include:'orderDetails.goods'}).then((res) => {
          // 加载数据并连接新的数据
          // console.log(res);
          state.list = state.list.concat(res.data);
          state.loading=false;

          // 接口中的页数传递给变量总页数
          state.totalPage = res.meta.pagination.total_pages;
          // 如果总页数等于当前页
          if (state.page >= state.totalPage) {
            // 加载完成之后停止加载
            state.finished = true;
          }
        })
      }

      const onLoad = () => {
        // 如果当前页小于总页数的时候
        if (!state.refreshing && state.page < state.totalPage) {
          // 加载的时候 当前页面等于当前页面+1
          state.page = state.page + 1;
        }

        // 如果state下面的refreshing加载状态为真清除一下数据
        if (state.refreshing) {
          state.list = [];
          state.refreshing=false;
        }

        loadData();
      }


      const onRefresh = () => {
        // 是否处于加载状态，加载过程中不触发load事件
        state.refreshing = true;
        // 清空列表数据
        state.finished = false;
        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        state.loading = true;
        // 页面初始化为 1
        state.page = 1;
        onLoad();
      };
      const onClickTab = (name) => {
        // 通过改变状态来切换标签tab，然后重新加载数据
        state.status=name;
        onRefresh();

      }
      // 点击订单到订单详情页
      const goTo = (id) => {
        router.push({path:'/orderdetail',query:{id}})

      }


      return {
        onLoad,onRefresh,...toRefs(state),route,router,active,onClickTab,goTo
      }
    },
    components: {
      NavBar
    }
  }
</script>

<style scoped lang="scss">

  .tabs {
    margin-top: 45px;
  }

  .order-item-box {
    text-align: left;
    .order-item-header {
      margin-left: 20px;
      margin-top: 20px;
    }

  }
  .van-card {
    margin-left: -10px;
    .van-card__content {
      background-color: #42b983!important;

    }
  }

</style>