<template>

    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">sut作业管理系统</div>
            <el-form  ref="ruleForm" :rules="rules" class="ms-content" :model="ruleForm">

                <el-form-item label="账号" prop="username">
                  <el-input v-model="ruleForm.username"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                  <el-input type="password" v-model="ruleForm.password"></el-input>
                </el-form-item>

                  <el-button type="primary" @click="submitForm('ruleForm')" class="ms-btn">登录</el-button>
                  <el-button type="primary" @click="resetForm('ruleForm')" class="ms-btn">重置</el-button>
                       
            </el-form>
        </div>
    </div>
</template>

<script>


export default {

  name: "Login",
  data() {

    return {
      ruleForm: {
        username: '',
        password: '',
      },

      rules: {
         username: [
            { required: true, message: '请输入学号', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' }
          ]
      },
    }
  },


  methods: {
    
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    submitForm(formName) {
        this.$refs[formName].validate((valid) => {

          if (valid) {
            const _this = this

             this.$axios.post('/login', this.ruleForm).then(res => {

              //console.log(res.data)

              const jwt = res.headers['authorization']
              const userInfo = res.data.data
              // 把数据共享出去
              _this.$store.commit("SET_TOKEN", jwt)
              _this.$store.commit("SET_USERINFO", userInfo)
              // 获取
              // console.log(_this.$store.getters.getUser)
              _this.$router.push("/home/homePage")
            })
           
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },


  },
}

</script>

<style scoped>

.login-wrap {
    width: 100%;
    height: 100%;
    background-image: url('../assets/login-bg.jpeg');
    background-size: 100% 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #409eff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.ms-btn {
  margin-left: 50px;
}

</style>