// src/config/index.ts
//获取环境变量,拿不到就默认开发环境
const env = import.meta.env.MODE || "development"
//环境配置
const EnvConfig = {
  //开发环境
  development:{
    baseApi:"/api",
    mockApi:"https://mock.apifox.cn/m1/4068509-0-default/api"
  },
  //测试环境
  test:{
    baseApi:"//test.future.com/api",
    mockApi:"https://mock.apifox.cn/m1/4068509-0-default/api"
  },
  //生产环境
  prod:{
    baseApi:"//future.com/api",
    mockApi:"https://mock.apifox.cn/m1/4068509-0-default/api"
  }
 }

 export default {
  env,
  //环境配置
  ...EnvConfig[env],//对象展开运算符
  //mock
  mock:true
 }
