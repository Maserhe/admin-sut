<template>

    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">sut作业管理系统</div>
            <el-form  ref="login" label-width="50px" class="ms-content">

                <el-form-item prop="username" label="账号">
                    
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>

                </el-form-item>
                <el-form-item prop="password" label="密码">

                    <el-input type="password" placeholder="password" v-model="ruleForm.password"></el-input>
                </el-form-item>
                
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>


            </el-form>
        </div>
    </div>
</template>

<script>


export default {


  data() {
    const checkPass = (rule, value, callback) => {
      
      if (!value) {
        return callback(new Error('请输入密码'))
      }
    }

    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      }
    }

    return {
      ruleForm: {
        username: '',
        password: '',
      },

      rules: {
        username: [{ validator: validateUsername, trigger: 'blur' }],
        password: [{ validator: checkPass, trigger: 'blur' }],
      },
    }
  },


  methods: {
    submitForm() {
      this.$router.push("/home")

    },
    
    resetForm(formName) {
      this.$refs[formName].resetFields()
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

.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>