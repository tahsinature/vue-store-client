import Vue from 'vue';
import VueResource from 'vue-resource';
import VeeValidate from 'vee-validate';
import VueFlashMessage from 'vue-flash-message';
import Notifications from 'vue-notification';
import velocity from 'velocity-animate';
import VModal from 'vue-js-modal';
import Loading from 'vue-loading-overlay';
import VueLazyload from 'vue-lazyload';
import VueChatScroll from 'vue-chat-scroll';
import App from './App.vue';
import router from './router';
import store from './store/store';
import 'vue-loading-overlay/dist/vue-loading.css';
import { authController } from './api';

Vue.prototype.$http = require('axios');

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(VueFlashMessage);
Vue.use(Notifications, { velocity });
Vue.use(VeeValidate);
Vue.use(Loading);
Vue.use(VueLazyload, { loading: 'https://i.gifer.com/8REG.gif', error: 'https://png.pngtree.com/svg/20170821/_failed_to_load_pictures_372158.png', attempt: 10 });
Vue.use(VueChatScroll);
Vue.use(VModal, { dynamic: true });
Vue.use(require('vue-moment'));


export default new Vue({
  data: {
    isLoggedIn: false,
    profile: {
      role: undefined,
    },
  },
});

Vue.component('app-loading', Loading);

function renderVue() {
  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
}

const token = localStorage.getItem('token');
authController.authenticateUser(token).then(({ data, status }) => {
  if (status === 200) {
    store.dispatch('makeIsLoggedInTrue');
    store.dispatch('setAdmin', data);
    renderVue();
  } else {
    renderVue();
  }
}).catch(() => {
  renderVue();
});
