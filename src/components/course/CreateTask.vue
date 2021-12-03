<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="作业列表" name="first">
      <el-table :data="tableData" style="width: 100%">
        
        <el-table-column prop="taskName" label="作业名"  />
        <el-table-column prop="viewPermission" label="查看权限"  />
        <el-table-column prop="scorePermission" label="打分权限" />
        <el-table-column prop="startTime" label="开始日期"  />
        <el-table-column prop="stopTime" label="截止日期"  />
        <el-table-column prop="weight" label="权重" />

      <el-table-column>
        <template #default="scope">
          <!-- <el-button type="danger"  size="mini" @click="deleteTask(scope.row.id)">删除</el-button> -->

          <el-popconfirm title="确定要删除该作业?" @confirm="deleteTask(scope.row.id)">
            <template #reference>
              <el-button size="mini" type="danger"> 删除作业</el-button>
            </template>
          </el-popconfirm>

        </template>
      </el-table-column>
      </el-table>
    </el-tab-pane>
    
    <el-tab-pane label="添加作业" name="second">
      
      <el-form ref="taskInfo" :model="taskInfo" label-width="100px">
        <el-form-item label="作业名称" prop="taskName" :rules="[{ required: true, message: '作业名必须填写,例如 第一次上机' },]">
          <el-input v-model.number="taskInfo.taskName" autocomplete="off"></el-input>
        </el-form-item>

      <el-form-item label="任务描述" prop="description" :rules="[{ required: true, message: '作业描述,例如 使用c++编程实现四则运算' },]">
        <el-input v-model.number="taskInfo.description" autocomplete="off"  :autosize="{ minRows: 3, maxRows: 5 }" type="textarea"></el-input>
      </el-form-item>


      <el-form-item label="打分权重" prop="weight" :rules="[{ required: true, message: '老师打分的权重, 值介于 0 ～ 1 之间' },]">
        <el-input-number v-model.number="taskInfo.weight" :precision="2" :step="0.1" :max="1" />
        <label slot="lable">&nbsp;&nbsp;&nbsp; </label>
        <el-tooltip
          effect="dark"
          content="这是老师的打分的权重,由老师打的分乘以该权重，然后加上学生打分的平均分乘以剩下的权重，最后加再一起得到加权分数 "
          placement="right-start"
        >
        <el-button>提示</el-button>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="查看权限">  
        <el-switch v-model="viewPermission" ></el-switch>
        <label slot="lable">&nbsp;&nbsp;&nbsp; </label>
        <el-tooltip
          effect="dark"
          content="老师和学生查看作业的权限,关闭后老师和学生在首页作业列表中都看不到上传的作业。"
          placement="right-start"
        >
        <el-button>提示</el-button>
      </el-tooltip>

      </el-form-item>

      <el-form-item label="打分权限">  
        <el-switch v-model="scorePermission" ></el-switch>
        <label slot="lable">&nbsp;&nbsp;&nbsp; </label>
        <el-tooltip
          effect="dark"
          content="学生的打分的权限,关闭后学生无权限打分。上面的打分权重会失效,老师打多少分就是多少分。"
          placement="right-start"
        >
        <el-button>提示</el-button>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="提交时间">

        <el-date-picker
          v-model="commitTime"
          type="datetimerange"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          start-placeholder="开始时间"
          end-placeholder="截止时间"
        >
        </el-date-picker>
      </el-form-item>
      
      <el-form-item>
      <el-button type="primary" @click="submitForm('taskInfo')">添加</el-button>

      <el-button @click="resetForm('taskInfo')">重置</el-button>
      </el-form-item>
      </el-form>

    </el-tab-pane>

    <el-tab-pane label="作业管理" name="third">
      <div>
        <el-select v-model="option" placeholder="Select" @change="changeItem">
          <el-option
          v-for="(item, index) in tableData"
              :key="index"
              :label="item.taskName"
              :value="item.id"
          >
          </el-option>
        </el-select>
        <br>
        <br>

        <el-form ref="taskInfo" :model="taskInfo" label-width="100px">

        <el-form-item label="作业名称" prop="taskName" :rules="[{ required: true, message: '作业名必须填写,例如 第一次上机' },]">
          <el-input v-model.number="taskInfo.taskName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="任务描述" prop="description" :rules="[{ required: true, message: '作业描述,例如 使用c++编程实现四则运算' },]">
          <el-input v-model.number="taskInfo.description" autocomplete="off"  :autosize="{ minRows: 3, maxRows: 5 }" type="textarea"></el-input>
        </el-form-item>

        <el-form-item label="打分权重" prop="weight" :rules="[{ required: true, message: '老师打分的权重, 值介于 0 ～ 1 之间' },]">
          <el-input-number v-model.number="taskInfo.weight" :precision="2" :step="0.1" :max="1" />
          <label slot="lable">&nbsp;&nbsp;&nbsp; </label>
        <el-tooltip
          effect="dark"
          content="这是老师的打分的权重,由老师打的分乘以该权重，然后加上学生打分的平均分乘以剩下的权重，最后加再一起得到加权分数 "
          placement="right-start"
        >
        <el-button>提示</el-button>
        </el-tooltip>
       </el-form-item>

        <el-form-item label="查看权限">  
          <el-switch v-model="viewPermission" ></el-switch>
          <label slot="lable">&nbsp;&nbsp;&nbsp; </label>
          <el-tooltip
            effect="dark"
            content="老师和学生查看作业的权限,关闭后老师和学生在首页作业列表中都看不到上传的作业。"
            placement="right-start"
          >
             <el-button>提示</el-button>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="打分权限">  
          <el-switch v-model="scorePermission" ></el-switch>
          <label slot="lable">&nbsp;&nbsp;&nbsp; </label>
          <el-tooltip
              effect="dark"
              content="学生的打分的权限,关闭后学生无权限打分。上面的打分权重会失效,老师打多少分就是多少分。"
              placement="right-start"
            >
            <el-button>提示</el-button>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="提交时间">

          <el-date-picker
            v-model="commitTime"
            type="datetimerange"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            start-placeholder="开始时间"
            end-placeholder="截止时间"
          >
          </el-date-picker>
        </el-form-item>
      
        <el-form-item>
        <el-button type="primary" @click="updateTask">更新</el-button>
        <el-button @click="resetForm('taskInfo')">重置</el-button>
        </el-form-item>
        </el-form>
      </div>

    </el-tab-pane>
    </el-tabs>


  </div>
