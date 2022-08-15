// axios
import request from '@/utils/request'

// 获取调拨申请可操作的单据 表头
export function getAppTransHead(data) {
  return request({
    url: 'GetAppTransHead',
    method: 'post',
    data
  })
}

//获取调拨申请可操作的单据
export function getAppTrans(data) {
  return request({
    url: 'GetAppTrans',
    method: 'post',
    data
  })
}

//调拨单 提交
export function saveTrans(data) {
  return request({
    url: 'SaveTrans',
    method: 'post',
    data
  })
}
