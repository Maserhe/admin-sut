<template>
  <div>
      <h2>资源管理</h2>
    <el-divider></el-divider>

    <el-row :gutter="20" class="el-row" type="flex" >
      <el-col :span="8" v-for = "(item,index) in courses" v-model="courses" :key="index" class="el-col" >
        <el-card class="el-card" :key="index" onclick="">

          <img :src="$downLoad + item.img"  class="image"/>

          <div slot="header" class="clearfix">
            
            <p>{{item.grade}}级{{item.major}}</p>
            <el-tooltip placement="top" :content="'课程描述: ' + item.description">
              <span>{{item.title}}</span>
            </el-tooltip>
          </div>

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
      title="资源管理"
      width="80%"
      :before-close="handleClose"
  >
    <div>
      <upload-resource :courseId="courseId" v-model="courseId"></upload-resource>
    </div>
    </el-dialog>


  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import UploadResource from './UploadResource.vue'

export default {
  name: "TeacherResource",

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
    UploadResource,
  },
  
  created() {
    // 1, 初始化数据
    this.userInfo = this.$store.getters.getUser
    this.init()
  },

  methods: {
    // 1, 获取所有课程
    init() {
      
      this.$axios.get("/course/getCourses?teacherId=" + this.userInfo.id).then(res => {
        const data = res.data
        if (data.code == 200) {
          this.courses = data.data
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
  height: 150px;
}

.btn {
  width: 100%;
  background-color: cyan;
}

</style>