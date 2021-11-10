<template>
  
  <div>

    <el-tabs :tab-position="'left'">
            <el-tab-pane label="查看班级">

            <div>
                <el-table  
                :data="classList.filter((data) => !search || data.major.toLowerCase().includes(search.toLowerCase()) || data.grade.toLowerCase().includes(search.toLowerCase())) "
            style="width: 100%">

                <el-table-column prop="grade" label="年级" />
                <el-table-column prop="major" label="专业" />
                <el-table-column prop="classNumber" label="班号" />

                <el-table-column align="right" >
                    
                    <template #header>
                         <el-input v-model="search"  size="mini" placeholder="输入年级或者班级" />
                    </template>

                    <template #default="scope">
                        <el-button type="danger"  size="mini" @click="handleClick(scope.row.id)">删除</el-button>
                        <el-button type="danger" size="mini" @click="dialogVisible = true">学生管理</el-button>

                        <!-- 对话框 -->
                        <el-dialog
                            v-model="dialogVisible"
                            title="添加学生"
                            width="30%"
                            :before-close="handleClose"
                        >
                            <el-tabs type="border-card">
                                <el-tab-pane label="文件导入">
                                    
                                    <div style="text-align: center"> 
                                    <el-upload
                                        drag
                                        action=""
                                        :http-request="uploadFile"
                                        :data="{ 'id': scope.row.id }"
                                    >
                                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                        <div class="el-upload__text">
                                        拖拽文件到这或者 <em>点击上传</em>
                                        </div>

                                        <template #tip>
                                        <div class="el-upload__tip">
                                            请上传指定格式的csv文件
                                        </div>
                                        </template>
                                    </el-upload>
                                    <el-button type="primary" @click="downloadAttachRow">模版下载</el-button>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="手动添加">
                                    <el-form
                                        ref="stuInfo"
                                        :model="stuInfo"
                                        label-width="100px"
                                    >
                                    <el-form-item label="姓名" prop="name"
                                        :rules="[
                                            { required: true, message: '姓名必须填写,例如 张三' },
                                        ]"
                                    >
                                    <el-input v-model.number="stuInfo.name" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="学号" prop="number"
                                        :rules="[
                                            { required: true, message: '专业必须填写,例如 180405218' },
                                        ]"
                                    >
                                    <el-input v-model.number="stuInfo.number" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="密码" prop="password"
                                        :rules="[
                                            { required: true, message: '密码必须填写,例如 123456' },
                                        ]"
                                    >
                                    <el-input v-model.number="stuInfo.password" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                    <el-button type="primary" @click="addStudent('stuInfo', scope.row.id )">添加</el-button>

                                    <el-button @click="resetForm('stuInfo')">重置</el-button>
                                    </el-form-item>
                                    </el-form>
                                </el-tab-pane>
                            </el-tabs>

                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button @click="dialogVisible = false">取消</el-button>
                                    <el-button type="primary" @click="dialogVisible = false"
                                    >确定</el-button
                                    >
                                </span>
                            </template>
                        </el-dialog>


                    </template>
                </el-table-column>
        
                </el-table>
            </div>
            
        </el-tab-pane>

        <el-tab-pane label="添加班级">
            
            <el-form
                ref="stuClass"
                :model="stuClass"
                label-width="100px"
            >
            <el-form-item label="年级" prop="grade"
                :rules="[
                    { required: true, message: '年级必须填写,例如 2018' },
                ]"
            >
            <el-input v-model.number="stuClass.grade" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="专业" prop="major"
                :rules="[
                    { required: true, message: '专业必须填写,例如 计算机科学与技术' },
                ]"
            >
            <el-input v-model.number="stuClass.major" autocomplete="off"></el-input>
            </el-form-item>


            <el-form-item label="班级" prop="classNumber"
                :rules="[
                    { required: true, message: '班级必须填写,例如 1' },
                    { type: 'number', message: '班级格式填写不对' },
                ]"
            >
            <el-input v-model.number="stuClass.classNumber" autocomplete="off"></el-input>
            </el-form-item>



            <el-form-item>
            <el-button type="primary" @click="submitForm('stuClass', 'scope.row.id')">添加</el-button>

            <el-button @click="resetForm('stuClass')">重置</el-button>
            </el-form-item>

            </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="查看学生">
            <stu-set-up></stu-set-up>
        </el-tab-pane>
        
       

    </el-tabs>

    
  </div>


</template>

<script>
import { ElMessage , ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons'
import StuSetUp from './StuSetUp.vue'

export default {
    name: "ClassSetUp",

    setup() {
        const dialogVisible = ref(false)

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
        }
  },

    created() {
        // 初始化数据 班级数据
        this.init()

    },
    data() {
        return {

            // 课程管理
            stuClass: {
                major: "",
                grade: "",
                classNumber: "",

            },

            stuInfo: {
                name: "",
                number: "",
                password: "",
            },

            classList: [],
            search: '',
            

        }
    },

    methods: {

        init() {
            this.$axios.get("/stu-class/getAll").then(res => {
                this.classList = res.data.data
            });
        },
        
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {

                if (valid) {
                    // 1， 添加班级
                    this.$axios.post("/stu-class/addClass", {

                        "major": this.stuClass.major,
                        "classNumber": this.stuClass.classNumber,
                        "grade": this.stuClass.grade

                    }).then(res => {
                        const data = res.data
                        if (data.code == 200) {
                            ElMessage.success('添加成功', {duration: 3 * 1000})
                            this.stuClass.major = "",
                            this.stuClass.classNumber = "",
                            this.stuClass.grade = ""
                        }

                    })
                    
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },

        resetForm(formName) {
            this.$refs[formName].resetFields()
        },

        handleClick(id) {
            // 1， 先删除班级，
            this.$axios.post("/stu-class/delete?id=" + id).then(res => {
                const data = res.data
                if (data.code == 200) {
                    ElMessage.success('删除成功', {duration: 3 * 1000})
                }
            })
            // 2， 刷新数据
            this.init()
            Location.reload()
        },

        addStudent(formName, classId) {
            this.$refs[formName].validate((valid) => {
                
                // console.log(valid, this.stuInfo.name, this.stuInfo.password, this.stuInfo.number)
                // console.log(classId)

                if (valid) {
                    // 1, 开始添加数据
                    this.$axios.post("/user/addStu", {
                        "username": this.stuInfo.number, // 学号
                        "name": this.stuInfo.name,   // 姓名
                        "password": this.stuInfo.password,
                        "type": 2,
                        "classId": classId,

                    }).then(res => {
                        const data = res.data
                        if (data.code == 200) {
                            ElMessage.success('添加成功', {duration: 3 * 1000})
                            this.stuInfo.number = ""
                            this.stuInfo.name = ""
                            this.stuInfo.password = ""
                        }
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
            
        },
        uploadFile(params) {
            
            let formData = new FormData()
            formData.append("file", params.file)
            formData.append("id", params.data.id)

            this.$axios({
                url: "/user/upload",
                method: 'post',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data'}
            }).then(res=> {
                
                const data = res.data
                if (data.code == 200) {
                    console.log("上传成功")
                    ElMessage.success('添加成功', {duration: 3 * 1000})
                    location.reload()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
            
        },
        /** 下载附件 */
        downloadAttachRow() {
            window.open('http://localhost:8080/downloadFile/file.csv', '_blank')
        }

    },
    components: {
        UploadFilled,
        StuSetUp,
    }
    
}
</script>

<style>

</style>