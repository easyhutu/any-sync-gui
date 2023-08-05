
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import vueResource from 'vue-resource'
import vueSimpleUploader  from 'vue-simple-uploader'
import VueRouter from "vue-router";
import router from "@/router";

Vue.use(vueResource)
Vue.use(vueSimpleUploader)
Vue.use(VueRouter)

Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
