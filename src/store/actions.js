// 异步处理数据
// 获取购物车数量
import {getCart,addCart} from "../network/cart";

const actions = {
  updateCart({commit}) {
    getCart().then((res)=>{

      commit('addCart',{count:res.data.length || 0})
    })
  }

}

export default actions;