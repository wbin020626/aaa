<template>
  <div class="user-header">
    <el-button type="primary" @click="handleAdd">新增</el-button>
    <!-- 搜索框 -->
    <el-form :inline="true" :model="formInline">
      <el-form-item label="请输入">
        <el-input placeholder="请输入用户名" v-model="formInline.keyWord"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="table">
    <el-table :data="tableData" style="width: 100%">
    <el-table-column
      v-for="item in tableLable"
      :key="item.prop"
      :prop="item.prop"
      :label="item.label"
      :width="item.width?item.width:125"
     />
    <el-table-column fixed="right" label="Operations" min-width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="handleEdit(scope.row)">
          编辑
        </el-button>
        <el-button link type="primary" size="danger" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>

  </el-table>
  <el-pagination
    class="pager"
    background
    layout="prev, pager, next"
    :total="config.total"
    size="small"
    @current-change="handleChange"
  />
  </div>
  <el-dialog
    v-model="dialogVisible"
    :title="action == 'add' ? '新增用户' : '编辑用户'"
    width="35%"
    :before-close="handleClose"
  >
       <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
		在css进行处理-->
    <el-form :inline="true"  :model="formUser" :rules="rules" ref="userForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formUser.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item class="select-clearn" label="性别" prop="sex">
            <el-select  v-model="formUser.sex" placeholder="请选择">
              <el-option label="男" value="1" />
              <el-option label="女" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birth">
            <el-date-picker
              v-model="formUser.birth"
              type="date"
              placeholder="请输入"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item
          label="地址"
          prop="addr"
        >
          <el-input v-model="formUser.addr" placeholder="请输入地址" />
        </el-form-item>
      </el-row>
      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button type="primary" @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessageBox,ElMessage } from 'element-plus';
import { el } from 'element-plus/es/locales.mjs';
import { ref,getCurrentInstance, reactive,onMounted,nextTick } from 'vue';
import { useRouter } from 'vue-router';

// 定义用户表单接口
interface UserForm {
  id?: string
  name: string
  age: number | string
  sex: string
  birth: string | Date
  addr: string
}

const router = useRouter()

const tableData =ref([])
const {proxy} = getCurrentInstance() as any

const getUserData = async(params: typeof config)=>{
  //调用api，传入params参数
  const res = await proxy.$api.getUserData(params)
  console.log("筛选后的数据",res)
  tableData.value = res.list.map((item: any)=>{
    return {
      ...item,
      // 支持数字和字符串类型，统一转换为字符串判断
      sexLabel: String(item.sex) === '1' ? '男' : '女'
    }
  })
  // 更新总数，用于分页器显示
  config.total = res.count
}

// 定义表格列配置
const tableLable = reactive([
  {
    prop:"name",
    label:"姓名"
  },
  {
    prop:"age",
    label:"年龄"
  },
  {
    prop:"sexLabel",
    label:"性别"
  },
  {
    prop:"birth",
    label:"出生日期",
    width:"200px"
  },
  {
    prop:"addr",
    label:"地址",
    width:400
  }
])
// 搜索框
const formInline = reactive({
  keyWord:""// 绑定输入框的关键词，初始为空
})

// 确定按钮，提交表单
const action = ref('add')
const dialogVisible = ref(false)
const formUser = reactive<Partial<UserForm>>({})
//表单校验规则
const rules = reactive({
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  age: [
    { required: true, message: "年龄是必填项", trigger: "blur" },
    { type: "number", message: "年龄必须是数字" },
  ],
  sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
  birth: [{ required: true, message: "出生日期是必选项" }],
  addr:[{ required: true, message: '地址是必填项' }]
})

const config = reactive({
  name:'',
  total:0,
  page:1,
  pageSize:10
})

const handleSearch = () => {
  config.name = formInline.keyWord
  getUserData(config)
}

const handleChange = (page: number)=>{
  config.page = page
  getUserData(config)
}

const handleDelete = (val: any)=>{
  ElMessageBox.confirm("你确定要删除吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async()=>{
    await proxy.$api.deleteUser({id:val.id})
    ElMessage.success("删除成功")
    getUserData(config)
  })
}

const handleAdd = () => {
  dialogVisible.value = true
  action.value = 'add'
  // 清空 reactive 对象 - 使用 Object.assign 保持响应式
  Object.assign(formUser, {
    name: '',
    age: '',
    sex: '',
    birth: '',
    addr: ''
  })
  // 清除表单验证状态
  nextTick(() => {
    proxy.$refs.userForm?.clearValidate()
  })
}
//时间格式化
const timeFormat = (time: Date | string | number)=>{
  const date = new Date(time)
  let year = date.getFullYear()
  let month = date.getMonth()+1
  let day = date.getDate()
  function add(m: number){
    return m<10?"0"+m:m
  }
  return year+"-"+add(month)+"-"+add(day)
}
//编辑操作新增用户
const onSubmit = async() => {
  // 表单校验
  proxy.$refs.userForm.validate(async(valid: boolean)=>{
    if(valid){
      let res = null
      // 格式化出生日期，添加类型保护
      if (formUser.birth) {
        formUser.birth = /^\d{4}-\d{2}-\d{2}$/.test(formUser.birth as string) 
          ? formUser.birth 
          : timeFormat(formUser.birth)
      }
      if(action.value == 'add'){
        res = await proxy.$api.addUser(formUser)
      } else{
        res = await proxy.$api.editUser(formUser)
      }
      if(res){
        dialogVisible.value = false
        proxy.$refs.userForm.resetFields()
        getUserData(config)
      }
    }else{
      ElMessage({
        showClose:true,
        message:"请填写完整信息",
        type:"error"
      })
    }
  })
}

const handleClose = () => {
  // 关闭弹窗，清空表单
  dialogVisible.value = false
  // 清空 reactive 对象 - 使用 Object.assign 保持响应式
  Object.assign(formUser, {
    name: '',
    age: '',
    sex: '',
    birth: '',
    addr: ''
  })
  // 清除表单验证状态
  proxy.$refs.userForm?.clearValidate()
}
const handleCancel = () => {
  // 取消按钮，关闭弹窗
  dialogVisible.value = false
  // 清空 reactive 对象 - 使用 Object.assign 保持响应式
  Object.assign(formUser, {
    name: '',
    age: '',
    sex: '',
    birth: '',
    addr: ''
  })
  // 清除表单验证状态
  proxy.$refs.userForm?.clearValidate()
}

onMounted(()=>{
  getUserData(config)
})

const handleEdit = (row: any) => {
  action.value = 'edit'
  dialogVisible.value = true
  nextTick(() => {
    // 将选中行的数据复制到表单中，确保性别为字符串类型（与表单选项保持一致）
    Object.assign(formUser, {
      ...row,
      sex: String(row.sex) // 统一转换为字符串
    })
  })
}

</script>

<style scoped lang="less">
.user-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table{
  position: relative;
  height: 520px;
  .pager{
    position: absolute;
    right: 10px;
    bottom: 30px;
  }
  .el-table{
    height: 500px;
    width: 100%;
  }
}
.select-clearn{
  display: flex;
}
</style>
