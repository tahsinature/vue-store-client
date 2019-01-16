/* eslint no-underscore-dangle: 0 */
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

const state = {
  products: [],
};

const getters = {
  products(state) {
    return state.products;
  },
};

const mutations = {
  getAllProductsFromServer(state, payload) {
    state.products = payload;
  },
  removeProduct(state, payload) {
    const item = state.products.find(product => product._id === payload);
    state.products.splice(state.products.indexOf(item), 1);
  },
};

const actions = {
  getAllProductsFromServer({ commit }, payload) {
    commit('getAllProductsFromServer', payload);
  },
  removeProduct({ commit }, payload) {
    commit('removeProduct', payload);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
