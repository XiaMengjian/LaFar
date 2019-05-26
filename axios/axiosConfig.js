import axios from 'axios'
import Vue from 'vue'
import URLSearchParams from 'url-search-params'
import { Message, Loading } from 'element-ui'

let loadingInstaces

function openLoading(options) {
  closeLoading()
  loadingInstaces = Loading.service({ ...options })
}

function closeLoading() {
  loadingInstaces && loadingInstaces.close()
}

function isVue(component) {
  return component instanceof Vue
}

axios.defaults.timeout = 30000
axios.defaults.withCredentials = true

axios.defaults.transformRequest = [function (data, headers) {
  if (!data) {
    return
  }
  const emulateJSON = data.emulateJSON
  delete data['emulateJSON']
  // json 格式
  if (emulateJSON) {
    headers['Content-Type'] = 'application/json;charset=UTF-8'
    return JSON.stringify(data)
  }
  //  urlencoded 格式
  headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  const params = new URLSearchParams()
  Object.keys(data).forEach(function (key) {
    params.append(key, data[key])
  })
  return params
}]

axios.interceptors.request.use(function (config) {
  // console.log('request Interceptor ', config)
  if (config.useLoading) {
    const configTarget = config.target
    openLoading({
      target: isVue(configTarget) ? configTarget.$el : configTarget || document.body,
      // body: true,
      fullscreen: false,
      lock: true
    })
  }
  return config
}, function (error) {
  closeLoading()
  console.error('[request error] ' + error)
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  closeLoading()
  console.log(response)
  const { status: rspStatus, data: rspData, config } = response
  const rspCode = rspData.code
  console.log(`url: ${response.request.responseURL}  rspCode : ${rspCode}  rspStatus: ${rspStatus}`)

  let errorMsg = '系统错误，请联系管理员'
  switch (rspCode) {
    case undefined:
    case 200:
    case 0:
      return rspData[config.responseObj] || rspData
    default:
      errorMsg = `系统错误，请联系管理员${rspCode}`
      break
  }

  if (config && !config.silent) {
    Message.error(errorMsg)
  }
  return Promise.reject(new Error(errorMsg))
}, function (error) {
  console.error('[response error] ', error, error.response, error.request, error.config)
  closeLoading()
  const { config, response } = error
  let errorMsg = '系统错误，请联系管理员'
  if (error.message.includes('timeout')) {
    errorMsg = '网络异常，请检查网络状况'
  } else {
    if (error.response) {
      const { status: errorRspStatus, data: errorData } = response
      switch (errorRspStatus) {
        case 401:
          errorMsg = '没有认证信息，请重新登陆'
          break
        case 403:
          errorMsg = '没有权限，请联系公司管理员分配权限'
          break
        case 400:
        case 405:
          errorMsg = errorData
          break
        default:
          errorMsg = `系统错误，请联系管理员${errorRspStatus}`
          break
      }
    }
  }
  if (errorMsg && config && !config.silent) {
    Message.error(errorMsg)
  }
  return Promise.reject(error)
})
export default axios
