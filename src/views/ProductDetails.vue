<template>
  <div class="container product-details mt-4" v-if="product">
    <div class="product-details__top">
      <div class="product-details__top__image text-center">
        <app-image-slider :images="product.image"></app-image-slider>
        <p class="mt-2">({{product.image.length}} {{product.image.length > 1 ? "images" : "image"}})</p>
      </div>
      <div class="product-details__top__content">
        <h1 class="text-center">{{product.title}}</h1>
        <small class="text-muted">Posted on: 2 Jan 2018</small>
        <div class="like-box">
          <i class="fas fa-heart"></i>
          <p>{{product.likes}} Likes</p>
        </div>
        <a class="mr-3">{{product.reviews.length}} Reviews</a>
        <a>Add Your Review</a>
        <div class="product-details__top__content--price">
          <h1>${{Number(product.price).toFixed(2)}}</h1>
          <div>
            <p>IN STOCK</p>
            <p>SKU#: 23-WBK92</p>
          </div>
        </div>
        <div class="action-non-admin" v-if="!isAdmin">
          <div class="input-group add-to-cart">
            <input
              type="number"
              class="form-control text-center"
              placeholder="Quantity"
              aria-describedby="button-addon2"
              v-model.number="addToCartQty"
            >
            <div class="input-group-append">
              <button
                class="btn btn-success"
                type="button"
                id="button-addon2"
                @click="addToCart()"
              >Add To Cart</button>
            </div>
          </div>
          <button class="btn btn-primary contact">
            <i class="fas fa-phone"></i> +628... (Click To Show)
          </button>
        </div>
        <div class="controller" v-else>
          <button class="btn btn-outline-info" @click="editProduct()">
            <i class="fas fa-edit"></i>
            Edit Product
          </button>
          <button class="btn btn-danger" @click="removeProduct()">
            <i class="fas fa-trash-alt"></i>
            Remove Product
          </button>
        </div>
      </div>
    </div>

    <div class="product-details__bottom">
      <div class="card text-center">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item" @click="mode = 'description'">
              <a class="nav-link" :class="{active: mode === 'description'}">Description</a>
            </li>
            <li class="nav-item" @click="mode = 'review'">
              <a
                class="nav-link"
                :class="{active: mode === 'review'}"
              >Reviews ({{product.reviews.length}})</a>
            </li>
          </ul>
        </div>
        <div class="card-body">
          <div class="card-body__review" v-if="mode === 'review'">
            <div class="comments">
              <app-comment v-for="(review, index) in product.reviews" :review="review" :key="index"></app-comment>
            </div>
          </div>
          <div class="card-body__description" v-else>
            <p class="text-left">{{product.description}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- temp -->
    <div class="text-center mt-5">
      <button class="btn btn-primary" @click="isAdmin = !isAdmin">Role Switcher</button>
    </div>
  </div>
</template>

<script>
/* eslint no-underscore-dangle: 0 */
import { mapGetters } from 'vuex';
import eventBus from '../main';
import ProductDetailsImageVue from '../components/ProductDetailsImage.vue';
import CommentVue from '../components/Comment.vue';

export default {
  components: {
    'app-image-slider': ProductDetailsImageVue,
    'app-comment': CommentVue,
  },
  data() {
    return {
      product: null,
      mode: 'description',
      addToCartQty: 1,
      isAdmin: false,
    };
  },
  methods: {
    editProduct() {
      console.log(this.product);
    },
    async removeProduct() {
      const response = await this.$http.delete(
        `${eventBus.url.productsUrl}/${this.product._id}`,
      );
      if (response.status) {
        this.$store.dispatch('removeProduct', this.product._id);
        this.$router.push('/');
      }
    },
    addToCart() {
      this.$store.dispatch('addToCart', {
        quantity: this.addToCartQty,
        target: this.product,
      });
      this.addToCartQty = 1;
    },
  },
  computed: {
    ...mapGetters(['products']),
  },
  created() {
    const product = this.products.find(
      allProduct => allProduct._id === this.$route.params.id,
    );
    if (!product) {
      this.$http
        .get(`${eventBus.url.productsUrl}/${this.$route.params.id}`)
        .then((response) => {
          if (response.status === 200) this.product = response.data;
        });
    } else this.product = product;
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/sass/_media.scss";
.product-details {
  .product-details__top {
    display: grid;
    align-items: center;
    grid-template-columns: 500px 1fr;
    @include respond(df, tab-l) {
      grid-template-columns: minmax(50%, 1fr) 1fr;
    }
    @include respond(df, tab-p) {
      grid-template-columns: minmax(50%, 1fr);
    }
    &__image {
      border-radius: 10px;
      overflow: hidden;
      margin-right: 2rem;
      @include respond(df, tab-p) {
        margin-right: 0;
      }
    }
    &__content {
      @include respond(df, mbl) {
        padding: 0 3rem;
      }
      @include respond(df, tab-p) {
        margin-top: 2rem;
      }
      h1 {
        font-size: 2rem;
        font-weight: 300;
      }
      .like-box {
        display: flex;
        align-items: center;
        i {
          color: red;
          font-size: 1.2rem;
          margin-right: 0.3rem;
          cursor: pointer;
          transition: all 0.2s;
          &:hover {
            transform: scale(1.2);
          }
        }
      }
      .action-non-admin {
        text-align: center;
        .btn.contact {
          margin-bottom: 1rem;
        }
        .add-to-cart {
          width: 70%;
          margin: 1rem auto;
        }
      }
      .controller {
        margin: 1rem auto;
        text-align: center;
        button {
          margin-bottom: 0.5rem;
        }
        button:first-of-type {
          margin-right: 1rem;
        }
      }
      &--price {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(167, 167, 167, 0.541);
        padding: 0.5rem 0;
        h1 {
          font-weight: bold;
        }
      }
    }
  }
  .product-details__bottom {
    margin-top: 2rem;
  }
}
.card-header-tabs {
  li {
    cursor: pointer;
  }
}
</style>
