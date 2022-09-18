<template>
  <div>
    <NavBar>
      <template v-slot:default>用户注册</template>
    </NavBar>

    <div class="content">

      <van-image width="35%"
                 src="https://typorabj.oss-cn-hangzhou.aliyuncs.com/Typoraimg/qx.jpg"
                 style="margin:40px;margin-top: 35px"
      />
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
                  v-model="name"
                  name="用户名"
                  label="用户名"
                  placeholder="用户名"
                  :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
                  v-model="password"
                  type="password"
                  name="密码"
                  label="密码"
                  placeholder="密码"
                  :rules="[{ required: true, message: '请填写密码' }]"
          />
          <van-field
                  v-model="password_confirmation"
                  type="password"
                  name="确认密码"
                  label="确认密码"
                  placeholder="确认密码"
                  :rules="[{ required: true, message: '请填写密码' }]"
          />
          <van-field
                  v-model="email"
                  type="邮箱"
                  name="邮箱"
                  label="邮箱"
                  placeholder="邮箱"
                  :rules="[{ required: true, message: '请输入邮箱' }]"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <div class="link-login" @click="$router.push({path: '/login'})">
            已有账号, 立即登录
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
  import {register} from 'network/user'
  import {toRefs, reactive} from 'vue';
  import {Dialog,Toast} from "vant";
  import {useRouter} from 'vue-router';


  export default {
    name: "Register",
    setup() {
      let router = useRouter();
      const userInfo = reactive({
        name:'',
        password:'',
        password_confirmation:'',
        email:''
      })
      const onSubmit = () =>{
        //  password:111111 email:qx111@com
        // console.log(userInfo);
        // 验证两次密码是否一致
        if (userInfo.password!==userInfo.password_confirmation) {
          Dialog({ message: '两次密码不一致' });
        }else{
          register(userInfo).then((res) => {
            // console.log(res.status);
            if (res.status == '201') {
              Toast.success('注册成功');

              setTimeout(() => {
                router.push({path:'/login'});
              },1000)

            }
            userInfo.name = '';
            userInfo.password = '';
            userInfo.email = '';

          })
        }
      }

      return {
        ...toRefs(userInfo),onSubmit

      }
    },
    components:{
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