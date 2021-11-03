<template>
  <el-menu
    :default-active="activeIndex"
    mode="horizontal"
    class="my-el-menu"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"

    @select="handleSelect"
  >
        <el-menu-item index="1">
        <el-icon color="red"><icon-menu /></el-icon>
        <span>首页</span>
        </el-menu-item>
        <el-menu-item index="2">
            <el-icon><set-up /></el-icon>    
            <span>课程</span> 
        </el-menu-item>

        <el-menu-item index="3">
            <el-icon><download /></el-icon>
            <span>资源</span>
        </el-menu-item>

        <el-sub-menu index="4">
        <template #title>
            <el-icon><user-filled /></el-icon>
            <span>个人中心</span>  
        </template>
        <el-menu-item index="4-1">
            
            <span>个人信息</span> 
        </el-menu-item>
        <el-menu-item index="4-2">修改密码</el-menu-item>
        <el-menu-item index="4-3"  @click="logout()">退出登陆</el-menu-item>
        </el-sub-menu>
    
  </el-menu>




</template>

<script>
import { ref } from 'vue'
import {
  Menu as IconMenu,
  UserFilled,
  SetUp,
  Download,
} from '@element-plus/icons'

export default {
    name: "Header",

    setup() {
        const activeIndex = ref('1')
        const handleSelect = (key, keyPath) => {
            console.log(key, keyPath)
        }

        return {
            activeIndex,
            handleSelect,
        }
  },
  methods: {

      logout() {
          console.log("dafasdfa")
          this.$router.push("/login")
      }
  },
  components: {
      IconMenu,
      UserFilled,
      SetUp,
      Download,
  }

}
</script>

<style scoped>
.my-el-menu {
    text-align: center;
}


</style>