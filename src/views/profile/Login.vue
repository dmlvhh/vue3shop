<template>
  <div>
    <NavBar>
      <template v-slot:default>用户登录</template>
    </NavBar>

    <div class="content">

      <van-image width="35%"
                 src="https://typorabj.oss-cn-hangzhou.aliyuncs.com/Typoraimg/qx.jpg"
                 style="margin:40px;margin-top: 35px"
      />
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
                  v-model="email"
                  type="邮箱"
                  name="邮箱"
                  label="邮箱"
                  placeholder="邮箱"
                  :rules="[{ required: true, message: '请输入邮箱' }]"
          />

          <van-field
                  v-model="password"
                  type="password"
                  name="密码"
                  label="密码"
                  placeholder="密码"
                  :rules="[{ required: true, message: '请填写密码' }]"
          />

        </van-cell-group>
        <div style="margin: 16px;">
          <div class="link-login" @click="$router.push({path: '/register'})">
            没有账号? 立即注册
          </div>
          <van-button style="font-size: 14px" round block color="#42b983" native-type="submit">
            提 交
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import {useRouter} from "vue-router";
  import {reactive, toRefs} from "vue";
  import {Toast} from "vant";
  import {login} from "network/user";
  import {useStore} from "vuex";

  export default {
    name: "Login",
    setup() {
      const router = useRouter();
      const store = useStore();
      const userInfo = reactive({
        email:'',
        password:'',
      })
      const onSubmit = () =>{
        login(userInfo).then((res) =>{
          //  password:111111 email:qx111@com
          // console.log(res.access_token);
          // 将token保存在本地 window.localStorage.setItem
          window.localStorage.setItem("token",res.access_token);
          // 在vuex isLogin
          store.commit('setIsLogin',true);


          Toast.success('登录成功');
          userInfo.email = '';
          userInfo.password = '';

          setTimeout(() => {
            router.go(-1);
          },800)
        })
      }


      return {
        ...toRefs(userInfo),onSubmit,store

      }
    },
    components: {
      NavBar
    }
  }
</script>

<style scoped lang="scss">
  .content {
    margin-top: 50px;
  }
  .link-login {
    font-size: 14px;
    display: inline-block;
    color: #42b983;
    margin: 15px;
  }

</style>
