<template>
  <div class="container product-details mt-4" v-if="product">
    <notifications group="auth" position="bottom right" animation-type="velocity"></notifications>
    <modal name="confirm-delete">
      <modal-delete
        :product="product"
        @onDeleteConfirm="removeProduct()"
        @onDeleteCancel="$modal.hide('confirm-delete');"
      ></modal-delete>
    </modal>
    <div class="product-details__top">
      <div class="product-details__top__image text-center">
        <app-image-slider :images="product.images"></app-image-slider>
        <p>({{product.images.length}} {{product.images.length > 1 ? "images" : "image"}})</p>
      </div>
      <div class="product-details__top__content">
        <h1 class="text-center">{{product.title}}</h1>
        <small class="text-muted">Posted on: 2 Jan 2018</small>
        <br>
        <small class="text-muted">Category: {{product.category}}</small>
        <div class="like-box">
          <button class="btn btn-sm btn-primary mt-2 mb-2" @click="likeProduct()">
            <i v-if="isLiked" class="fas fa-thumbs-up"></i>
            <i v-else class="far fa-thumbs-up"></i>
            {{product.likes}} Likes
          </button>
        </div>
        <div class="review-box" ref="reviewBox">
          <a class="mr-3">{{product.reviews.length}} Reviews</a>
          <a
            @mouseenter="$refs.reviewBox.style.backgroundColor = '#f44336'; $refs.reviewBox.style.borderColor = '#f44336'"
            @mouseleave="$refs.reviewBox.style.backgroundColor = '#00bcd4'; $refs.reviewBox.style.borderColor = '#00bcd4'"
          >Add Your Review</a>
        </div>
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
          <button class="btn btn-danger" @click="$modal.show('confirm-delete')">
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
            <li class="nav-item" @click="mode = 'makeReview'" v-if="!isAdmin">
              <a class="nav-link" :class="{active: mode === 'makeReview'}">Make Review</a>
            </li>
          </ul>
        </div>
        <div class="card-body">
          <div class="card-body__description" v-if="mode === 'description'">
            <p style="white-space:pre-wrap" class="text-left">{{product.description}}</p>
          </div>
          <div class="card-body__review" v-if="mode === 'review'">
            <div class="comments">
              <app-comment v-for="(review, index) in product.reviews" :review="review" :key="index"></app-comment>
            </div>
          </div>
          <div class="card-body__review" v-if="mode === 'makeReview' && !isAdmin">
            <div class="form-group">
              <!-- <input type="text" class="form-control"> -->
              <textarea
                rows="3"
                class="form-control"
                data-gramm_editor="false"
                v-model="reviewText"
              ></textarea>
              <button class="btn btn-outline-secondary btn-block mt-3" @click="makeReview()">Review</button>
            </div>
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
import { productController, reviewController } from '../api';
import ProductDetailsImageVue from '../components/ProductDetailsImage.vue';
import CommentVue from '../components/Comment.vue';
import DeleteConfirmationVue from '../components/modals/DeleteConfirmation.vue';
// import eventBus from '../main';

