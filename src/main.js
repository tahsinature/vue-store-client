import Vue from 'vue';
import VueResource from 'vue-resource';
import VeeValidate from 'vee-validate';
import VueFlashMessage from 'vue-flash-message';
import App from './App.vue';
import router from './router';
import store from './store/store';

Vue.prototype.$http = require('axios');

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(VueFlashMessage);
Vue.use(VeeValidate);
Vue.use(require('vue-moment'));

export default new Vue({
  data: {
    isLoggedIn: false,
    url: {
      root: 'http://localhost:3000/',
      productsUrl: 'http://localhost:3000/products',
      authUrl: 'http://localhost:3000/auth',
    },
  },
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
