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
            <el-button type="primary" @click="submitForm('stuClass')">添加</el-button>

            <el-button @click="resetForm('stuClass')">重置</el-button>
            </el-form-item>

    </el-form>
        </el-tab-pane>
        <el-tab-pane label="导入学生">
            添加学生
            
        </el-tab-pane>
        
        <el-tab-pane label="Task">
            Task
        
        </el-tab-pane>
    </el-tabs>






    
  </div>


</template>

<script>
import { ElMessage } from 'element-plus'
export default {
    name: "ClassSetUp",

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

    },
}
</script>

<style>

</style>