<template>
  <div class="ms-content">
    <my-header></my-header>
    <div>
        <el-row :gutter="20" v-bind:style="{ margin: '50px' }"> 
        <el-col :span="12" :offset="6">
            <el-card>
              <router-view></router-view>
            </el-card>
        </el-col>
        </el-row>
    </div>
    
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '../components/Header.vue'

export default {
  name: 'Home',
  components: {
    "MyHeader": Header,

  }
}
</script>
<style scoped>
.ms-content {
  width: 100%;
  height: 100%;
  background-image: url('../assets/intro-bg.jpeg');
  background-size: 100% 100%;
}

</style>
