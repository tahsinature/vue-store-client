import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App.vue';
import router from './router';
import store from './store/store';

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(require('vue-moment'));

export default new Vue({
  data: {
    // isNavActive: false,
    url: {
      root: 'http://localhost:3000/',
      productsUrl: 'http://localhost:3000/products',
    },
  },
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
