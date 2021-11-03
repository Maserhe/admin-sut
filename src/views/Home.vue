<template>
  <div class="home">
    <my-header></my-header>
    
    

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
