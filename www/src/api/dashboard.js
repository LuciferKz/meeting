import request from '@/utils/request'

export function fetchData(data) {
  return request({
    url: '/dashboard',
    method: 'post',
    data
  })
}
