import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/global.css'
import tinymce from 'tinymce'

import VueTinymce from '@packy-tang/vue-tinymce'
// import './utils/request'
Vue.config.productionTip = false
Vue.prototype.$tinymce = tinymce // 将全局tinymce对象指向给Vue作用域下

Vue.use(VueTinymce) // 安装vue的tinymce组件

Vue.use(ElementUI)
new Vue({
 
  router,
  render: h => h(App)
}).$mount('#app')
