<template>
  <div>
    <h1>我的课程</h1>
    <el-divider></el-divider>

    <el-row :gutter="20" class="el-row" type="flex" >
      <el-col :span="8" v-for = "(item,index) in courses" v-model="courses" :key="index" class="el-col" >
        <el-card class="el-card" :key="index" onclick="">
          <div slot="header" class="clearfix">
            <span>{{item.title}}</span>
          </div>

          <div >
            <div class="text item">

              <div>
                 <!-- <img
                  src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                  class="image"
                /> -->
              </div>

              <div class="item_tag" >
                <span>课程描述</span>
              </div>

              <div class="item_desr">
                <span > {{item.description}}</span>
              </div>

            </div>
          </div>  
        </el-card>
      </el-col>  
    </el-row>

  </div>

</template>

<script>
export default {
    components: {

    },
    name: "Class",
    created() {
      // 1, 初始化数据
      this.userInfo = this.$store.getters.getUser
      this.init()

    },

    methods: {
      // 1, 获取所有课程
      init() {
        const classId = this.userInfo.classId
        this.$axios.get("/course/getAll?classId=" + classId).then(res => {
          const data = res.data
          if (data.code == 200) {
            console.log(data)
            this.courses = data.data
          } else {
            console.log("数据获取失败")
          }

        })

      }

    },
    data() {
      return {
        userInfo: "",
        msg: "123",
        apps: [
          {tag: '123', appname: '123'},
          {tag: '123', appname: '456'},
          {tag: '123', appname: '123'},
          {tag: '123', appname: '456'},
          {tag: '123', appname: '123'},
          {tag: '123', appname: '456'},
          {tag: '123', appname: '123'},
          {tag: '123', appname: '456'},
        ],
        courses: []
      }
    },


}
</script>

<style scoped>

.el-row {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap
}
.el-col {
  border-radius: 4px;
  align-items: stretch;
  margin-bottom: 40px;
}
.el-card {
  min-width: 100%;
  height: 100%;
  margin-right: 20px;
  /*transition: all .5s;*/
}
.el-card:hover{
  margin-top: -5px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.item {
  margin-bottom: 10px;
}

.item_tag{
  float:left;
  text-align:left;
}

.text {
  width: 100%;
  font-size: 12px;
  font-family: "Microsoft YaHei";
  color: #909399;
}
 

</style>