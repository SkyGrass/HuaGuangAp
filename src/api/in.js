// axios
import request from '@/utils/request'

//外购入库 提交
export function savePurStockIn(data) {
  return request({
    url: 'SavePurStockIn',
    method: 'post',
    data
  })
}
