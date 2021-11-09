<template>
    <div>
        <el-select v-model="option" placeholder="Select" @change="changeItem">
            <el-option
            v-for="(item, index) in options"
             :key="index"
             :label="item.value"
             :value="item.id"
            >
        </el-option>
        </el-select>
        <el-table :data="tableData.filter((data) => !search || data.username.toLowerCase().includes(search.toLowerCase()) || data.name.toLowerCase().includes(search.toLowerCase()))" 
            style="width: 100%">
            <el-table-column prop="username" label="学号" width="180" />
            <el-table-column prop="name" label="姓名" width="180" />
            <el-table-column prop="password" label="密码" width="180" />

            <el-table-column align="right" >

                <template #header>
                        <el-input v-model="search"  size="mini" placeholder="输入学生姓名或学号" />
                </template>
                <template #default="scope">
                    <el-button type="danger"  size="mini" @click="handleClick(scope.row.id)">删除</el-button>
                </template>

            </el-table-column>        

        </el-table>
    </div>

  

</template>

<script >
import { ElMessage } from 'element-plus'
export default {
  name: "StuSetUp",

  created() {
      // 1, 初始化班级列表
      this.$axios.get("/stu-class/getAllFormatClass").then(res => {
          
          const data = res.data
          if (data.code == 200) {
            this.options = data.data
          } else {
             ElMessage.error('初始化数据失败', {duration: 3 * 1000})
          }
      })
  },

  data() {
      return {

        options: [],
        search: '',
        option: '选择班级',

        stuVisable: false,
        tableData: [],
        classId: "",
      }
  },
  methods: {

      getStuList(val) {
          this.$axios.get("/user/getAllStu?classId=" + val).then(res => {
              
              const data = res.data
              if (data.code == 200) {
                  ElMessage.success('获取数据成功', {duration: 3 * 1000})
                  this.tableData = data.data

              } else {
                  ElMessage.error('获取数据失败', {duration: 3 * 1000})
              }
          })
      },

      changeItem(val) {
          this.classId = val
          // console.log(val)
          // 1， 根据 班级号获取 班里的学生
          this.getStuList(val)
      },

      handleClick(id) {
        // 删除用户
        console.log(id) 
        // 根据id 删除用户
        this.$axios.get("/user/delete?id="+ id).then(res => {
            const data = res.data
            if (data.code == 200 && data.data == true) {
                ElMessage.success('删除用户', {duration: 3 * 1000})
                const classId = this.classId
                if (classId != null && classId != "") {
                    console.log(classId)
                }
                this.getStuList(classId)

            } else {
                ElMessage.error('删除用户失败', {duration: 3 * 1000})

            }


        })


        

      },
  }
}
</script>
