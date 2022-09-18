import axios from "axios";
import {Dialog,Toast} from "vant";
import router from '../router'

export function request(config) {
  const instance = axios.create({
    baseURL: "/api",
    timeout:5000,
  })

  // 请求拦截
  instance.interceptors.request.use((config)=>{
    // 如果有一个接口需要认证才可以访问，在这里统一设置

    // 判断本地window.localStorage.setItem中是否保存有token
    const token = window.localStorage.getItem('token');

    // 每次响应携带token访问任何页面
    if (token) {
      config.headers.Authorization = 'Bearer '+token;
    }

    // 直接放行
    return config;
  },(error) => {

  })

  // 响应拦截

  instance.interceptors.response.use((res) => {
    // 判断是否有数据
    return res.data ? res.data : res;

  },(error) => {

    // 如果有需要授权才可以访问，就在这统一去login授权

    if (error.response.status === 401) {
      Toast.fail('请先登录');
      setTimeout(() => {
        router.push({path:"/login"});
      },800)

    }

    // 如果有错误，这里去处理错误，显示错误信息
    // 通过Object.keys()获取返回数组中的所有键
    // console.log(error.response.data.errors[Object.keys(error.response.data.errors)[0]][0])
    Dialog({ message: error.response.data.errors[Object.keys(error.response.data.errors)[0]][0]});
  })
  return instance(config);

}

