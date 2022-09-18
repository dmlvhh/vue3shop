<template>
  <div>
    <NavBar>
      <template v-slot:default>个人中心</template>
    </NavBar>
    <div class="main">

    <!--      面板部分-->
      <div class="panel">
        <div class="avatar"><img src="~assets/images/qx.jpg" alt=""></div>
        <div class="content">
          <div><span>昵称：倾心</span></div>
          <div><span>登录id：1967798998</span></div>
          <div><span>个人签名：喜欢就勇敢的去追。</span></div>
        </div>
      </div>

    <!--       业务部分-->
      <div class="business">
        <div>
          <span>我的收藏</span>
          <van-icon style="margin-right: 10px;"
                    class="right"
                    name="arrow"
                    size="18"
                    @click="goTo('/collect')"
          />
        </div>
        <div>
          <span>我的订单</span>
          <van-icon style="margin-right: 10px;"
                    class="right"
                    name="arrow"
                    size="18"
                    @click="goTo('/order')"
          />
        </div>
        <div>
          <span>账号管理</span>
          <van-icon style="margin-right: 10px;"
                    class="right"
                    name="arrow"
                    size="18"
                    @click="goTo('/account')"

          />
        </div>
        <div>
          <span>地址管理</span>
          <van-icon style="margin-right: 10px;"
                    class="right"
                    name="arrow"
                    size="18"
                    @click="goTo('/address')"
          />
        </div>
        <div>
          <span>关于我们</span>
          <van-icon style="margin-right: 10px;"
                    class="right"
                    name="arrow"
                    size="18"
                    @click="goTo('/about')"

          />
        </div>
      </div>

      <!--      退出登录-->
      <div class="lgout" @click="toLogout">
        <van-button round block
                    type="primary"
                    color="#42b983"
                    native-type="submit">
          退出登录
        </van-button>
      </div>

    </div>
  </div>
</template>

<script>
  import NavBar from "../../components/common/navbar/NavBar";
  import {logout,getUser} from "network/user";
  import {Toast} from "vant";
  import {useRouter} from 'vue-router';
  import {useStore} from 'vuex';
  import {onMounted} from 'vue';

  export default {
    name: "Personal",
    setup() {
      const store = useStore();
      const router = useRouter();



      // 跳转方法
      const goTo = (path, query) => {
        router.push({ path, query: query || {} });
      };

      // 获取用户信息

      onMounted(() => {
        getUser().then((res) => {
          // console.log(res);
        })
      })


      // 用户退出
      const toLogout = () => {
        logout().then((res) =>{
          // console.log(res);
          if (res.status == '204') {
            Toast.success('退出成功');
            // 清除本地token window.localStorage.setItem
            window.localStorage.setItem('token','');

            store.commit('setIsLogin',false);

            setTimeout(() => {
              router.push({path:"/login"});
            },500)
          }
        })
      }


      return{
        toLogout,router,store,goTo
      }
    },
    components: {NavBar}
  }
</script>

<style scoped lang="scss">
  .main{
    margin-top: 60px;
    .panel {

      width: 100%;
      height: 130px;
      border-radius: 2%;
      /*background-color: #44ba84;*/
      background-color: #f0fff0;

      .avatar {
        img {
          width: 20%;
          border-radius: 50%;
          float: left;
          margin-left: 25px;
          margin-top: 30px;
          height: auto;
        }
      }
      .content {
        float: right;
        padding-top: 30px;
        padding-left: 12px;
        width: 70%;
        font-size: 15px;
        /*color: #FFFFFF;*/
        color: black;
        text-align: left;

        div {
          margin-top: 8px;
        }
      }
    }
    .business {
      margin-top: 45px;
      div {

        margin-top: 45px;
        text-align: left;
        margin-left: 25px;
        font-size: 16px;
      }

    }
    .lgout{
      margin: 60px 20px;

    }
  }




</style>
