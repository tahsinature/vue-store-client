import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App.vue';
import router from './router';
import store from './store/store';

Vue.config.productionTip = false;
Vue.use(VueResource);

export default {
  data: {
    url: {
      root: 'http://localhost:3000/',
      // postsUrl: 'http://localhost:3000/posts',
    },
  },
};

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
