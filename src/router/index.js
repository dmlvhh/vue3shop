import { createRouter, createWebHistory } from 'vue-router'
import {Toast} from "vant";
import store from '../store'


const Home = () => import('../views/home/Home');
const Categroy = () => import('../views/category/Categroy');
const Detail = () => import('../views/detail/Detail');
const Personal = () => import('../views/profile/Personal');
const ShopCart = () => import('../views/shopcart/ShopCart');
const Register = () => import('../views/profile/Register');
const Login = () => import('../views/profile/Login');
const Address = () => import('../views/profile/Address');
const Order = () => import('../views/order/Order');
const CreateOrder = () => import('../views/order/CreateOrder');
const OrderDetail = () => import('../views/order/OrderDetail');
const OrderList = () => import('../views/order/OrderList');
const EditAddress = () => import('../views/profile/EditAddress');
const Collect = () => import('../views/profile/Collect');
const About = () => import('../views/profile/About');
const Account = () => import('../views/profile/Account');


const routes = [
  {
    path: '',
    name: 'defaultHome',
    component: Home,
    meta:{
      title:'小熊优购-首页',
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta:{
      title:'小熊优购-首页',
    }
  },
  {
    path: '/category',
    name: 'Categroy',
    component: Categroy,
    meta:{
      title:'小熊优购-商品分类',
    }

  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail,
    meta:{
      title:'小熊优购-商品详情',
    }

  },
  {
    path: '/personal',
    name: 'Personal',
    component: Personal,
    meta:{
      title:'小熊优购-个人中心',
      isAuthRequired:true
    }

  },
  {
    path: '/shopcart',
    name: 'ShopCart',
    component: ShopCart,
    meta:{
      title:'小熊优购-购物车',
      isAuthRequired:true
    }

  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta:{
      title:'小熊优购-用户注册',
    }

  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta:{
      title:'小熊优购-用户登录',
    }

  },
  {
    path: '/address',
    name: 'Address',
    component: Address,
    meta:{
      title:'小熊优购-地址管理',
    }
  },
  {
    path: '/editAddress',
    name: 'EditAddress',
    component: EditAddress,
    meta:{
      title:'小熊优购-地址更改',
    }
  },
  {
    path: '/order',
    name: 'Order',
    component: Order,
    meta:{
      title:'小熊优购-订单信息',
    }
  },
  {
    path: '/createorder',
    name: 'CreateOrder',
    component: CreateOrder,
    meta:{
      title:'小熊优购-订单支付',
    }
  },
  {
    path: '/orderdetail',
    name: 'OrderDetail',
    component: OrderDetail,
    meta:{
      title:'小熊优购-订单列表',
    }
  },
  {
    path: '/orderlist',
    name: 'OrderList',
    component: OrderList,
    meta:{
      title:'小熊优购-订单列表',
    }
  },
  {
    path: '/collect',
    name: 'Collect',
    component: Collect,
    meta:{
      title:'小熊优购-订单列表',
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta:{
      title:'小熊优购-关于我们',
    }
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta:{
      title:'小熊优购-账号管理',
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to,from,next)=> {
  // 如果没有登录，这里就到login页面
  if (to.meta.isAuthRequired && store.state.user.isLogin === false) {

    setTimeout(()=>{
      Toast.fail('请先登录');
      return next('/login');
    },500)

  } else {

    next();
  }

  document.title = to.meta.title;
})
export default router
