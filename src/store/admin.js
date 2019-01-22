/* eslint-disable no-shadow */
const state = {
  user: null,
};
const getters = {
  getAdmin(state) {
    return state.user;
  },
};

const mutations = {
  setAdmin(state, payload) {
    state.user = payload;
  },
  removeAdmin(state) {
    state.user = null;
  },
};

const actions = {
  setAdmin({ commit }, payload) {
    commit('setAdmin', payload);
  },
  removeAdmin({ commit }) {
    commit('removeAdmin');
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
