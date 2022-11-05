// axios
import request from '@/utils/request'

// 获取采购到货表头
export function getPOHead(data) {
  return request({
    url: 'GetPOHead',
    method: 'post',
    data
  })
}

//获取采购到货明细
export function getPo(data) {
  return request({
    url: 'GetPO',
    method: 'post',
    data
  })
}

//外购入库 提交
export function savePurStockIn(data) {
  return request({
    url: 'BuildPucherArrival',
    method: 'post',
    data
  })
}
