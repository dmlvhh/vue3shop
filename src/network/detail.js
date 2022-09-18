import {request} from "./request";

export function getGoodsDetail(id) {
  return request({
    url:'/api/goods/'+id,
    // method:'get',
    // params: {
    //
    // }
  })
}