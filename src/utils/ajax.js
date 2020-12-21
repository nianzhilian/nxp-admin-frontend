import fetch from './api'
  // 自定义判断元素类型JS
export function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
//参数过滤
export function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}
export function apiAxios(method, url, params, type) {
  return new Promise((resolve, reject) => {
    if (params) {
      params = filterNull(params)
    }
    fetch({
      method: type ? 'post_urlencoded' : method,
      url: url,
      data: method === 'POST' || method === 'PUT' || method === 'PATCH' ? params : null,
      params: method === 'GET' || method === 'DELETE' ? params : null,
      withCredentials: false
    }).then(response => {
      resolve(response.data)
    }).catch((error) => {
      console.log(error);
      reject(error);
    })
  })
}
export default {
  get: function(url, params, type) {
    return apiAxios('GET', url, params, type)
  },
  post: function(url, params, success, type) {
    return apiAxios('POST', url, params, type)
  },
  put: function(url, params, success, type) {
    return apiAxios('PUT', url, params, type)
  },
  patch: function(url, params, success, type) {
    return apiAxios('PATCH', url, params, type)
  },
  delete: function(url, params, success, type) {
    return apiAxios('DELETE', url, params, type)
  }
}
