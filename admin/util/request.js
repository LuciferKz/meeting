const baseUrl = 'http://localhost:3000';
const myHeaders = new Headers()
myHeaders.append('Accept', 'application/json; charset=utf-8')
myHeaders.append('Content-Type', 'application/json; charset=utf-8')

const request = {
  config: function (config) {
    for (let name in config.headers) {
      myHeaders.append(name, config.headers[name])
    }
  },
  get: function (url, data) {
    let params = []
    for (let name in data) {
      params.push(name + '=' + data[name])
    }
    return fetch(baseUrl + url + '?' + params.join('&'), {
      method: 'GET',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: myHeaders,
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer',
    }).then(function (res) {
      return res.json()
    })
  },
  post: function (url, data) {
    return fetch(baseUrl + url, {
      body: JSON.stringify(data),
      cache: 'no-cache',
      credentials: 'same-origin',
      method: 'POST',
      headers: myHeaders,
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer',
    }).then(function (res) {
      return res.json()
    })
  }
}