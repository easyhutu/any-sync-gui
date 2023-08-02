<template>
  <div id="app">
    <HomeComponent></HomeComponent>
  </div>
</template>

<script>
import HomeComponent from './components/home.vue'
export default {
  name: 'App',
  components: {
    HomeComponent,

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
