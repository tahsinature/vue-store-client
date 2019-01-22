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
  addNewProduct(state, payload) {
    state.products.unshift(payload);
  },
  removeProduct(state, payload) {
    const item = state.products.find(product => product._id === payload);
    state.products.splice(state.products.indexOf(item), 1);
  },
  editProduct(state, payload) {
    // state.products.find(element => )
    console.log(payload);
  },
};

const actions = {
  getAllProductsFromServer({ commit }, payload) {
    commit('getAllProductsFromServer', payload);
  },
  addNewProduct({ commit }, payload) {
    commit('addNewProduct', payload);
  },
  removeProduct({ commit }, payload) {
    commit('removeProduct', payload);
  },
  editProduct({ commit }, payload) {
    commit('editProduct', payload);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
