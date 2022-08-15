// axios
import request from '@/utils/request'

//模具查询
export function getMould(data) {
  return request({
    url: 'GetMould',
    method: 'post',
    data
  })
}

//库存查询
export function getCurrentStock(data) {
  return request({
    url: 'GetCurrentStock',
    method: 'post',
    data
  })
}

//库存查询1
export function getPostionStock(data) {
    return request({
      url: 'GetPostionStock',
      method: 'post',
      data
    })
  }
  
