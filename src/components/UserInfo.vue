<template>
  <div>

    <el-row :gutter="20">
    <el-col :span="9" :offset="6">
      <el-avatar :size="200" :src="'userInfo.avatar'!== ''? userInfo.avatar :circleUrl" class="ms-head"></el-avatar>
    </el-col>
    </el-row>
    
    <el-row v-bind:style="{ margin: '20px' }"> </el-row>

    <el-descriptions title="个人信息" :column="2" border>


      <el-descriptions-item
        label="姓名"
        label-align="center"
        align="center"
        label-class-name="my-label"
        class-name="my-content"
        width="150px"
        > {{ userInfo.name }} </el-descriptions-item
      >

      <el-descriptions-item label="账号" label-align="center" align="center"
        > {{ userInfo.username }} </el-descriptions-item
      >

      <el-descriptions-item label="位置" label-align="center" align="center"
        >沈阳</el-descriptions-item
      >

      <el-descriptions-item label="标签" label-align="center" align="center">
        <el-tag size="small"> {{ userInfo.type == 1? "老师": "学生" }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="地址" label-align="center" align="center"
        >沈阳工业大学</el-descriptions-item
      >

      <el-descriptions-item v-if="userInfo.type !== 1 " label="专业" label-align="center" align="center"
        >{{ userInfo.major + userInfo.classNumber + "班"  }}</el-descriptions-item
      >

      <el-descriptions-item v-if="userInfo.type !== 1 " label="年级" label-align="center" align="center"
        >{{ userInfo.grade }}</el-descriptions-item
      >

    </el-descriptions>
  
  </div>  
</template>


<script>
export default {
    name: "UserInfo",
  
    created() {
      // 取出数据
      this.userInfo = this.$store.getters.getUser


    },

    data() {
      return {
        circleUrl:'https://ghproxy.com/https://github.com/Maserhe/PIc-Bed/blob/master/typora/202110271336023.jpg',
        userInfo: {},
      }
    },

    
}
</script>

<style scoped>

.ms-head {
  margin-left: 41%;
}

</style>>
