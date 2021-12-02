<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="first">
            <el-table :data="getData.slice((currentPage-1)* pagesize, currentPage* pagesize)">

              <el-table-column type="index" >    
              </el-table-column>
              <el-table-column label="课程名" prop="title" >    
              </el-table-column>
              <el-table-column label="作业名" prop="taskName" >    
              </el-table-column>
              <el-table-column label="作业描述">
                <template #default="scope">
                      <el-button type="primary"  size="mini" @click="seeDescription(scope.row.description)">查看</el-button>
                </template>
              </el-table-column>

              <el-table-column label="作者" prop="author" >    
              </el-table-column>
              <el-table-column label="分数" prop="score">     
              </el-table-column> 

              <el-table-column label="操作" width="180">
                  <template #header>
                    <el-input v-model="search" size="mini" placeholder="输入课程或者作业名搜索" />
                  </template>
                  <template #default="scope">
                      <el-button type="primary" size="mini" @click="lookUp(scope.row)">查看</el-button>
                      <el-button type="primary" size="mini" @click="rateScore(scope.row.id, scope.row.score)" v-if="scope.row.scorePermission == 1" >打分</el-button>
                      <el-button type="primary" size="mini" disabled v-else >打分</el-button>

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
        <el-tab-pane label="筛选(有权限打分)" name="second">
          <el-select v-model="option" placeholder="Select" @change="changeItem">
            <el-option v-for="(item, index) in options" :key="index" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
          <el-divider></el-divider>
         <!-- table 表格 -->
        

        <el-table :data="getTaskList.slice((currentPage-1)* pagesize, currentPage* pagesize)">

              <el-table-column type="index" >    
              </el-table-column>

              <el-table-column label="作业描述">
                <template #default="scope">
                      <el-button type="primary"  size="mini" @click="seeDescription(scope.row.description)">查看描述</el-button>
                </template>
              </el-table-column>

              <el-table-column label="作业名" prop="taskName" >    
              </el-table-column>
              <el-table-column label="作者" prop="author" >    
              </el-table-column>
              <el-table-column label="分数" prop="score">     
              </el-table-column> 

              <el-table-column label="操作">
                  <template #header>
                    <el-input v-model="taskSearch" size="mini" placeholder="输入课程或者作业名搜索" />
                  </template>
                  <template #default="scope">
                
                      <el-button type="primary" size="mini" @click="lookUp(scope.row)">查看</el-button>
                      <el-button type="primary" size="mini" @click="rateScore(scope.row.id, scope.row.score)">打分</el-button>
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
                :total="getTaskList.length">    
            </el-pagination>

        </el-tab-pane>
    </el-tabs>


    <!-- 弹出窗口 -->
    <el-dialog v-model="dialogVisible" title="上机结果" width="50%" :before-close="handleClose">
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

  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
    name: "StuHome",
    data() {
      return {
        activeName: 'first',
        currentPage: 1,
        pagesize: 10,
        allList: [], 
        search: "",
        userInfo: "",

        // 选择器
        options: [],
        option: '选择课程',
        courseId: "",
        courseTaskList: [],
        taskSearch: "",
        urls: [],

        // 打分
        score: 0,
        homeworkId: "",
        scoreNow: "",

      }
    },
    setup() {
      const dialogVisible = ref(false)
      const rateVisible = ref(false)

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
      }
  },

    created() {
        // 1, 初始化数据
        this.userInfo = this.$store.getters.getUser
        this.init()
        this.getCourseList()
    },


    methods: {

      init() {
        this.$axios.post("/homework/getByClassIdList?classId=" + this.userInfo.classId +"&userId=" + this.userInfo.id).then(res => {
          const data = res.data
          if (data.code == 200) {
            this.allList = data.data
          }
        })
      },

      lookUp(val) {
        // console.log(val)
        this.dialogVisible = true
        this.urls = val.imgs
      },
      // 查看作业描述
      seeDescription(val) {
        ElMessageBox.alert(val, '作业描述', {
            confirmButtonText: 'OK',
        })
      },

      // 获取课程列表
      getCourseList() {
        this.$axios.get("/course/getAll?classId=" + this.userInfo.classId).then(res => {
              const data = res.data
              if (data.code == 200) {
                this.options = data.data
              } 
          })
      },

      getCourseTaskList(val) {

        this.$axios.post("/homework/getByCourseIdList?courseId=" + val +"&userId=" + this.userInfo.id).then(res => {
          const data = res.data
          if (data.code == 200) {
            this.courseTaskList  = data.data
          }
        })
      },

      handleClick() {
        // console.log(tab, event)

      },

      handleSizeChange: function (size) {
        this.pagesize = size;
        // console.log(this.pagesize)
      },

      handleCurrentChange: function(currentPage){
        this.currentPage = currentPage;
        // console.log(this.currentPage) 
      },
      handleUserList() {
        
      },
      
      changeItem(val) {

          this.courseId = val
          if (val == undefined || val == null || val == '') {
            ElMessage.success('请选择课程', {duration: 3 * 1000})
          } else {
            this.getCourseTaskList(val)
          }
      },

      rateScore(val, scoreNow) {
        this.rateVisible = true
        this.homeworkId = val
        this.scoreNow = scoreNow

      },

      // 评分
      scoring() {
        this.rateVisible = false
        // 发起评分请求
        if (this.scoreNow == null || this.scoreNow == "") {
            this.$axios.post("/task-grade/mark", {
              "userId": this.userInfo.id,
              "homeworkId": this.homeworkId,
              "score": this.score
            }).then(res => {
              const data = res.data
              if (data.code == 200) {
                ElMessage.success('评分成功', {duration: 3 * 1000})
                this.init()
                this.getCourseTaskList(this.courseId)
                this.score = 0
              } 
            })
        } else {
          this.$axios.post("/task-grade/updateScore", {
              "userId": this.userInfo.id,
              "homeworkId": this.homeworkId,
              "score": this.score
            }).then(res => {
              const data = res.data
              if (data.code == 200) {
                ElMessage.success('评分成功', {duration: 3 * 1000})
                this.init()
                this.getCourseTaskList(this.courseId)
                this.score = 0
              } 
            })
            this.scoreNow=""
        }
        
      }

    },

    computed: {
      
      // 返回搜索回去的结果
      getData() {
        return this.allList.filter( (data) => ! this.search || data.title.toLowerCase().includes(this.search.toLowerCase()) || data.taskName.toLowerCase().includes(this.search.toLowerCase())  )
      },

      getTaskList() {
        return this.courseTaskList.filter( (data) => ! this.taskSearch || data.author.toLowerCase().includes(this.taskSearch.toLowerCase()) || data.taskName.toLowerCase().includes(this.taskSearch.toLowerCase())  )
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

