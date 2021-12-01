<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部" name="first">
        
      
        <el-table :data="getData.slice((currentPage-1)* pagesize, currentPage* pagesize)">
            <el-table-column type="index" >    
            </el-table-column>
            <el-table-column label="年级" prop="grade" >    
            </el-table-column>
            <el-table-column label="专业" prop="major" >    
            </el-table-column>
            <!-- <el-table-column label="班级" prop="classNumber" >    
            </el-table-column> -->
            <el-table-column label="作业名" prop="taskName" >    
            </el-table-column>
            <el-table-column label="作者" prop="author" >    
            </el-table-column>

            <el-table-column label="分数" prop="finalScore">     
            </el-table-column> 

            <el-table-column label="加权得分" prop="average">     
            </el-table-column> 

            <el-table-column label="操作" width="180">
                <template #header>
                  <el-input v-model="search" size="mini" placeholder="输入班级、年级、专业、作业名、作者等搜索" />
                </template>
                <template #default="scope">
                    <el-button type="primary" size="mini" @click="lookUp(scope.row)">查看</el-button>
                    <el-button type="primary" size="mini" @click="rateScore(scope.row.id)" >打分</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 40]" 
            :page-size="pagesize"         
            layout="total, sizes, prev, pager, next, jumper"
            :total="getData.length">    
        </el-pagination>


      </el-tab-pane>
      <el-tab-pane label="筛选" name="second">
        <div>
          
         <label slot="lable"> 专业: &nbsp; &nbsp; </label>
          <el-select v-model="gradeOption" placeholder="Select" @change="changeGrade" >
            <el-option v-for="(item, index) in getGrade" :key="index" :label="item" :value="item"> </el-option>
          </el-select>

         <label slot="lable"> &nbsp; &nbsp;课程:&nbsp; &nbsp; </label>
          <el-select v-model="courseOption" placeholder="Select" @change="changeCourse" >
            <el-option v-for="(item, index) in comCourseList" :key="index" :label="item.title" :value="item.id"> </el-option>
          </el-select>

         <label slot="lable"> &nbsp; &nbsp;作业:&nbsp; &nbsp; </label>
        
        <el-select v-model="taskOption" placeholder="选择作业"  @change="changeTask">
        <el-option v-for="(item, index) in taskList" :key="index" :label="item.taskName" :value="item.id">
        </el-option>

        </el-select>


        <!-- 表格 -->
          <el-table :data="getAllTask.slice((currentPage-1)* pagesize, currentPage* pagesize)">
            <el-table-column type="index" >    
            </el-table-column>
            <el-table-column label="年级" prop="grade" >    
            </el-table-column>
            <el-table-column label="专业" prop="major" >    
            </el-table-column>
            <!-- <el-table-column label="班级" prop="classNumber" >    
            </el-table-column> -->
            <el-table-column label="作业名" prop="taskName" >    
            </el-table-column>
            <el-table-column label="作者" prop="author" >    
            </el-table-column>

            <el-table-column label="分数" prop="finalScore">     
            </el-table-column> 

            <el-table-column label="加权得分" prop="average">     
            </el-table-column> 

            <el-table-column label="操作" width="180">
                <template #header>
                  <el-input v-model="search" size="mini" placeholder="输入班级、年级、专业、作业名、作者等搜索" />
                </template>
                <template #default="scope">
                    <el-button type="primary" size="mini" @click="lookUp(scope.row)">查看</el-button>
                    <el-button type="primary" size="mini" @click="rateScore(scope.row.id)" >打分</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 40]" 
            :page-size="pagesize"         
            layout="total, sizes, prev, pager, next, jumper"
            :total="getAllTask.length">    
        </el-pagination>

        </div>
        

      </el-tab-pane>

    </el-tabs>


    <!-- 弹出窗口 -->
    <el-dialog v-model="dialogVisible" title="上机报告" width="50%" :before-close="handleClose">

      <el-button type="primary" @click="downloadFile">下载报告</el-button>
      <el-button type="primary" @click="seeDescription">作业要求</el-button>

      <el-button type="primary" @click="seeScore">打分详情</el-button>

      <el-divider></el-divider>
      <label slot="lable"> 开始时间：{{ startTime }} &nbsp;&nbsp;&nbsp; 截止时间: {{ stopTime }}  &nbsp;&nbsp;&nbsp; 打分权限:{{ scorePermission }} &nbsp;&nbsp;&nbsp; 老师打分权重 {{ weight }} </label>
      <el-divider></el-divider>
      <div class="demo-image__lazy"> 
        <el-image v-for="(url, index) in urls" :key="index" :src="$downLoad + url" lazy ></el-image>
      </div>
    </el-dialog>

    <!-- 打分窗口 -->
    <el-dialog v-model="rateVisible" title="评分" width="30%" :before-close="handleClose">

      <div style="text-align: center">
        <el-rate v-model="score" :max="10" :show-score=true text-color="#ff9900"></el-rate>
      </div>
      
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="rateVisible = false">取消</el-button>
        <el-button type="primary" @click=scoring>确定</el-button>

      </span>
    </template>
    </el-dialog>

    <el-dialog v-model="seeScoreVisible" title="打分详情" width="40%" :before-close="handleClose">
      <div>
        <el-table :data="taskGradeVoList" style="width: 100%">
          <el-table-column prop="author" label="打分人" />
          <el-table-column prop="score" label="分数" />
        </el-table>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
    name: "TeacherHome",
    data() {
      return {
        activeName: "first",
        currentPage: 1,
        pagesize: 10,
        allList: [], 
        allTaskList: [],
        taskSearch: "",
        search: "",
        userInfo: "",

        // 图片
        urls: [],
        file: "",
        description: "",
        startTime: "",
        stopTime: "",
        scorePermission: "",
        taskGradeVoList: [],
        weight: 0.0,

        // 打分
        score: 0,
        homeworkId: "",

        // 筛选
        courseList: [],
        courseOption: "选择课程",
      
        taskList: [],
        taskOption: "选择作业",


        courseId: "",
        taskId: "",

        grade: "",
        gradeOption: "选择年级",

      }
    },
    setup() {
      const dialogVisible = ref(false)
      const rateVisible = ref(false)
      const seeScoreVisible = ref(false)

      const handleClose = (done) => {
        ElMessageBox.confirm('确定关闭对话框?')
          .then(() => {
            done()
          })
          .catch(() => {
            // catch error
          })
      }
      return {
        dialogVisible,
        rateVisible,
        handleClose,
        seeScoreVisible,
      }
    },

    created() {
      // 1, 初始化数据
      this.userInfo = this.$store.getters.getUser
      this.initFirstList()

    },
    methods: {
      
      // 1, 根据tab 刷新页面
      handleClick(tab) {
        if (tab.props.name == 'first') {
          this.initFirstList()
        } else {
          this.getCourseList()
        }
      },

      // 2, 初始化首页列表
      initFirstList() {
        this.$axios.post("/homework/getByTeacherIdList?teacherId=" + this.userInfo.id).then(res => {
          const data = res.data
          if (data.code == 200) {
            this.allList = data.data
            
          }
        })
      },

      // 查看作业描述
      seeDescription() {
        ElMessageBox.alert(this.description, '作业描述', {
            confirmButtonText: 'OK',
        })
      },

      // 查看打分详情
      seeScore() {
        this.seeScoreVisible = true
      },

      handleSizeChange: function (size) {
        this.pagesize = size;
        console.log(this.pagesize)
      },
      handleCurrentChange: function(currentPage){
        this.currentPage = currentPage;
        console.log(this.currentPage) 
      },
      handleUserList() {
        
      },

      // 查看 作业
      lookUp(val) {
        console.log(val)
        this.dialogVisible = true
        this.urls = val.imgs
        this.file = val.taskFile
        this.description = val.description
        this.startTime = val.startTime
        this.stopTime = val.stopTime
        this.scorePermission = val.scorePermission == 1? true: false 
        this.taskGradeVoList = val.taskGradeVoList
        this.weight = val.weight
      },

      downloadFile() {
          window.open(this.$downLoad  + this.file, '_blank')
      },

      // 打分， 记录作业id
      rateScore(val) {
        this.rateVisible = true
        this.homeworkId = val

      },

      // 评分
      scoring() {
        this.rateVisible = false
        // 发起评分请求
        if (this.scoreNow == null || this.scoreNow == "") {  
          this.$axios.post("/homework/mark?homeworkId="+ this.homeworkId + "&score=" + this.score).then(res =>{
            const data = res.data
            if (data.code == 200) {
              ElMessage.success('打分成功', {duration: 3 * 1000})
              this.score = 0
              this.initFirstList()
            } 
          })
        }
      },

      // 筛选  课程列表
      getCourseList() {
        this.$axios.get("/course/getCourses?teacherId=" + this.userInfo.id).then(res => {
          const data = res.data
          if (data.code == 200) {
            this.courseList = data.data
          } else {
            console.log("数据获取失败")
          }
        })
      },

      // 根据班级 获取 作业列表
      getTaskList() {
        this.$axios.get("/course-task/getAll?courseId=" + this.courseId).then(res => {
          const data = res.data
          if (data.code == 200) {
            this.taskList = data.data
          } else {
            console.log("数据获取失败")
          }
        })
      },

      changeGrade(val) {
        this.grade = val
        console.log(this.grade)
      },

      changeCourse(val) {

        if (val == undefined || val == null || val == '') {
            ElMessage.error('请选择课程', {duration: 3 * 1000})
          } else {
            // 设置课程 id 获取 task 列表
            this.courseId = val
            this.getTaskList()
          }
      },

      changeTask(val) {

        if (val == undefined || val == null || val == '') {
            ElMessage.error('请选择作业', {duration: 3 * 1000})
            return false
          } else {
            this.taskId = val
            this.getByTaskId()
        }
      },

      getByTaskId() {
        this.$axios.post("/homework/getByTaskId?taskId="+ this.taskId).then(res => {
          const data = res.data
          if (data.code == 200) {
            this.allTaskList = data.data
            ElMessage.success('获取数据成功', {duration: 3 * 1000})
          }
        })
      },




    },

    computed: {
      // 返回搜索回去的结果
      getData() {
          return this.allList.filter( (data) => ! this.search 
            || data.taskName.toLowerCase().includes(this.search.toLowerCase())  
            || data.author.toLowerCase().includes(this.search.toLowerCase())  
            || String(data.grade + data.major ).includes(this.search.toLowerCase())
          )
      },

      getAllTask() {
        return this.allTaskList.filter( (data) => ! this.taskSearch 
            || data.taskName.toLowerCase().includes(this.taskSearch.toLowerCase())  
            || data.author.toLowerCase().includes(this.taskSearch.toLowerCase())  
            || String(data.grade + data.major ).includes(this.taskSearch.toLowerCase())
          )
      },

      getGrade() {
        return Array.from(new Set(this.courseList.map((data) => data.grade + data.major)))
      },

      comCourseList() {
        return this.courseList.filter( (data) => String(data.grade + data.major) == this.grade)
      }


    }

    
}
</script>

<style  scoped>

.el-image {
    display: block;
    min-height: 200px;
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }

</style>