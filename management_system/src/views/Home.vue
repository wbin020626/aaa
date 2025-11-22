<!-- src/views/Home.vue -->
<script setup lang="ts">
import { ref,getCurrentInstance,onMounted,onBeforeUnmount,reactive} from "vue"
import Mock from "mockjs"
import * as echarts from "echarts"
import type { EChartsType } from "echarts"

//获取当前实例的代理对象,相当于this.$api
const {proxy} = getCurrentInstance() as any

const getImageUrl = (user:string)=>{
  return new URL(`../assets/images/${user}.png`,import.meta.url).href
}

const tableData = ref([])
const countData = ref<any[]>([])
const observer = ref<ResizeObserver | null>(null)
// 保存echarts实例的引用，用于销毁
const chartInstances = ref<{
  oneEchart: EChartsType | null,
  twoEchart: EChartsType | null,
  threeChart: EChartsType | null
}>({
  oneEchart: null,
  twoEchart: null,
  threeChart: null
})


const getTableData = async()=>{
  const data = await proxy.$api.getTableData()
  tableData.value = data.tableData
}
const getCountData = async()=>{
  const data = await proxy.$api.getCountData()
  countData.value = data
}
const getChartData = async()=>{
  const {orderData,userData,videoData} = await proxy.$api.getChartData()
  //折线图
  //折线图的配置项:x轴和series
  xOptions.xAxis.data = orderData.date
  xOptions.series = Object.keys(orderData.data[0]).map((val: any)=>{
    return {
      name:val,
      type:"line",
      data:orderData.data.map((item: any)=>item[val])
    }
  })
  chartInstances.value.oneEchart = echarts.init(proxy.$refs['echart'])
  chartInstances.value.oneEchart.setOption(xOptions)
  //对第二个图表进行配置
  xOptions.xAxis.data = userData.map((item: any)=>item.date)
  xOptions.series = [
    {
      name:"新增用户",
      type:"bar",
      data:userData.map((item: any)=>item.new)
    },
    {
      name:"活跃用户",
      type:"bar",
      data:userData.map((item: any)=>item.active)
    }
  ]
  chartInstances.value.twoEchart = echarts.init(proxy.$refs['userEchart'])
  chartInstances.value.twoEchart.setOption(xOptions)
  //对第三个图表饼图进行配置
  pieOptions.series = [
    {
      data:videoData,
      type:"pie",
    }
  ]
  chartInstances.value.threeChart = echarts.init(proxy.$refs['videoEchart'])
  chartInstances.value.threeChart.setOption(pieOptions)

  //监听窗口大小变化
  observer.value = new ResizeObserver((en)=>{
    chartInstances.value.oneEchart?.resize()
    chartInstances.value.twoEchart?.resize()
    chartInstances.value.threeChart?.resize()
  })
  //监听折线图
  if(proxy.$refs['echart']){
    observer.value.observe(proxy.$refs['echart'])
  }
}

onMounted(()=>{
  getTableData()
  getCountData()
  getChartData()
})

// 组件卸载前清理资源
onBeforeUnmount(() => {
  // 断开ResizeObserver监听
  if (observer.value) {
    observer.value.disconnect()
    observer.value = null
  }
  
  // 销毁所有echarts实例
  if (chartInstances.value.oneEchart) {
    chartInstances.value.oneEchart.dispose()
    chartInstances.value.oneEchart = null
  }
  if (chartInstances.value.twoEchart) {
    chartInstances.value.twoEchart.dispose()
    chartInstances.value.twoEchart = null
  }
  if (chartInstances.value.threeChart) {
    chartInstances.value.threeChart.dispose()
    chartInstances.value.threeChart = null
  }
})


const tableLabel = ref({
    name: "课程",
    todayBuy: "今日购买",
    monthBuy: "本月购买",
    totalBuy: "总购买",
})
//这个是折线图和柱状图 两个图表共用的公共配置
//折线图和柱状图的配置项
const xOptions: any = reactive({
      // 图例文字颜色
      textStyle: {
        color: "#333",
      },
      legend: {},
      grid: {
        left: "20%",
      },
      // 提示框
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category", // 类目轴
        data: [],
        axisLine: {
          lineStyle: {
            color: "#17b3a3",
          },
        },
        axisLabel: {
          interval: 0,
          color: "#333",
        },
      },
      yAxis: [
        {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#17b3a3",
            },
          },
        },
      ],
      color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
      series: [],
})
//饼图的配置项
const pieOptions: any = reactive({
  tooltip: {
    trigger: "item",
  },
  legend: {},
  color: [
    "#0f78f4",
    "#dd536b",
    "#9462e5",
    "#a6a6a6",
    "#e1bb22",
    "#39c362",
    "#3ed1cf",
  ],
  series: []
})
</script>
 <template>
  <el-row class="home" :gutter="20">
    <!-- 左边一列：用户信息、用户表格 -->
    <el-col :span="8" style="margin-top: 20px;">
      <el-card shadow="hover">
        <div class="user">
          <img :src="getImageUrl('user')" class="user">
          <div class="user-info">
          <p class="name">admin</p>
          <p class="access">超级管理员</p>
        </div>
        </div>
        <div class="login-info">
          <p>上次登录时间：<span>2025-07-19</span></p>
          <p>上次登录地点：<span>北京</span></p>
        </div>
      </el-card>
      <el-card shadow="hover" class="user-table">
        <el-table :data="tableData" >
          <el-table-column v-for="(val,key) in tableLabel"
          :key="key"
          :prop="key"
          :label="val"
          />

        </el-table>
      </el-card>
    </el-col>
    <!-- 右边一列：统计数据、折线图、柱状图、饼图 -->
    <el-col :span="16" style="margin-top: 20px;">
      <!-- 统计数据 -->
      <div class="num">
        <el-card
        :body-style="{display:'flex',padding:0}"
        v-for="item in countData"
        :key="item.name"
        shadow="hover"
      >
        <component :is="item.icon" class="icons" :style="{background:item.color}"></component>
        <div class="detail">
          <p class="num">￥{{item.value}}</p>
          <p class="txt">{{item.name}}</p>
        </div>
     </el-card>
      </div>
      <!-- 折线图 -->
      <el-card class="top-echart" shadow="hover">
        <div ref="echart" style="width: 100%;height: 280px;"></div>
      </el-card>
      <!-- 柱状图 -->
      <div class="graph">
        <el-card shadow="hover">
          <div ref="userEchart" style="height: 240px;"></div>
        </el-card>
        <el-card shadow="hover">
          <div ref="videoEchart" style="height: 240px;"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
 </template>

<style scoped lang="less">
.home{
  width: 100%;
  overflow: hidden;
}
.user{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  img{
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-right: 40px;
  }
  .user-info{
    .name{
      font-size: 35px;
      color: #333;
    }
    .access{
      font-size: 12px;
      color: #999;
    }
  }
}
.login-info{
  margin-top: 10px;
  p{
    line-height: 28px;
    font-size: 14px;
    color: #999;
    span{
      color: #666;
      margin-left: 20px;
    }
  }
}
.user-table{
  margin-top: 20px;
}
.num{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .el-card{
    width: 32%;
    margin-bottom: 20px;
  }
  .icons{
    width: 80px;
    height: 80px;
    font-size: 30px;
    text-align: center;
    color: #fff;
  }
  .detail{
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .num{
      font-size: 38px;
      margin-bottom: 10px;
    }
    .txt{
      font-size: 15px;
      color: #999;
      text-align: center;
    }
  }

}
.graph{
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .el-card{
      width: 49%;
      height: 260px;
    }
  }
</style>
