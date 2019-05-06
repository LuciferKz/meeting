const baseUrl = 'http://localhost:3000';
const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json; charset=utf-8')

const request = {
  config: function (config) {
    for (let name in config.headers) {
      myHeaders.append(name, config.headers[name])
    }
  },
  get: function (url, data) {
    let params = ''
    for (let name in data) {
      params += name + '=' + data[name]
    }
    return fetch(baseUrl + url + '?' + params, {
      method: 'GET',
      headers: myHeaders
    })
  },
  post: function (url, data) {
    return fetch(baseUrl + url, {
      body: JSON.stringify(data),
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, same-origin, *omit
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: myHeaders,
      mode: 'cors', // no-cors, cors, *same-origin
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // *client, no-referrer
    })
  }
}