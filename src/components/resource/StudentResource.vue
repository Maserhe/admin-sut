<template>
  <div>
      <h2>我的资源</h2>
    <el-divider></el-divider>

    <el-row :gutter="20" class="el-row" type="flex" >
      <el-col :span="8" v-for = "(item,index) in courses" v-model="courses" :key="index" class="el-col" >
        <el-card class="el-card" :key="index" onclick="">

          <img :src="$downLoad  + item.img"  class="image"/>

          <div slot="header" class="clearfix">

            <el-tooltip placement="top" :content="'课程描述: ' + item.description">

              <span>{{item.title}}</span>
            </el-tooltip>
          </div>

          <div >
            <div class="text item">
             <el-button type="primary" class="btn" @click="gotoCourse(item.id)">进入资源</el-button>
            </div>
          </div>  
        </el-card>
      </el-col>  
    </el-row>

    <!-- 资源下载对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="课程管理"
      width="80%"
      :before-close="handleClose"
    >
    <div>
      <el-table :data="resources" style="width: 100%">
          <el-table-column prop="fileName" label="文件名" />
          <el-table-column label="操作">
              <template #default="scope">
                  <el-button type="primary" size="mini" @click="downloadFile(scope.row.file)">下载</el-button>
              </template>
          </el-table-column>
      </el-table>


    </div>
    </el-dialog>



  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
export default {
    name: "StudentResource",
    setup() {
      const dialogVisible = ref(false)

      const handleClose = (done) => {
        ElMessageBox.confirm('确定关闭对话框')
          .then(() => {
            done()
          })
          .catch(() => {
            // catch error
          })
      }
      return {
        dialogVisible,
        handleClose,
      }
  },
    created() {
        this.userInfo = this.$store.getters.getUser
        this.init()
    },
    data() {
        return {
            userInfo: "",
            courses: [],
            courseId: "",
            resources: [],
        }
    },
    methods: {
        // 1, 获取所有课程
        init() {
            const classId = this.userInfo.classId
            this.$axios.get("/course/getAll?classId=" + classId).then(res => {
                const data = res.data
                if (data.code == 200) {
                console.log(data)
                this.courses = data.data
                } else {
                console.log("数据获取失败")
                }

            })
        },
        gotoCourse(id) {
            console.log(id)
            this.courseId = id
            this.getResource()
            this.dialogVisible = true
        },
        downloadFile(file) {
           window.open(this.$downLoad  + file, '_blank')
       },
       getResource() {
         this.$axios.get("/resource/getAll?courseId=" + this.courseId).then(res => {
                const data = res.data
                if (data.code == 200) {
                    this.resources = data.data
                } else {
                    ElMessage.error('获取资源列表失败', {duration: 3 * 1000})
                }
            })
       }
    },
}
</script>

<style scoped>

.el-row {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap
}
.el-col {
  border-radius: 4px;
  align-items: stretch;
  margin-bottom: 40px;
}
.el-card {
  min-width: 100%;
  height: 100%;
  margin-right: 20px;
  /*transition: all .5s;*/
}
.el-card:hover{
  margin-top: -5px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.item {
  margin-bottom: 10px;
}

.item_tag{
  float:left;
  text-align:left;
}

.text {
  width: 100%;
  font-size: 12px;
  font-family: "Microsoft YaHei";
  color: #909399;
}

.image {
  width: 100%;
  display: block;
  height: 150px;
}

.btn {
  width: 100%;
  background-color: cyan;
}
</style>