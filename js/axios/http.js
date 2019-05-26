import axios from './axiosConfig'

/*
 * responseObj : response 结果集中默认字段
 * useLoading： 是否使用Loading
 * silent: 是否提示错误
 * target: loading的范围
 *
*/
const api = ({ url, method = 'POST', params = {}, responseObj = 'data', emulateJSON = true, useLoading = false, silent = false, target = null, timeout = 10000 }) => {
  const reqConf = {
    method,
    url,
    useLoading: target ? true : useLoading,
    silent,
    target,
    responseObj,
    timeout, // 0 表示无超时时间
    cancelToken: new axios.CancelToken(function (cancel) {
    })
  }
  if (method === 'POST' && emulateJSON) {
    params.emulateJSON = true
  }
  reqConf[method === 'POST' ? 'data' : 'params'] = params

  return new Promise((resolve, reject) => {
    axios(reqConf).then((responseData) => {
      resolve(responseData)
    }).catch((error) => {
      console.error('error 2', error.response, error.message, error.config)
      reject(error)
    })
  })
}

const xxxApi = (obj) => {
  // return api(Object.assign(obj, { url: process.env.VUE_APP_xxx_ADDRESS.concat(obj.url) }))
  return api(Object.assign(obj))
}

export default {
  api,
  xxxApi
}
