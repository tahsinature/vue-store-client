<template>
  <div>
    <app-product-preview v-for="product in products" :key="product._id" :product="product"></app-product-preview>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ProductPreviewVue from '../components/ProductTile.vue';

export default {
  components: {
    'app-product-preview': ProductPreviewVue,
  },
  computed: {
    ...mapGetters(['products']),
  },
};
</script>

<style>
</style>
