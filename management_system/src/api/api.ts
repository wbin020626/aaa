// src/api/api.ts
//整个项目api的统一管理
import request from "./request"


export default {
  //  请求首页左侧表格数据
  getTableData(){
    return request({
      url:"/home/getTableData",
      method:"get",
    })
  },
  //获取首页右侧统计数据
  getCountData(){
    return request({
      url:"/home/getCountData",
      method:"get",
    })
  },
  getChartData(){
    return request({
      url:"/home/getChartData",
      method:"get",
    })
  },
  getUserData(data){
    return request({
      url:"/home/getUserData",
      method:"get",
      data,
    })
  },
  deleteUser(data){
    return request({
      url:"/user/deleteUser",
      method:"get",
      data,
    })
  },
  addUser(data){
    return request({
      url:"/user/addUser",
      method:"post",
      data,
    })
  },
  editUser(data){
    return request({
      url:"/user/editUser",
      method:"post",
      data,
    })
  },
  getMenu(params){
    return request({
      url:"/permission/getMenu",
      method:"post",
      data:params,
    })
  },
}

