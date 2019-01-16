/* eslint no-shadow: ["error", { "allow": ["state"] }] */

const state = {
  products: [],
};

const getters = {
  numOfItemInCart(state) {
    return state.products.length;
  },
  getCartItems(state) {
    return state.products;
  },
  totalCartPrice(state) {
    return state.products.reduce((pre, cur) => pre + cur.totalPrice(), 0);
  },
};

const mutations = {
  addNew(state, payload) {
    let newItem = state.products.find(product => product._id === payload.target._id);
    if (newItem) {
      newItem.quantity += payload.quantity;
      return;
    }
    class NewItem {
      constructor(rawItem) {
        this._id = rawItem._id;
        this.title = rawItem.title;
        this.price = rawItem.price;
        this.quantity = payload.quantity;
      }

      totalPrice() {
        return this.quantity * this.price;
      }
    }
    newItem = new NewItem(payload.target);
    state.products.unshift(newItem);
  },
  removeItem(state, payload) {
    /* eslint no-underscore-dangle: 0 */
    const item = state.products.find(product => product._id === payload);
    state.products.splice(state.products.indexOf(item), 1);
  },
};

const actions = {
  addToCart({ commit }, payload) {
    commit('addNew', payload);
  },
  removeFromCart({ commit }, id) {
    commit('removeItem', id);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
