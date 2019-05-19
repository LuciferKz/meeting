import request from '@/utils/request'

export function fetchBrandList(query) {
  return request({
    url: '/brand/list',
    method: 'get',
    params: query
  })
}
