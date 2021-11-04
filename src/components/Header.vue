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
    @select="handleSelect"
  >

      <el-menu-item index="/home/homePage" class="ms-item">

      <el-icon color="red"><icon-menu /></el-icon>
      <span>首页</span>

      </el-menu-item>

      <el-menu-item index="/home/Class">
          <el-icon><set-up /></el-icon>    
          <span>课程</span> 
      </el-menu-item>

      <el-menu-item index="/home/resource">
          <el-icon><download /></el-icon>
          <span>资源</span>
      </el-menu-item>


      <el-sub-menu index="/home/userinfo" class="ms-head">
      <template #title>
          <el-icon>
            <el-image
              :src="user.avatar"
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
import { ref } from 'vue'
import {
  Menu as IconMenu,
  SetUp,
  Download,
} from '@element-plus/icons'

export default {
  name: "Header",
  data() {
    return {
      user: {
        id: -1,
        username: '学生',
        avatar: 'https://ghproxy.com/https://github.com/Maserhe/PIc-Bed/blob/master/typora/202110271336023.jpg',
        type: 0,
      }

    }
  },
  setup() {
      const activeIndex = ref('/home/homePage')
      const handleSelect = (key, keyPath) => {
          console.log(key, keyPath)
      }

      return {
          activeIndex,
          handleSelect,
      }
  },
  
  beforeCreate() {

  },

  created() {
    
    this.init().then(() => {
      this.id = this.$store.getters.getUser.id
      this.username = this.$store.getters.getUser.username
      this.avatar = this.$store.getters.getUser.avatar
      this.type = this.$store.getters.getUser.type
    })

  
  },



  methods: {

    async init() {
      const token = localStorage.getItem('token')
      console.log(this.$isEmpty(token))

      if (this.$isEmpty(token)) {
        this.$router.push('/login')
      } 

      const userinfo = this.$store.getters.getUser
      if (this.$isEmpty(userinfo)) {
        // 根据凭证获取用户信息
        await this.$axios.get("/getUserInfo", {
          params:{            
            "token": token,
          }
        }).then(res => {
          //获取你需要用到的数据
          // 把数据共享出去
          if (res.data.code == 401 ) {
            // 登陆凭证失效
            // 删除信息
            this.$store.commit("REMOVE_INFO")
            this.$router.push('/login')
          }

          this.$store.commit("SET_TOKEN", token)
          this.$store.commit("SET_USERINFO", res.data.data)

        });
      }
    },

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
  },
  computed: {

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


