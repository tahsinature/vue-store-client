import Vue from 'vue';
import VueResource from 'vue-resource';
import VeeValidate from 'vee-validate';
import VueFlashMessage from 'vue-flash-message';
import Notifications from 'vue-notification';
import velocity from 'velocity-animate';
import VModal from 'vue-js-modal';
import Loading from 'vue-loading-overlay';
import App from './App.vue';
import router from './router';
import store from './store/store';
import 'vue-loading-overlay/dist/vue-loading.css';

Vue.prototype.$http = require('axios');

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(VueFlashMessage);
Vue.use(Notifications, { velocity });
Vue.use(VeeValidate);
Vue.use(Loading);
Vue.use(VModal, { dynamic: true });
Vue.use(require('vue-moment'));

// Vue.use(VModal, { dialog: true });

export default new Vue({
  data: {
    isLoggedIn: false,
    profile: {
      role: undefined,
    },
    url: {
      root: 'http://localhost:3000/',
      productsUrl: 'http://localhost:3000/products',
      authUrl: 'http://localhost:3000/auth',
    },
  },
});

Vue.component('app-loading', Loading);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
