import {request} from './request';

// 订单预览
export function getOrderPreview() {
  return request({
    url:'/api/orders/preview',
    method:'GET'
  })
}
// 提交订单
export function submitOrder(params) {
  return request({
    url:'/api/orders',
    method:'POST',
    params
  })
}
// 订单详情
export function getOrderInfo(order) {
  return request({
    url:`/api/orders/${order}`,
    params: {
      include: 'user,orderDetails.goods'
    }
  })
}
// 订单列表 {page:1, status:2, include:'user,orderDetail.goods'}
export function orderList(params) {
  return request({
    url:'/api/orders',
    params
  })
}
// 物流详情
export function logisticsDetails(order) {
  return request({
    url:`/api/orders/${order}/express`,
    method:'GET'
  })
}
// 确认订单
export function confirmOrder(order) {
  return request({
    url:`/api/orders/${order}/confirm`,
    method:'PATCH'
  })
}
// 评价商品
export function goodsComment(order) {
  return request({
    url:`/api/orders/${order}/comment`,
    method:'POST'
  })
}

// 获取支付二维码
export function payOrder(order,params) {
  return request({
    url:`/api/orders/${order}/pay`,
    params
  })
}
// 查询支付状态
export function orderStatus(order) {
  return request({
    url:`/api/orders/${order}/status`,
    method:'GET'
  })
}

