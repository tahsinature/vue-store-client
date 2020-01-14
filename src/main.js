import Vue from "vue";
import VueResource from "vue-resource";
import firebase from "firebase/app";
import VeeValidate from "vee-validate";
import VueFlashMessage from "vue-flash-message";
import Notifications from "vue-notification";
import velocity from "velocity-animate";
import VModal from "vue-js-modal";
import Loading from "vue-loading-overlay";
import VueLazyload from "vue-lazyload";
import VueChatScroll from "vue-chat-scroll";
import Container from "./Container.vue";
import router from "./router";
import store from "./store/store";
import "vue-loading-overlay/dist/vue-loading.css";
import { authController } from "./api";

Vue.prototype.$http = require("axios");

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(VueFlashMessage);
Vue.use(Notifications, { velocity });
Vue.use(VeeValidate);
Vue.use(Loading);
Vue.use(VueLazyload, {
  loading: "https://i.gifer.com/8REG.gif",
  error: "https://png.pngtree.com/svg/20170821/_failed_to_load_pictures_372158.png",
  attempt: 10
});
Vue.use(VueChatScroll);
Vue.use(VModal, { dynamic: true });
Vue.use(require("vue-moment"));

export default new Vue({
  data: {
    isAppLoading: true,
    profile: {
      role: undefined
    }
  }
});

Vue.component("app-loading", Loading);

const app = new Vue({
  router,
  store,
  data: { isAppLoading: true },
  render: h => h(Container),
  created() {
    const config = {
      apiKey: "AIzaSyAc7Syc0NYwXDb25d1-OSbCXqSkuWIfG5M",
      authDomain: "vue-store-tahsin.firebaseapp.com",
      databaseURL: "https://vue-store-tahsin.firebaseio.com",
      projectId: "vue-store-tahsin",
      storageBucket: "gs://vue-store-tahsin.appspot.com/",
      messagingSenderId: "909938365359"
    };
    firebase.initializeApp(config);
  }
}).$mount("#app");

const token = localStorage.getItem("token");
authController
  .authenticateUser(token)
  .then(async ({ data }) => {
    await store.dispatch("makeIsLoggedInTrue");
    await store.dispatch("setAdmin", data);
    app.$data.isAppLoading = false;
  })
  .catch(() => {
    app.$data.isAppLoading = false;
  });
