import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/meeting/list',
    method: 'get',
    params: query
  })
}

export function fetchMeeting(id) {
  return request({
    url: '/meeting/detail',
    method: 'get',
    params: { id }
  })
}

export function uploadMeeting(data) {
  return request({
    url: '/meeting/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/meeting/pv',
    method: 'get',
    params: { pv }
  })
}

export function createMeeting(data) {
  return request({
    url: '/meeting/create',
    method: 'post',
    data
  })
}

export function updateMeeting(data) {
  return request({
    url: '/meeting/update',
    method: 'post',
    data
  })
}