</template>

<script>
import { ElMessage } from "element-plus"

export default {
    computed: {
      ElMessage,
    },

    name: "CreateTask",
    props: ['courseId'],
    
    created() {
      this.taskInfo.courseId = this.courseId
      this.init()
    },

    data() {
      return {

        // 作业管理
        option: '选择作业',
        taskId: "",

        activeName: 'first',

        // 作业展示
        tableData: [],

        // 表格输入
        commitTime: '',
        viewPermission: false,
        scorePermission: false,

        taskInfo: {
          courseId: "",
          taskName: "",
          description: "",
          viewPermission: "",
          scorePermission: "",
          startTime: "",
          stopTime: "",
          weight: 0.0,
        },
        

      }
    },
    methods: {
      
      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.viewPermission = false
        this.scorePermission = false
        this.taskInfo.weight = 0.0
      },
      setParam() {
        this.taskInfo.startTime = this.commitTime[0]
        this.taskInfo.stopTime = this.commitTime[1]
        this.taskInfo.viewPermission = this.viewPermission? 1: 0
        this.taskInfo.scorePermission = this.scorePermission? 1: 0
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          
          const len = this.commitTime.length
          // console.log(len)
          if (len < 2) {
            ElMessage.error("请选择时间", {duration: 3 * 1000})
            return
          }
          if (valid) {
            // 设置参数
            this.setParam()
            this.$axios.post("/course-task/addTask", this.taskInfo).then(res => {
              const data = res.data
              if (data.code == 200) {
                ElMessage.success("添加成功", {duration: 3 * 1000})
                this.resetForm('taskInfo')
                this.init()
                this.commitTime=''
                this.viewPermission = false
                this.scorePermission = false

              } else {
                ElMessage.error("添加失败", {duration: 3 * 1000})
              }
            })
          }
        })
      },
      // 更新任务
      updateTask() {
        this.$refs['taskInfo'].validate((valid) => {
          const len = this.commitTime.length
          // console.log(len)
          if (len < 2) {
            ElMessage.error("请选择时间", {duration: 3 * 1000})
            return
          }
          // 开始更新
          if (valid) {
            // 0, 设置参数
            this.setParam()
            // 1, 发起请求
            let updateData = JSON.parse(JSON.stringify(this.taskInfo))
            updateData.id = this.taskId

            // console.log(updateData)

            this.$axios.post("/course-task/updateTask", updateData).then(res => {
              const data = res.data
              if (data.code == 200) {
                ElMessage.success("更新成功", {duration: 3 * 1000})
                this.init()
                this.resetForm('taskInfo')
              } else {
                ElMessage.error("更新失败", {duration: 3 * 1000})
              }
            })

          } else {
             ElMessage.error("参数填写错误", {duration: 3 * 1000})
          }
        })
      },
      handleClick() {
        // tab, event
      },

      init() {

        this.$axios.get("/course-task/getAll?courseId="+ this.taskInfo.courseId).then(res => {
          const data = res.data
          if (data.code == 200) {
            this.tableData = data.data
          }
        })

      },

      deleteTask(id) {
        // 1, 删除作业
        this.$axios.post("/course-task/deleteTask?taskId=" + id).then(res => {
          const data = res.data
          if (data.code == 200) {
            ElMessage.success("删除数据成功", {duration: 3 * 1000})
            this.init()
          } else {
            ElMessage.error("删除数据失败", {duration: 3 * 1000})
          }

        })
        // 2， 更新列表
        this.init()
      },

      // select 选择作业
      changeItem(val) {
          this.taskId = val
          if (val == undefined || val == null || val == '') {
            ElMessage.success('请选择班级', {duration: 3 * 1000})
          } else {
            // 获取班级数据， 填写在 表格中
            const data = this.tableData.find(x => x.id == val)
            this.taskInfo.taskName = data.taskName
            this.taskInfo.description = data.description
            this.viewPermission = data.viewPermission == 1? true: false
            this.scorePermission = data.scorePermission == 1? true: false
            this.commitTime = [data.startTime, data.stopTime]
          }
      },
      
    },

    watch: {
      'courseId': function(val) {
        this.taskInfo.courseId = val
        this.init()
      }
    }

}
</script>

<style>

</style>