export default {
  components: {
    'app-image-slider': ProductDetailsImageVue,
    'app-comment': CommentVue,
    'modal-delete': DeleteConfirmationVue,
  },
  data() {
    return {
      product: null,
      mode: 'description',
      addToCartQty: 1,
      isAdmin: false,
      reviewText: '',
      isLiked: false,
    };
  },
  methods: {
    likeProduct() {
      if (this.isAdmin) {
        return this.$emit('onNotify', {
          title: 'Oops, Like on own product 😟',
          text: "Sorry, you can't like your own product",
          type: 'error',
        });
      }
      console.log('Like');
      this.isLiked = true;
    },
    makeReview() {
      const review = {
        productId: this.product._id,
        text: this.reviewText,
      };
      reviewController
        .makeReview(review)
        .then(({ data }) => {
          this.reviewText = '';
          this.product.reviews.push(data);
          this.mode = 'review';
        })
        .catch(({ response }) => {
          console.log(response);
        });
    },
    editProduct() {
      this.$router.push(`/products/${this.product._id}/edit`);
    },
    async removeProduct() {
      productController
        .deleteProduct(this.product._id)
        .then((res) => {
          if (res.status === 200) {
            this.$store.dispatch('removeProduct', this.product._id);
            this.$router.push('/');
          }
        })
        .catch(() => {
          this.$notify({
            group: 'auth',
            type: 'error',
            title: "You're Unauthorized",
            text:
              "Don't try to manupulate the posts that doesn't belong to you.",
          });
        });
    },
    addToCart() {
      this.$store.dispatch('addToCart', {
        quantity: this.addToCartQty,
        target: this.product,
      });
      this.addToCartQty = 1;
    },
    getSelectedProductFromStore() {
      this.product = this.getSelectedProduct;
      this.isAdmin = this.getAdmin._id === this.getSelectedProduct.author;
    },
  },
  computed: {
    ...mapGetters(['getSelectedProduct', 'getAdmin']),
  },
  watch: {
    $route(to, from) {
      this.getSelectedProductFromStore();
    },
  },
  created() {
    this.getSelectedProductFromStore();
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/sass/_media.scss";
.product-details {
  .product-details__top {
    display: grid;
    align-items: center;
    grid-template-columns: 400px 1fr;
    grid-gap: 5rem;
    @include respond(df, tab-l) {
      grid-template-columns: minmax(50%, 1fr) 1fr;
    }
    @include respond(df, tab-p) {
      grid-gap: 0;
      grid-template-columns: minmax(50%, 1fr);
    }
    &__image {
      @include respond(df, tab-p) {
        justify-self: center;
        width: 80%;
      }
      border-radius: 5px;
      overflow: hidden;
      margin-right: 2rem;

      @include respond(df, tab-p) {
        margin-right: 0;
      }
      p {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        font-size: 0.8rem;
        color: rgb(65, 28, 28);
        background: rgba(0, 0, 0, 0.151);
        padding: 0.5rem 0;
      }
    }
    &__content {
      @include respond(df, mbl) {
        padding: 0 3rem;
      }
      @include respond(df, tab-p) {
        margin-top: 2rem;
      }
      @include respond(mf, 1366px) {
        padding: 0 7rem;
      }
      h1 {
        font-family: "Josefin Sans", sans-serif;
        @include respond(df, tab-p) {
          margin-bottom: 1rem;
        }
        font-size: 2rem;
        font-weight: 300;
      }
      .like-box {
        display: flex;
        align-items: center;
        button {
          display: flex;
          align-items: center;
          &:hover i {
            transform: scale(1.2);
          }
        }
        i {
          font-size: 1.2rem;
          margin-right: 0.3rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-right: 0.4rem;
        }
      }
      .review-box {
        background: #00bcd4;
        text-align: center;
        display: flex;
        border: 1px solid #00bcd4;
        border-radius: 5px;
        overflow: hidden;
        margin-top: 0.4rem;
        transition: all 0.3s;
        a {
          padding: 0.2rem 0;
        }
        a:first-of-type {
          background: #e7edee;
          width: 40%;
        }
        a:last-of-type {
          color: #e7edee;
          cursor: pointer;
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
          margin-left: 1rem;
        }
      }
      &--price {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid rgba(167, 167, 167, 0.541);
        border-bottom: 1px solid rgba(167, 167, 167, 0.541);
        padding: 0.5rem 0;
        margin-top: 2rem;
        div {
          font-size: 0.8rem;
          text-align: right;
        }
        h1 {
          font-weight: bold;
          margin: 0;
        }
      }
    }
  }
  .product-details__bottom {
    margin-top: 2rem;
    @include respond(df, tab-p) {
      font-size: 0.9rem;
    }
  }
}
.card-header-tabs {
  @include respond(df, mbl) {
    font-size: 0.8rem;
  }
  li {
    cursor: pointer;
  }
}
</style>
