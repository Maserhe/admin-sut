<template>
  
  <div>
    <teacher-resource v-if=" userInfo.type === 1 "></teacher-resource>
    <student-resource v-if=" userInfo.type === 2 "></student-resource>
  </div>

</template>

<script>
import StudentResource from './resource/StudentResource.vue'
import TeacherResource from './resource/TeacherResource.vue'

export default {

  components: {
    StudentResource,
    TeacherResource,
  },
  name: "Resource",
  data() {
    return {
      userInfo: "",
      courses: [],
      courseId: "",
    }
  },
  created() {
    this.userInfo = this.$store.getters.getUser
  },
  
}
</script>

<style>

</style>