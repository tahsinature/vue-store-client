<template>
  <div class="product-preview" @click="gotoDetails()">
    <div class="product-preview__left">
      <img
        class="product-preview__left--img"
        :src="(product.images[0]) ? product.images[0].url : 'https://www.shopgro.in/img/no-image.png'"
        alt
      >
    </div>
    <div class="product-preview__right">
      <div class="product-preview__right__details">
        <p class="title">{{product.title}}</p>
        <p class="location text-muted">{{product.location}} - {{product.category}}</p>
        <p class="price">{{product.price}}</p>
      </div>
      <div class="product-preview__right__time">
        <small class="text-muted">{{product.createdAt | moment("from", "now")}}</small>
      </div>
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
@import "../assets/sass/main";
.product-preview {
  display: flex;
  align-items: center;
  height: 120px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.267);
  padding: 0.5rem 0;

  &__left {
    height: 100%;
    padding: 5px;
    border: 1px solid rgba(167, 167, 167, 0.295);
    &--img {
      width: 150px;
      height: 100%;
      object-fit: cover;
      cursor: pointer;
    }
  }
  &__right {
    // background: rgba(255, 0, 0, 0.185);
    padding: 0.2rem 1rem 0.2rem 1.5rem;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 1rem;
    &__details {
      .title {
        margin-bottom: 0.5rem;
        font-weight: bold;
        color: #0074ba;
        cursor: pointer;
        &:hover {
          color: #00547e;
        }
      }
      .location {
        font-size: 0.9rem;
      }
      .price {
        font-size: 0.9rem;
        font-weight: bold;
      }
    }
    &__time {
      align-self: flex-end;
    }
  }
}
</style>
