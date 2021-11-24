<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="first">
            <h1>好多作业列表</h1>

        </el-tab-pane>

        <el-tab-pane label="未打分" name="second">
            <h1>可以打分的列表</h1>
        
        </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
export default {
    name: "StuHome",
    data() {
    return {
      activeName: 'first',
    }
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event)
        },
    },

}
</script>

<style>

</style>