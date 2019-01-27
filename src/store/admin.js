const state = {
  admin: null,
  selectedUser: null,
};
const getters = {
  getAdmin(state) {
    return state.admin;
  },
  getSelectedUser(state) {
    return state.selectedUser;
  },
};

const mutations = {
  setAdmin(state, payload) {
    state.admin = payload;
  },
  removeAdmin(state) {
    state.admin = null;
  },
  setSelectedUser(state, payload) {
    state.selectedUser = payload;
  },
};

const actions = {
  setAdmin({ commit }, payload) {
    commit('setAdmin', payload);
  },
  removeAdmin({ commit }) {
    commit('removeAdmin');
  },
  setSelectedUser({ commit }, payload) {
    commit('setSelectedUser', payload);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
