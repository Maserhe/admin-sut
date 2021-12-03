<template>
  <div >
    <el-select v-model="option" placeholder="Select" @change="changeItem">
        <el-option
        v-for="(item, index) in options"
            :key="index"
            :label="item.value"
            :value="item.id"
        >

        </el-option>
    </el-select>
    <label slot="lable">&nbsp;&nbsp;&nbsp; </label>
    <el-button type="primary" size="small" @click="addCouseBtn()">添加课程</el-button>

    <el-dialog
        v-model="dialogVisible"
        title="添加课程"
        width="40%"
        :before-close="handleClose"
    >
        <el-form
            ref="courseInfo"
            :model="courseInfo"
            label-width="100px"
        >
            <el-form-item label="课程名称" prop="title"
                :rules="[
                    { required: true, message: '名称必须填写,例如 计算机网络' },
                ]"
            >
            <el-input v-model.number="courseInfo.title" autocomplete="off"></el-input>
            </el-form-item>
            
            <el-form-item label="图片上传" prop="url">
            <el-upload
                :action="upLoadFile"   
                list-type="picture-card"   
                :file-list="fileArr"    
                :limit="1"    
                :on-success="handleAvatarSuccess"    
                >
                <el-icon><upload /></el-icon>
            
            </el-upload>
            <div slot="tip" class="el-upload__tip">限制上传一张, 只能上传jpg/png文件，且不超过500kb</div>

            </el-form-item>

            <el-form-item label="课程介绍" prop="description"
                :rules="[
                    { required: true, message: '课程必须填写,例如 这是什么什么课。。' },
                ]"
            >
            <el-input v-model.number="courseInfo.description" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" @click="addCourse('courseInfo')">添加</el-button>

            <el-button @click="resetForm('courseInfo')">重置</el-button>
            </el-form-item>
        </el-form>
        

    </el-dialog>


    <el-table :data="tableData.filter((data) => !search || data.title.toLowerCase().includes(search.toLowerCase()) || data.description.toLowerCase().includes(search.toLowerCase()))" 
        style="width: 100%">
        <el-table-column prop="title" label="课程名"  />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="teacherName" label="教师名" />
        
        <el-table-column align="right" >

            <template #header>
                    <el-input v-model="search"  size="mini" placeholder="输入课程标题或者课程介绍" />
            </template>

            <template #default="scope">
                <!-- <el-button type="danger"  size="mini" @click="handleClick(scope.row.id)">删除</el-button> -->
                <el-popconfirm title="确定要删除该课程?" @confirm="handleClick(scope.row.id)">
                    <template #reference>
                        <el-button size="mini" type="danger">删除</el-button>
                    </template>
                </el-popconfirm>
                <el-button type="primary"  size="mini" @click="courseClick(scope.row.id)">管理</el-button>
            </template>

        </el-table-column>        
    </el-table>


    <!-- 课程管理对话框 -->
    <el-dialog
        v-model="courseVisible"
        title="课程管理"
        width="60%"
        :before-close="handleClose"
    >
        <create-task :courseId="courseId" v-model="courseId"></create-task>


    </el-dialog>


  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload } from '@element-plus/icons'
import CreateTask from '../course/CreateTask'

export default {
    name: "CourseSetUp",

    setup() {
        const dialogVisible = ref(false)
        const courseVisible = ref(false)
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
            handleClose,
            courseVisible,
        }
    },

    created() {
      // 1, 初始化班级列表
      this.$axios.get("/stu-class/getAllFormatClass").then(res => {
          
          const data = res.data
          if (data.code == 200) {
            this.options = data.data
          } else {
             ElMessage.error('获取所有班级失败', {duration: 3 * 1000})
          }
      })
    },


    data() {
        return {
            courseId: "",

            options: [],
            search: '',
            option: '选择班级',
            tableData: [],
            icon_url: "", // 添加课程的图片

            courseInfo: {
                title: "",
                img: "",
                description: "",
                classId: "",
                teacherId: "",
            },
        }
    },

    methods: {


        resetForm(formName) {
            this.$refs[formName].resetFields()
        },

        addCouseBtn() {
            const id = this.courseInfo.classId
            if (id == undefined || id == null || id == "" ) {
                ElMessage.error('请先选择班级', {duration: 3 * 1000})
            } else {
                this.dialogVisible = true
            }
        },

        getCourseList(val) {
            this.$axios.get("/course/getAll?classId=" + val).then(res => {
                const data = res.data
                if (data.code == 200) {
                    this.tableData = data.data
                    ElMessage.success("获取课程成功", {duration: 3 * 1000})
                } else {
                    ElMessage.error('获取班级失败', {duration: 3 * 1000})
                }
            })
        },

        changeItem(val) {

          this.courseInfo.classId = val

          if (val == undefined || val == null || val == '') {
            ElMessage.success('请选择班级', {duration: 3 * 1000})
          } else {
            this.getCourseList(val)
          }
        },
        handleClick(id) {
            // 删除课程
            this.$axios.post("/course/delete?courseId=" + id).then(res => {
                const data = res.data
                if (data.code == 200 && data.data == true) {
                    ElMessage.success("删除课程成功", {duration: 3 * 1000})
                    const classId = this.courseInfo.classId
                    if (classId != null ) {
                        // 重新获取课程列表
                        this.getCourseList(classId)
                    }

                }else {
                    ElMessage.error('删除课程失败', {duration: 3 * 1000})
                }

            })
        },

        handleAvatarSuccess(res) {
            // 处理上传图标
            if (res.code === 200) {
                this.icon_url = this.$downLoad + res.data.fileName
                this.courseInfo.img = res.data.fileName
                ElMessage.success("图片上传成功", {duration: 3 * 1000})
            } else {
                ElMessage.error('图片上传失败', {duration: 3 * 1000})
            }
       },

       // 添加课程
       addCourse(formName) {
           this.$refs[formName].validate((valid) => {
                
                if (valid) {

                    const userinfo = this.$store.getters.getUser
                    this.courseInfo.teacherId = userinfo.id
                    
                    this.$axios.post("/course/add", this.courseInfo).then(res => {
                        const data = res.data
                        if (data.code == 200 && data.data == true) {
                            ElMessage.success("添加课程成功", {duration: 3 * 1000})
                            const classId = this.courseInfo.classId
                            if (classId != null ) {
                                // 重新获取课程列表
                                this.getCourseList(classId)
                                this.resetForm('courseInfo')
                            }
                        }else {
                            ElMessage.error('添加课程失败', {duration: 3 * 1000})
                        }

                    })
                    this.dialogVisible = false
                } else {
                    return false
                }
            })
       },

       courseClick(id) {
           this.courseVisible = true
           this.courseId = id
       }

    },
    computed: {
        
        fileArr() {
            // 上传图片 显示默认图片
            return this.icon_url ? [{ url: this.icon_url }] : []
        },

        upLoadFile() {
            return this.$updLoad
        }
    },

    components: {
        Upload,
        CreateTask,
    }

}
</script>

<style>

</style>