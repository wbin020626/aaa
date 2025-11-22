// src/api/request.ts
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus' //错误提示
import config from '@/config'

// 扩展请求配置类型，添加mock选项
interface RequestOptions extends AxiosRequestConfig {
  mock?: boolean
}

//创建axios实例
const service = axios.create({
  baseURL:config.baseApi,
})
const NETWORK_ERROR_MESSAGE = '网络错误，请稍后再试'
// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
service.interceptors.response.use(
  (res) => {
    console.log(res)
    const { code, data, msg } = res.data
    if (code === 200) {
      return data
    } else {
      // 错误信息可能在msg或data.message中
      const errorMessage = msg || data?.message || NETWORK_ERROR_MESSAGE
      ElMessage.error(errorMessage)
      return Promise.reject(new Error(errorMessage))
    }
  },
  (error) => {
    ElMessage.error(error.message || NETWORK_ERROR_MESSAGE)
    return Promise.reject(error)
  },
)

function request(options: RequestOptions) {
  options.method = options.method || 'GET'
  //关于get请求参数的调整:将data参数拼接到params中
  if(options.method.toLowerCase() === 'get'){
    options.params = options.data
    // GET请求不需要body，避免冗余
    delete options.data
  }
  //关于mock的调整
  let isMock = config.mock
  if(typeof options.mock === 'boolean'){
    isMock = options.mock
  }
  //环境
  if(config.env === 'prod'){
    service.defaults.baseURL = config.baseApi
  } else{
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
  }
  return service(options)
}

export default request
