import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/log/list',
    method: 'get',
    params: query
  })
}

export function fetchLog(id) {
  return request({
    url: '/log/detail',
    method: 'get',
    params: { id }
  })
}
