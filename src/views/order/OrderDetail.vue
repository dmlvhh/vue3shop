<template>
<div class="order-detail-box">
  <NavBar class="nav-bar">
    <template v-slot:default>订单详情</template>
  </NavBar>
  <div class="order_details">
    <div class="order_items">
      <label>订单状态：</label>
      <span>{{statusString}}</span>
    </div>
    <div class="order_items">
      <label>订单编号：</label>
      <span>{{detail.order_no}}</span>
    </div>
    <div class="order_items">
      <label>下单时间：</label>
      <span>{{detail.created_at}}</span>
    </div>
  </div>

  <div style="padding: 30px;">
    <van-button v-if="detail.status == 1" @click="showPayFn" type="primary" block color="#42b983">去支付</van-button>
    <van-button v-if="detail.status == 2" @click="handleConfirmOrder" style="margin-top: 10px;color: black;border: 1px #b4b4b4 solid" type="primary" block color="#ffffff">确认订单</van-button>
  </div>
  <div style="width: 100%;height: 20px;background-color: #eeeded"></div>

  <div class="order_cen">
    <div class="cen_items">
      <div>
        <label>商品金额：</label>
        <span>￥{{total+'.00'}}</span>
      </div>

    </div>
    <div class="cen_items">
      <label>配送方式：</label>
      <span>普通快递</span>
    </div>
  </div>
  <div style="margin-top:110px;width: 100%;height: 20px;background-color: #eeeded"></div>

  <div class="card">
    <van-card
            v-for="item in detail.orderDetails.data"
            :key="item.id"
            :num="item.num"
            :price="item.price+'.00'"
            desc="全场包邮"
            :title="item.goods.title"
            :thumb="item.goods.cover_url"
    />
  </div>
  <van-popup
          closeable
          :close-on-click-overlay="false"
          v-model:show="showPay"
          position="bottom"
          :style="{ height: '40%' }"

  >
    <van-grid :border="false" :column-num="2">
      <van-grid-item>
        <p>支付宝二维码</p>
        <van-image width="150" height="150" :src="aliyun" />
      </van-grid-item>
      <van-grid-item>
        <p>微信二维码</p>
        <van-image width="150" height="150" :src="wechat" />
      </van-grid-item>
    </van-grid>
  </van-popup>


</div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import {onMounted,reactive,computed,toRefs} from 'vue';
  import {useRouter,useRoute} from 'vue-router';
  import {payOrder,submitOrder} from 'network/order';
  import {getOrderInfo} from 'network/order';
  import {Toast} from 'vant';
  import {useStore} from 'vuex';

  export default {
    name: "OrderDetail",
    setup() {
      const router = useRouter();
      const route = useRoute();
      const state = reactive({
        orderNo:'',
        detail: {
          orderDetails:{
            data:[]
          }
        },
        showPay:false,
        aliyun: "",
        wechat: "",
        status:0
      })
      const init = () => {
        const {id} = route.query;
        state.orderNo = id;
        getOrderInfo(id).then((res) => {
          state.detail = res;
        })

      }
      onMounted(() => {
        Toast.loading({message:'加载中...',forbidClick:true});
        init();
        Toast.clear();
      })

      // 计算订单状态
      const statusString = computed(() => {
        // 1下单 2支付 3发货 4收货 5过期
        let status = ["", "已下单", "已支付", "等待发货", "确认收货", "已过期"];
        // 返回状态
        return status[state.detail.status];
      })

      const total = computed(() => {
        let sum = 0;
        state.detail.orderDetails.data.forEach(item=> {
          sum +=item.num * item.price;
        })
        return sum;
      })
      // 点击去支付
      const showPayFn = () => {
        state.showPay = true;
        payOrder(state.orderNo, { type: "aliyun" }).then((res) => {
          // 将二维码图片赋值给state下面到的aliyun
          state.aliyun = res.qr_code_url;
          state.wechat = res.qr_code_url;
        });
      }

      const handleConfirmOrder = () => {
        Dialog.confirm({
          title:'是否确认订单'
        }).then(() => {
          confirmOrder(state.orderNo).then((res)=>{
            // if (res.status_code == 204) {
            Toast('确认成功')
            init()
            // }
          })
        }).catch(() => {

        })
      }

      // 关闭订单
      const close = () => {
        Dialog.close();
      };

      // 每隔2秒轮询查看
      const timer = setInterval(() => {
        // 订单状态
        orderStatus(state.orderNo).then((res) => {
          console.log(res)
          if (res == "2") {
            // 停止轮询
            clearInterval(timer);
            // 支付成功后跳转到订单状态
            router.push({path: "/orderdetail", query: { id: state.orderNo },
            });
          }

        });
      }, 2000);


      return {
        init,router,route,...toRefs(state),statusString,total,showPayFn,handleConfirmOrder,close


      }
    },
    components: {
      NavBar
    }
  }
</script>

<style  lang="scss" >
  .order_details {
    margin-top: 40px;
    padding:20px;

    .order_items{

      float: left;
      text-align: left;
      margin-top: 7px;
      margin-left: 10px;
      margin-bottom: 6px;
      label {
        color: #9d9d9d;
      }
    }

  }
.order_cen {
  margin-top: 30px;

  .cen_items{
    width: 300px;
    float: left;
    text-align: left;
    margin-top: 5px;
    margin-left: 30px;
    margin-bottom: 5px;
    label {
      color: #9d9d9d;
    }
  }
}
  .van-card {
    padding:30px;
  }
  .van-card__content {
    float: left;
    margin-left: -170px;
    padding-top: 0px;



  }

</style>