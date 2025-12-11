import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';

Vue.use(ElementUI);
Vue.config.productionTip = false


axios.defaults.baseURL = 'https://tips.cvvv.online/api'
axios.defaults.timeout = 5000

Vue.prototype.$http = axios

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
