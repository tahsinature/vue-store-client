<template>
  <div class="backdrop-cart" @click="isShown = false" :class="{'backdrop-cart-show': isShown}">
    <div class="cart" :class="{'show-cart': isShown}" @click.stop>
      <div class="container">
        <h2 class="text-center">Items in your Bag</h2>
        <hr>
        <div class="cart-products">
          <app-cart v-for="item in getCartItems" :key="item._id" :item="item"></app-cart>
        </div>
        <div class="cart-content">
          <div class="non-empty" v-if="getCartItems.length > 0">
            <hr>
            <div class="cart-calculation text-right">
              <p>Bag subtotal: ${{totalCartPrice.toFixed(2)}}</p>
              <p class="text-danger">Free Shipping: 0.00</p>
              <p class="text-primary">Estimated Tax: 0.00</p>
              <hr>
              <h2>Total ${{totalCartPrice.toFixed(2)}}</h2>
            </div>
            <hr>
            <div class="checkout">
              <button class="btn btn-primary">Checkout</button>
            </div>
          </div>
          <div class="empty" v-else>
            <h3 class="mb-4">Cart is empty</h3>
            <img src="https://freelor.com/images/cart-empty.png" alt>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import eventBus from '../main';
import CartProductVue from './CartProduct.vue';

export default {
  data() {
    return {
      isShown: false,
      backdrop: false,
    };
  },
  components: {
    'app-cart': CartProductVue,
  },
  computed: {
    ...mapGetters(['getCartItems', 'totalCartPrice']),
  },
  created() {
    eventBus.$on('onShowCart', () => {
      this.isShown = !this.isShown;
    });
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/sass/main.scss";
.backdrop-cart {
  background: $backdrop-bg;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
  transition: visibility 0.2s, opacity 0.2s;
  z-index: 90;
}
.backdrop-cart-show {
  opacity: 1;
  visibility: visible;
}
.cart {
  padding-top: 5rem; //For Top Header
  transform: translateX(100%);
  transition: transform 0.2s;
  background-color: #eee;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  .cart-products {
    max-height: 50vh;
    overflow-y: scroll;
  }
  .cart-calculation {
    width: 70%;
    margin-left: auto;
    p {
      font-weight: bold;
    }
  }
  .checkout {
    text-align: right;
  }
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  // height: 100vh;
  // background: pink;
  img {
    width: 100%;
  }
}
.show-cart {
  transform: translateX(0);
}
</style>
