// axios
import request from '@/utils/request'

// 获取材料出库表头
export function getMoHead(data) {
  return request({
    url: 'GetMOHead',
    method: 'post',
    data
  })
}

//获取材料出库明细
export function getMo(data) {
  return request({
    url: 'GetMO',
    method: 'post',
    data
  })
}

//材料出库 提交
export function saveMaterialOut(data) {
  return request({
    url: 'BuildMaterialOut',
    method: 'post',
    data
  })
}


