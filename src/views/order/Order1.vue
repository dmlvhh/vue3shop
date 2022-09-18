<template>
  <div class="order">
    <NavBar>
      <template v-slot:default>订单预览</template>
    </NavBar>

    <div class="address">
      <span style="color:#c6c8cb;float: left;font-size: 13px;margin-left: 42px;margin-top: 10px">编辑联系人</span>
      <van-contact-card type="edit"	 :tel="state.address.phone" :name="state.address.name" @click="onEdit" />
    </div>

    <div class="orderGoods" v-for="(item, index) in state.cartList" :key="index">
      <van-card
              :num="item.num"
              :price="item.goods.price"
              :title="item.goods.title"
              :thumb="item.goods.cover_url"
              v-lazy="true"
      />
    </div>


    <div class="submitOrder">
      <van-submit-bar :price="totalPrice * 100" button-text="提交订单" @submit="onSubmit">
        <span>商品金额</span>
      </van-submit-bar>
    </div>

    <van-popup>
            v-model:show="showPay"
            closeable
            :close-on-click-overlay="false"
            position="bottom"
            :style="{ height: '30%' }"

      <van-grid :border="false" :column-num="2">
        <van-grid-item>
          <p>支付宝二维码</p>
          <van-image width="150" height="150" :src="aliyun" />
        </van-grid-item>
        <van-grid-item>
          <p>微信二维码</p>
          <van-image width="150" height="150" :src="wechat"/>
        </van-grid-item>
      </van-grid>
    </van-popup>


  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import {getOrderPreview,orderList,payOrder,submitOrder} from 'network/order';
  import {onMounted,reactive,computed} from 'vue';
  import {useRouter,useRoute} from 'vue-router';
  import {Toast} from 'vant';
  import {useStore} from 'vuex';

  export default {
    name: "Order",
    setup() {

      const router = useRouter();
      const route = useRoute();
      const store = useStore();

      const state =reactive({
        cartList:[],
        address:{},
        showPay:false,
        orderNO:"",
        aliyun:"",
        wechat:""


      });
      const init = () => {
        Toast.loading({message:'加载中...',forbidClick:true});
        // 调用订单预览接口
        getOrderPreview().then((res) => {
          // 对地址信息进行过滤留下用的的默认地址
          let address = res.address.filter(n=>n.is_default == '1');
          if (address.length == 0) {
            state.address = {
              address:'请设置地址信息或选择地址信息'
            }
          }else{
            state.address = address[0];
          }
          // 获取购物车商品信息
          state.cartList = res.carts;

          Toast.clear();

        })


      }

      onMounted(() => {
        init();

      })
      // 调用提交订单接口生成订单
      const onSubmit =() => {
        const params = {
          address_id: state.address.id

        }
        submitOrder(params).then((res) => {

          Toast('订单创建成功')
          store.dispatch("updateCart");
          state.showPay = true;
          // 订单id
          state.orderNO = res.id;
          // 支付二维码，获取阿里的沙箱支付信息
          payOrder(state.orderNO,{type:"aliyun"}).then((res) => {

            state.aliyun = res.qr_code_url;
            state.wechat = res.qr_code_url;

          })
          // payOrder(state.orderNO,{type:'weChat'}).then((res) => {
          //
          // })

        })
      }
      // 编辑地址信息
      const onEdit =() => {


      }

      // 计算订单列表的总价格
      const totalPrice = computed(() => {
        let sum = 0;
        state.cartList.forEach(item => {
          sum += parseInt(item.num) * (item.goods.price);
        })
        return sum;

      })

      // 支付底部弹出层

      return {
        onSubmit,onEdit,init,state,router,route,totalPrice,store
      }
    },
    components: {
      NavBar
    }
  }
</script>

<style lang="scss">

  .order {
    margin-top: 50px;
    .address {
      width: 100%;
      height: auto;

    }
    .orderGoods {
      img {
        width: 100%;
        height:auto;
      }
      .van-card__content {
        margin-left: 15px;

        flex-direction: row;
        div {
          margin-top: 10px;
          font-size: 13px;
        }
        .van-card__bottom {
          margin-right: 35px;
        }
      }
    }
  }

  .van-submit-bar__bar {
    position: fixed;
    bottom: 60px;
    left: 0;
    right: 0;
  }

  .van-card__price {
    position: absolute;
    left: 0;
    top: 30px;
    color: red;
  }

</style>