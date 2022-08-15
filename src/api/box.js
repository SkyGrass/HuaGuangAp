// axios
import request from '@/utils/request'

//拆箱记录 提交
export function saveBox(data) {
  return request({
    url: 'SaveBox',
    method: 'post',
    data
  })
}
