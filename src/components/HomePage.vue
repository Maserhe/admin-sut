<template>
    <div>
      <teacher-home  v-if=" userInfo.type === 1 " ></teacher-home>
      <stu-home  v-if=" userInfo.type === 2 "></stu-home>
    </div>
</template>

<script>
import StuHome from './home/StuHome.vue'
import TeacherHome from './home/TeacherHome.vue'

export default {
    components: {
      StuHome,
      TeacherHome,
    },
    name: "HomePage",
    created() {
      this.userInfo = this.userInfo = this.$store.getters.getUser
    },
    data() {
      return {
        userInfo: "",
      }
  },
}
</script>

<style>

</style>