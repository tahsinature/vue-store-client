<template>
  <div class="product-preview container" @click="gotoDetails()">
    <div class="product-preview__left">
      <img
        class="product-preview__left--img"
        :src="(product.images[0]) ? product.images[0].url : 'https://www.shopgro.in/img/no-image.png'"
        alt
      >
      <!-- https://www.shopgro.in/img/no-image.png -->
    </div>
    <div class="product-preview__right">
      <h3>{{product.title}}</h3>
      <p>{{product.price}}</p>
      <p>{{product.description}}</p>
    </div>
  </div>
</template>

<script>
/* eslint no-underscore-dangle: 0 */
export default {
  props: ['product'],
  methods: {
    gotoDetails() {
      this.$router.push(`products/${this.product._id}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.product-preview {
  display: flex;
  align-items: center;
  &__left {
    padding: 5px;
    border: 1px solid rgba(167, 167, 167, 0.26);
    &--img {
      width: 200px;
      height: 150px;
      object-fit: cover;
    }
  }
  &__right {
    background: rgba(255, 0, 0, 0.185);
    padding: 0 1rem;
  }
}
</style>
