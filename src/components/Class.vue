<template>
  <div>
    <h2>我的课程</h2>
    <el-divider></el-divider>

    <el-row :gutter="20" class="el-row" type="flex" >
      <el-col :span="4" v-for = "(item,index) in courses" v-model="courses" :key="index" class="el-col" >
        <el-card class="el-card" :key="index" onclick="">
           <div slot="header" class="clearfix">
            <el-tooltip placement="top" :content="'课程描述: ' + item.description">
              <span>{{item.title}}</span>
            </el-tooltip>
          </div>
          <img :src="$downLoad + item.img"  class="image"/>
          <el-divider></el-divider>
          <div >
            <div class="text item">
             <el-button type="primary" class="btn" @click="gotoCourse(item.id)">进入课程</el-button>
            </div>
          </div>  
          
        </el-card>
      </el-col>  
    </el-row>

    <!-- 对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="课程管理"
      width="80%"
      :before-close="handleClose"
  >
    <div>
      <commit-work :courseId = "courseId" v-model="courseId"></commit-work>
    </div>
    </el-dialog>
  </div>

</template>

<script>
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import CommitWork from './class/CommitWork'

export default {

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


  components: {
    CommitWork,
  },
  name: "Class",
  created() {
    // 1, 初始化数据
    this.userInfo = this.$store.getters.getUser
    this.init()

  },

  methods: {
    // 1, 获取所有课程
    init() {
      const classId = this.userInfo.classId
      this.$axios.get("/course/getAll?classId=" + classId).then(res => {
        const data = res.data
        if (data.code == 200) {
          this.courses = data.data
        } else {
          ElMessage.error("请选择时间", {duration: 3 * 1000})
        }

      })
    },

    gotoCourse(id) {
      this.dialogVisible = true
      this.courseId = id
    }

  },
  data() {
    return {
      userInfo: "",
      courses: [],
      courseId: "",

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
  height: 220px;
}

.btn {
  width: 100%;
  color: #fff;
  background-color: #337ab7;
  border-color: #2e6da4;
}
</style>