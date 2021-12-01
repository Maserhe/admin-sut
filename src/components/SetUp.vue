<template>
  <div>

    <el-tabs type="card" @tab-click="handleClick">
    <el-tab-pane label="班级管理">
        <class-set-up></class-set-up>
    </el-tab-pane>
    
    <el-tab-pane label="课程管理">
        <course-set-up></course-set-up>
    </el-tab-pane>

    <el-tab-pane label="学生管理">
        <stu-set-up></stu-set-up>
    </el-tab-pane>

    </el-tabs>


  </div>
</template>

<script>
import ClassSetUp from './setup/ClassSetUp.vue'
import CourseSetUp from './setup/CourseSetUp.vue'
import StuSetUp from './setup/StuSetUp.vue'

export default {
    name: "SetUp",

    data() {
        return {
            activeName: 'first',

        }
    },

    methods: {
        handleClick(tab, event) {
            console.log(tab, event)
            console.log("重新加载")
        },

    },
    components: {
        ClassSetUp,
        CourseSetUp,
        StuSetUp,
    }
}
</script>

<style>

</style>