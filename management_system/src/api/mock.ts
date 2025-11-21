// src/api/mock.ts
import Mock from "mockjs"
import home from "./mockData/home"
import permission from "./mockData/permission"
import user from "./mockData/user"
//拦截请求、制造数据=>mockjs

//参数1：请求地址/拦截的路径
//参数2：request的方式(get/post/put/delete)
//参数3：返回数据/模拟数据
//参数4（可选）：延迟时间(毫秒)
Mock.mock(/api\/home\/getTableData/, "get", home.getTableData)
Mock.mock(/api\/home\/getCountData/, "get", home.getCountData)
Mock.mock(/api\/home\/getChartData/, "get", home.getChartData)
Mock.mock(/api\/home\/getUserData/, "get", user.getUserList)
Mock.mock(/api\/user\/deleteUser/, "get", user.deleteUser)
Mock.mock(/api\/user\/addUser/, "post", user.createUser)
Mock.mock(/api\/user\/editUser/, "post", user.updateUser)
Mock.mock(/api\/permission\/getMenu/, "post", permission.getMenu)
