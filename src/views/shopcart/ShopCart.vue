<template>
  <div>
    <NavBar>
      <template v-slot:default>购物车</template>
    </NavBar>
    <div class="cart-box">
      <div class="cart-body">
<!--         商品卡组 包括3部分-->
        <van-checkbox-group
                ref="checkboxGroup"
                v-model="checkResult"
                @change="checkedChange"
        >

          <van-swipe-cell
                  :right-width="50"
                  v-for="(item,index) in list"
                  :key="index"
          >
            <div class="good-item">
              <!--选中购物车中商品的ID 和啥商品id双向绑定-->
              <van-checkbox :name ='item.id' checked-color="#42b983" />
              <div class="good-img">
                <img :src="item.goods.cover_url" />
              </div>

              <div class="good-desc">
                <div class="good-title">
                  <span>{{item.goods.title}}</span>
                  <span>x{{item.goods.stock}}</span>
                </div>
                <div class="good-btn">
                  <div class="price">
                    <small>￥</small>{{item.goods.price+'.00'}}
                  </div>
                  <!--  添加最大数量不能大于库存，item.num是购物车默认数量                -->
                  <van-stepper
                          integer
                          :min="1"
                          :max="item.goods.stock"
                          :model-value="item.num"
                          :name="item.id"
                          async-change
                          @change="onChange"
                  />
                </div>
              </div>
            </div>
            <template #right>
              <van-button
                      square
                      icon="delete"
                      type="danger"
                      class="delete-button"
                      @click="deleteGood(item.id)"
              />
            </template>
          </van-swipe-cell>

        </van-checkbox-group>
      </div>

      <van-submit-bar
              class="submit-all"
              :price="total * 100"
              button-text="结算"
              @submit="onSubmit"
      >
        <van-checkbox @click="allCheck" v-model:checked="checkAll" checked-color="#42b983">全选</van-checkbox>
      </van-submit-bar>

      <div class="empty" v-if="!list.length">
        <img
                class="empty-cart"
                src="~assets/images/empty-car.png"
                alt="空购物车"
        />
        <div class="title">购物车空空如也</div>
        <van-button round color="#1baeae" type="primary" block @click="goTo">前往选购</van-button>
      </div>

    </div>

  </div>
</template>

<script>
  import { reactive,toRefs,onMounted,computed,onActivated} from 'vue';
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  import {getCart,deteleCartItem,modifyCart,checkedCard} from 'network/cart';
  import { Toast } from "vant";
  import NavBar from "components/common/navbar/NavBar";
  export default {
    name: "ShopCart",
    setup() {
      const router = useRouter();
      const store = useStore();

      // 数据模型
      const state = reactive({
        list:[],
        // id 数组
        checkResult:[],
        checkAll:true

      })

      const init = ()=> {

        // 初始化购物车之前显示加载效果
        Toast.loading({message:'加载中...',forbidClick:true});
        // 获取购物车中的商品数据
        getCart("include=goods").then((res) =>{
          state.list = res.data;
          // filter 一下只拿到选中的商品，然后map一下只留下id数组对象
          state.checkResult = res.data.filter(n => n.is_checked == '1').map(item => item.id);


          // console.log(res.data);
          // 获取完成后清除加载效果
          Toast.clear();
        })
      }
      onMounted(() => {
        // 在页面实例挂载开始调用加载页面数据
        init();
      })
      // 开始购物跳转页面
      const goTo = () => {
        router.push({path:'/home'});
      }
      // 异步请求改变商品加减数量
      const onChange = (value, detail)=> {
        // 加一个轻提示，防止异步快速处理数据库操作程序还未加载完另一个请求又来了
        Toast.loading({message:'修改中...',forbidClick:true});

        // name 绑定了id
        modifyCart(detail.name, {num: value }).then((res) =>{
          // console.log(res);

        //    在客户端的数量不刷新是不会变的，所以在onMounted中的lsit中的num也需要改变
          state.list.forEach(item => {
            if (item.id == detail.name) {
              item.num = value;
            }
          })
          Toast.clear();
        })
      }
      // 复选框改变处理 把默认双向绑定的值传入进入 响应改变,在在变数据库
      const checkedChange = (checkResult) => {
        // 处理当有一个没选的时候 全选按钮不选择
        if (checkResult.length  == state.list.length) {
          state.checkAll = true;
        } else {
          state.checkAll = false;
        }
        state.checkResult = checkResult;
        // 数据表的改变
        checkedCard({cart_ids:checkResult});
        // console.log(checkResult)
      }
      // 全选
      const allCheck = () => {
        if (!state.checkAll) {
          state.checkResult = state.list.map(item=>item.id);
          state.checkAll = true;
        } else {
          state.checkResult = [];
          state.checkAll = false;
        }
      }
      // 通过id删除商品
      const deleteGood = (id) => {
        deteleCartItem(id).then((res) =>{
          // 调用删除接口后重新初始化商品
          init();
          // 改变vuex的状态数量
          store.dispatch("updateCart");
        })

      }

      // 购物车计算结算
      const total = computed(() => {
        let sum = 0;
        // 首先过滤购物车中所有商品，用includes方法查找result里面有没有item这个值，存在则为真，
        //filter  过滤购物车中所有商品，     includes  选中
        state.list.filter(item => state.checkResult.includes(item.id))
            .forEach(item => {
              sum += parseInt(item.num) * parseFloat(item.goods.price);
            })
        return sum;

      })

      const onSubmit = () => {
        if (state.checkResult.length == 0) {
          Toast.fail('请选择商品进行结算');
          return;
        } else {
          router.push({path:'/order'})
        }
      }
      // 从分类添加商品在进入购物车重新初始化商品
      onActivated(() => {
        init();
      })

      return {
        ...toRefs(state),router,store,init,goTo,onChange,checkedChange,allCheck,deleteGood,total,onSubmit
      }
    },

    components: {NavBar}
  }
</script>

<style lang="scss">
  .cart-box {
    .cart-body {
      margin: 60px 0 100px 0;
      padding-left: 10px;
      .good-item {
        display: flex;
        .good-img {
          img {
            padding: 8px;
            width: 100px;
            height: auto;
          }
        }
        .good-desc {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          padding: 20px;
          .good-title {
            display: flex;
            justify-content: space-between;
          }
          .good-btn {
            display: flex;
            justify-content: space-between;
            .price {
              font-size: 16px;
              color: red;
              line-height: 28px;
            }
            .van-icon-delete {
              font-size: 20px;
              margin-top: 4px;
            }
          }
        }
      }
      .delete-button {
        width: 50px;
        height: 100%;
      }
    }
    .empty {
      width: 50%;
      margin: 0 auto;
      text-align: center;
      margin-top: 200px;
      .empty-cart {
        width: 150px;
        margin-bottom: 20px;
      }
      .van-icon-smile-o {
        font-size: 50px;
      }
      .title {
        font-size: 16px;
        margin-bottom: 20px;
      }
    }
    .submit-all {
      margin-left: -6px;
      margin-bottom: 65px;
      .van-checkbox {
        margin-left: 0px;
      }
      .van-submit-bar__text {
        margin-right: 20px;
      }
      .van-submit-bar__button {
        background: red;
      }
    }
    .van-checkbox__icon--checked .van-icon {
      background-color: red;
      border-color: red;
    }
  }


</style>