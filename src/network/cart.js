import {request} from "./request";

// 添加购物车
export function addCart(data) {
  return request({
    url:'/api/carts',
    method:'POST',
    data
  })
}
// 修改购物车 data = {num:1}
export function modifyCart(id, data) {
  return request({
    // 使用模板字符串接收变量
    url:`/api/carts/${id}`,
    method:'PUT',
    data
  })
}
// 选择商品状态 checked， 所有选中的ID
export function checkedCard(data) {
  return request({
    url:'/api/carts/checked',
    method:'PATCH',
    data
  })
}

export function getCart(data= "") {
  return request({
    // api/carts?include=goods
    url:'/api/carts?'+data,

  })
}

// 删除商品接口请求
export function deteleCartItem(id) {
  return request({
    url:`/api/carts/${id}`,
    method:'DELETE',
  })
}