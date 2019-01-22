<template>
  <div>
    <app-header></app-header>
    <app-cart></app-cart>
    <div class="content-field">
      <app-nav></app-nav>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HeaderVue from './components/Header.vue';
import CartVue from './components/Cart.vue';
import SideNavVue from './components/SideNav.vue';
import { productController } from './api';

export default {
  components: {
    'app-header': HeaderVue,
    'app-cart': CartVue,
    'app-nav': SideNavVue,
  },
  async created() {
    const result = await productController.getAllProducts();
    if (result.status === 200) {
      const products = result.data;
      this.$store.dispatch('getAllProductsFromServer', products);
      this.$emit('onProductLoad');
    }
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
p {
  margin: 0;
}
</style>

<style lang="scss">
@import "./assets/sass/main.scss";
</style>

<style lang="scss" scoped>
@import "./assets/sass/main.scss";
.content-field {
  @include respond(mf, tab-p) {
    display: grid;
    grid-template-columns: 5rem 1fr; //It depends on mini sidenav width.
  }
}
</style>
