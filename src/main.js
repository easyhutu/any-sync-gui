import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import vueResource from 'vue-resource'
import vueSimpleUploader  from 'vue-simple-uploader'

Vue.use(vueResource)
Vue.use(vueSimpleUploader)

Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')
