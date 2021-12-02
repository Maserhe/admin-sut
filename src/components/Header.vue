<template>

  <div >
    <el-menu
    :default-active="activeIndex"
    mode="horizontal"
    class="ms-el-menu"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    
  >

      <el-menu-item index="/home/homePage" class="ms-item">

      <el-icon color="red"><icon-menu /></el-icon>
      <span>首页</span>

      </el-menu-item>

      <el-menu-item index="/home/Class"  v-if="isStudent">
          <el-icon><set-up /></el-icon>    
          <span>课程</span> 
      </el-menu-item>

      <el-menu-item index="/home/resource">
          <el-icon><download /></el-icon>
          <span>资源</span>
      </el-menu-item>

      <el-menu-item index="/home/setup" v-if="isTeacher">
          <el-icon><setting /></el-icon>
          <span>管理</span>
      </el-menu-item>


      <el-sub-menu index="/home/userinfo" class="ms-head">
      <template #title>
          <el-icon>
            <el-image
              :src="getAvator"
              class="ms-img"
            ></el-image>
          </el-icon>
          <span>个人中心</span>  
      </template>
      
      <el-menu-item index="/home/userinfo">
          <span>个人信息</span> 
      </el-menu-item>

      <el-menu-item index="/home/modifyinfo">修改密码</el-menu-item>

      <el-menu-item index="/login"  @click="logout()">退出登陆</el-menu-item>
      </el-sub-menu>

  </el-menu>

  </div>


</template>

<script>
import { getCurrentInstance, ref } from 'vue'

import {
  Menu as IconMenu,
  SetUp,
  Download,
  Setting,
} from '@element-plus/icons'

export default {
  name: "Header",
  data() {
    return {
      userInfo: {},

    }
  },
  setup() {

      const activeIndex = ref('/home/homePage')
      //  初始化数据
      const token = localStorage.getItem('token')
      const instance = getCurrentInstance().appContext.config.globalProperties;
      
      
      if (instance.$isEmpty(token)) {
        instance.$router.push('/login')
        return false
      } 

      const userinfo = instance.$store.getters.getUser

      if (instance.$isEmpty(userinfo)) {
        // 根据凭证获取用户信息
        instance.$axios.get("/getUserInfo", {
          params:{            
            "token": token,
          }
        }).then(res => {
          //获取你需要用到的数据
          // 把数据共享出去
          if (res.data.code == 400 ) {
            // 登陆凭证失效, 删除信息
            instance.$store.commit("REMOVE_INFO")
            instance.$router.push('/login')
            return false
          }
          instance.$store.commit("SET_TOKEN", token)
          instance.$store.commit("SET_USERINFO", res.data.data)
          instance.$router.push('/home/homePage')
        });
      }

      return {
          activeIndex,
      }
  },
  
  beforeCreate() {

  },

  created() {
    this.userInfo = this.$store.getters.getUser
  },



  methods: {

    logout() {
      const _this = this
      _this.$axios.get("/logout", {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      }).then(res => {
        console.log(res)
        _this.$store.commit("REMOVE_INFO")
        _this.$router.push("/login")
      })
    },

    
  },
  components: {
      IconMenu,
      SetUp,
      Download,
      Setting,
  },
  computed: {

    getAvator() {
      return this.$downLoad +  this.userInfo.avatar
    },

    isTeacher() {
      return this.userInfo.type === 1
    },

    isStudent() {
      return this.userInfo.type === 2
    }

  }

}
</script>

<style scoped>
.ms-item {
  margin-left: 40%;
}
.ms-head {
  margin-left: auto;
}
.ms-img{
  border-radius: 50%;
}


</style>


