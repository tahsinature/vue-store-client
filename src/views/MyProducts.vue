<template>
  <div class="container">
    <h1>My Products</h1>
    <hr>
    <div class="card-deck">
      <app-card></app-card>
      <app-card></app-card>
      <app-card></app-card>
      <app-card></app-card>
    </div>
  </div>
</template>

<script>
import eventBus from '../main';
import MyProductsCardVue from '../components/MyProductsCard.vue';

export default {
  data() {
    return {
      products: [],
    };
  },
  components: {
    'app-card': MyProductsCardVue,
  },
  created() {
    console.log(this.$store.getters.getAdmin);
  },
  beforeRouteEnter(to, from, next) {
    if (eventBus.isLoggedIn) {
      next();
    } else {
      next('/login');
    }
  },
};
</script>

<style lang="scss" scoped>
.card-deck {
  justify-content: space-around;
}
</style>
