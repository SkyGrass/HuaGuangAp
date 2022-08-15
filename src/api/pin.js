// axios
import request from '@/utils/request'

//产成品入库 提交
export function saveProStockIn(data) {
  return request({
    url: 'SaveProStockIn',
    method: 'post',
    data
  })
}
