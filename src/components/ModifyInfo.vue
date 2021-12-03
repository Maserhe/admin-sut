<template>
  <div style="text-align: center">
    <h3>修改信息</h3>
    <el-divider></el-divider>

      <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClick">
        <el-tab-pane label="修改头像" name="first">
          
          <div style="text-align: center">
              <el-upload
                :action="upLoadFile"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
            >
              <img v-if="imgs_url" :src="imgs_url" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
            </el-upload>

            <el-button type="primary" @click="changAvator">修改</el-button>
            <el-button @click="resetAvator">重置</el-button>
          </div>

        </el-tab-pane>
        <el-tab-pane label="修改密码" name="second">
          <el-form
                  ref="pass"
                  :model="pass"
                  label-width="120px"
                  style="width: 600px"
              >
              <el-form-item label="老密码" prop="oldPass" :rules="[ { required: true, message: '老密码必须填写' },]" >
                <el-input v-model.trim="pass.oldPass" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item label="新密码" prop="newPass1" :rules="[ { required: true, message: '新密码必须填写' },]">
                <el-input v-model.trim="pass.newPass1" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item label="新密码" prop="newPass2" :rules="[ { required: true, message: '新密码必须填写,两次输入必须一致' },]">
                <el-input v-model.trim="pass.newPass2" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="submitForm('pass')">修改密码</el-button>
                <el-button @click="resetForm('pass')">重置</el-button>
              </el-form-item>

            </el-form>

        </el-tab-pane>
      </el-tabs>

  </div>



</template>

<script>
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons'
export default {
  
    components: {
      Plus,
    },
    name: "ModifyInfo",  
    data() {
      return {
        activeName: "first",
        imgs_url: "",
        imgsName: "",

        pass: {
          oldPass: "",
          newPass1: "",
          newPass2: "",
        },

        userInfo: "",

      }
    },

    created() {
      this.userInfo = this.$store.getters.getUser
    },
    methods: {
      handleClick(tab) {
        if (tab.props.name == "first") {
          this.imgs_url = ""
          this.imgsName = ""
        } else {
          this.pass = {
            oldPass: "",
            newPass1: "",
            newPass2: "",
          }
        }
      },
      handleAvatarSuccess(res) {
        // 处理上传图标
        if (res.code === 200) {
            this.imgs_url = this.$downLoad + res.data.fileName
            this.imgsName = res.data.fileName
            ElMessage.success("图片上传成功", {duration: 3 * 1000})
        } else {
            ElMessage.error('图片上传失败', {duration: 3 * 1000})
        }
      },

      // 更改头像
      changAvator() {

        if (this.imgsName != "" || this.imgsName != null || this.imgsName != undefined) {
          
          this.$axios.post("/user/changeAvatar?id=" + this.userInfo.id + "&avatar=" + this.imgsName).then(res => {
            const data = res.data
            if (data.code == 200) {
              ElMessage.success("头像更新成功, 重新登陆看效果", {duration: 3 * 1000})
              this.imgs_url = ""
              this.imgsName = ""
            } else {
              ElMessage.error("头像更新失败", {duration: 3 * 1000})
            }
          })
        }


      },

      // 更改密码
      changePassword() {
        // 判断输入不能为空
        if (this.pass.newPass1 != this.pass.newPass2) {
          ElMessage.error("两次输入密码不一致", {duration: 3 * 1000})
          return false
        } else {
          this.$axios.post("/user/changePass?id=" + this.userInfo.id + "&oldPass=" + this.pass.oldPass + "&newPass=" + this.pass.newPass1).then(res => {
            const data = res.data
            if (data.code == 200) {
              ElMessage.success("更新密码成功", {duration: 3 * 1000})
              this.resetForm('pass')
            } else {
              ElMessage.error("更新密码错误", {duration: 3 * 1000})
            }
          })
        }
      },


      resetAvator() {
        this.imgs_url = ""
        this.imgsName = ""
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
              this.changePassword()
            } else {
                return false
            }
        })
      },

      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
    },

    computed: {
        
        upLoadFile() {
            return this.$updLoad
        }
    }



}
</script>

<style scoped>


.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  border-style: dotted;
  margin: 25px;
}
.avatar-uploader-icon svg {
  margin: 74px; /* (178px - 28px) / 2 - 1px */
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>