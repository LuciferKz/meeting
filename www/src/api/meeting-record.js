import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/meeting-record/list',
    method: 'get',
    params: query
  })
}

export function fetchMeetingRecord(id) {
  return request({
    url: '/meeting-record/detail',
    method: 'get',
    params: { id }
  })
}

export function uploadMeetingRecord(data) {
  return request({
    url: '/meeting-record/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function createMeetingRecord(data) {
  return request({
    url: '/meeting-record/create',
    method: 'post',
    data
  })
}

export function updateMeetingRecord(data) {
  return request({
    url: '/meeting-record/update',
    method: 'post',
    data
  })
}
