<template>
  <div>

    <el-tabs type="card" @tab-click="handleClick">
    <el-tab-pane label="班级管理">
        <class-set-up></class-set-up>

    
    
    </el-tab-pane>
    <el-tab-pane label="课程管理">
        课程管理
        
    </el-tab-pane>
    <el-tab-pane label="学生管理">
        学生管理
        
    </el-tab-pane>
    <el-tab-pane label="作业管理">
        作业管理
    
    </el-tab-pane>
    </el-tabs>


  </div>
</template>

<script>
import ClassSetUp from './setup/ClassSetUp.vue'


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
            location.reload()
            console.log("重新加载")
        },

    },
    components: {
        ClassSetUp,
    }
}
</script>

<style>

</style>