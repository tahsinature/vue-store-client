import Vue from 'vue';
import Vuex from 'vuex';
import products from './products';
import cart from './cart';
import admin from './admin';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
  },
  getters: {
    token(state) {
      return state.token;
    },
    // isAuthenticated(state) {
    // }
  },
  mutations: {},
  actions: {},
  modules: {
    products,
    cart,
    admin,
  },
});
