import request from '@/utils/request'

export function fetchData(params) {
  return request({
    url: '/dashboard',
    method: 'get',
    params
  })
}
