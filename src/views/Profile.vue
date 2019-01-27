<template>
  <div class="profile container">
    <div class="left">
      <div class="img-box">
        <img :src="getSelectedUser.profilePhoto.url" alt>
      </div>
      <div class="recent-posts">
        <div class="heading">
          <small class="text-muted">Recent Posts</small>
          <hr>
        </div>
        <div
          class="recent-posts__post"
          v-for="product in getSelectedUser.products.slice(0,3)"
          :key="product._id"
        >
          <h2>{{product.title}}</h2>
          <span class="badge badge-primary">Available</span>
          <p class="text-muted">Category: {{product.categoty}}</p>
          <p class="text-muted">Posted on: {{product.createdAt | moment("from", "now")}}</p>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="intro">
        <h1>{{getSelectedUser.fullName}}</h1>
        <i class="text-muted fas fa-map-marker-alt"></i>
        <p class="text-muted d-inline-block">{{getSelectedUser.location}}</p>
        <p class="text-primary status">Active Member</p>
        <div class="bio">
          <p>{{getSelectedUser.bio}}</p>
        </div>
      </div>
      <div class="control mt-4">
        <div class="admin-control" v-if="role === 'admin'">
          <div>
            <button class="btn btn-info btn-block">
              <i class="fas fa-users"></i>
              Contacts
            </button>
            <router-link tag="button" class="btn btn-info btn-block" to="/me/edit">
              <i class="fas fa-edit"></i>Edit Profile
            </router-link>
            <!-- <button class="btn btn-info btn-block">
              <i class="fas fa-edit"></i>
              Edit Profile
            </button>-->
          </div>
          <button class="btn-block btn btn-danger mt-2" @click="logout()">
            Logout
            <i class="fas fa-sign-out-alt ml-1"></i>
          </button>
        </div>
        <div class="user-control" v-if="role === 'user'">
          <button class="cta msg">
            <i class="fas fa-comment-alt"></i>
            Send Message
          </button>
          <!-- <button class="cta add-contact">
          <i class="fas fa-user-plus"></i>
          Add Contact
          </button>-->
          <button class="cta is-contact active">
            <i class="fas fa-check"></i>
            Contacts
          </button>
          <button class="cta report text-muted">Report User</button>
        </div>
      </div>
      <div class="details">
        <div class="tab">
          <button :class="{active: mode === 'products'}" @click="mode = 'products'">
            <i class="fas fa-ad"></i>
            Products
          </button>
          <button :class="{active: mode === 'about'}" @click="mode = 'about'">
            <i class="fas fa-user"></i>
            About
          </button>
        </div>
        <!-- ----- -->
        <div v-if="mode === 'products'" class="card-deck">
          <app-card
            v-for="product in getSelectedUser.products"
            :key="product._id"
            :product="product"
          ></app-card>
        </div>
        <div class="field" v-if="mode === 'about'">
          <div class="mt-4">
            <small>Contact Information</small>
            <div class="details-row">
              <p>Username</p>
              <p class="text-primary">{{getSelectedUser.userName}}</p>
            </div>
            <div class="details-row">
              <p>E-mail</p>
              <p class="text-primary">{{getSelectedUser.email}}</p>
            </div>
            <div class="details-row">
              <p>Phone</p>
              <p class="text-primary">{{getSelectedUser.contactNo}}</p>
            </div>
            <div class="details-row">
              <p>Address</p>
              <p>535 E 68th Street New York
                <br>NY 1952- 293 23949
              </p>
            </div>
          </div>

          <div class="mt-4">
            <small>Basic Information</small>
            <div class="details-row">
              <p>Member Since</p>
              <p>{{getSelectedUser.createdAt | moment("MMMM Do YYYY")}}</p>
            </div>
            <div class="details-row">
              <p>Gender</p>
              <p>{{getSelectedUser.gender}}</p>
            </div>
          </div>
        </div>
        <!-- ---- -->
      </div>
    </div>

    <!-- <router-link to="/login" tag="button">Log in</router-link>
    <button @click="logout()">Logout</button>
    <router-link to="/register" tag="button">Register</router-link>
    {{getSelectedUser}}
    <div v-if="getSelectedUser">
      <h1>User details</h1>
      <hr>
      <p>Id: {{getSelectedUser._id}}</p>
      <p>Name: {{getSelectedUser.fullName}}</p>
      <p>Member since: 12 aug 2019</p>
      <p>active ad: 5</p>
    </div>
    <div>
      <router-link to="/products/new" tag="button">Post New</router-link>
    </div>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import eventBus from '../main';
import MyProductsCardVue from '../components/MyProductsCard.vue';
import store from '../store/store';
import { authController } from '../api';

export default {
  data() {
    return {
      role: undefined,
      mode: 'about',
    };
  },
  components: {
    'app-card': MyProductsCardVue,
  },
  beforeRouteEnter(to, from, next) {
    if (eventBus.isLoggedIn) {
      to.fullPath.split('/').pop() === 'me'
        ? (eventBus.profile.role = 'admin')
        : (eventBus.profile.role = 'user');
      let userId;
      if (eventBus.profile.role === 'admin') {
        userId = store.getters.getAdmin._id;
      } else {
        console.log(to.params.id); // Remaining
      }
      const user = store.getters.getSelectedUser;
      function getUserFromServer() {
        authController
          .getUser(userId)
          .then(({ data }) => {
            store.dispatch('setSelectedUser', data);
            next();
          })
          .catch((err) => {
            console.log(err.response); // Alert
          });
      }
      if (user) {
        if (user._id == userId) {
          next();
        } else getUserFromServer();
      } else getUserFromServer();
    } else {
      next('/login');
    }
  },
  computed: {
    ...mapGetters(['getSelectedUser']),
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$store.dispatch('removeAdmin');
      eventBus.isLoggedIn = false;
      this.$destroy();
      window.location.reload();
    },
  },
  created() {
    this.role = eventBus.profile.role;
    // console.log(this.getSelectedUser);
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/sass/main";
.profile.container {
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  margin-bottom: 3rem;
  @include respond(df, tab-p) {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    flex-direction: column;
  }
}
.left {
  width: 30%;
  @include respond(df, tab-l) {
    width: 40%;
  }
  @include respond(df, tab-p) {
    width: 100%;
  }
  .img-box {
    width: 100%;
    background: #fff;
    padding: 0.3rem;
    border: 2px solid rgba(0, 0, 0, 0.11);
    height: 250px;
    margin-bottom: 3rem;
    overflow: hidden;
    @include respond(df, tab-p) {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      margin: auto;
    }
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      @include respond(df, tab-p) {
        transform: scale(1.2);
      }
    }
  }
  .recent-posts {
    @include respond(df, tab-p) {
      display: none;
    }
    .heading {
      text-transform: uppercase;
      display: flex;
      align-items: baseline;
      font-size: 0.9rem;
      margin-bottom: 1rem;

      small {
        margin-right: 0.5rem;
      }
      hr {
        flex-grow: 1;
      }
    }
    &__post {
      margin-bottom: 1rem;
      cursor: pointer;
      transition: all 0.5s;
      border-radius: 10px;
      padding: 0.4rem;
      border: 3px solid transparent;
      &:hover {
        box-shadow: inset 0px 0px 300px 104px rgb(255, 255, 255);
        border-color: rgba(167, 167, 167, 0.295);

        padding-left: 0.8rem;
      }
      h2 {
        font-size: 1.5rem;
        @include respond(df, tab-l) {
          font-size: 1.3rem;
        }
      }
    }
  }
}
.right {
  i {
    margin-right: 0.3rem;
    @include respond(df, tab-l) {
      margin-right: 0.1rem;
    }
  }
  width: 65%;
  @include respond(df, tab-l) {
    width: 55%;
  }
  @include respond(df, tab-p) {
    width: 100%;
  }
}
.intro {
  h1 {
    margin-right: 1rem;
    display: inline-block;
    @include respond(df, mbl) {
      font-size: 1.5rem;
      margin: 0;
    }
  }
  @include respond(df, tab-p) {
    margin-top: 1rem;
    font-size: 1rem;
    text-align: center;
    h1 {
      display: block;
    }
  }
  i {
    margin-right: 0.4rem;
    @include respond(df, tab-p) {
      margin: 0;
      margin-right: 0.5rem;
    }
  }
  .status {
    font-weight: bold;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
  .bio {
    margin-top: 2rem;
    border: 1px solid rgba(128, 128, 128, 0.342);
    padding: 1rem;
    color: rgb(92, 92, 92);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.411);
    @include respond(df, tab-p) {
      margin-top: 1rem;
      font-size: 0.8rem;
    }
  }
}
.control {
  .admin-control > div {
    display: flex;
    .btn-block {
      margin: 0;
      &:first-of-type {
        margin-right: 1rem;
      }
    }
  }
  @include respond(df, tab-p) {
    text-align: center;
  }
}
.cta {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  @include respond(df, tab-p) {
    &:first-of-type {
      margin-right: 1rem;
    }
    &:last-of-type {
      display: block;
      margin: auto;
    }
  }
  @include respond(df, tab-l) {
    padding: 0.5rem 0.5rem;
    margin: 0;
  }
  border-radius: 5px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
  color: #424242;

  &:active,
  &:focus {
    outline: none;
  }
  &:hover {
    &:not(.report) {
      background: #e3f2fd;
      color: #424242;
    }
  }
}
.cta.active {
  background: #3ca4f494;
  color: #fff;
  &:hover {
    background: #3ca4f4cb;
  }
}
.details {
  margin-top: 2rem;
  .tab {
    border-bottom: 1px solid rgba(128, 128, 128, 0.247);
    button {
      padding: 0.5rem 1rem;
      background: none;
      border: none;
      margin-right: 2rem;
      margin-bottom: -2px;
      border-bottom: 4px solid transparent;
      color: rgba($color: #000000, $alpha: 0.3);
      transition: all 0.3s;
      @include respond(df, tab-p) {
        width: 50%;
        padding: 0.5rem 0;
        margin-right: 0;
      }
      &:focus {
        outline: none;
      }
      cursor: pointer;
      &.active {
        border-color: #3ca4f4cb;
        color: black;
      }
    }
  }
  small {
    margin: 1rem 0;
    letter-spacing: 2px;
    display: block;
    text-transform: uppercase;
    @include respond(df, tab-p) {
      margin-top: 3rem;
      text-align: center;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid rgba(128, 128, 128, 0.247);
    }
  }
  .details-row {
    display: flex;
    margin-bottom: 0.4rem;
    p:first-of-type {
      width: 8rem;
    }
  }
}
.card-deck {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  justify-items: center;
  .card {
    @include respond(mf, mbl) {
      width: 200px;
    }
    & /deep/ {
      font-size: 80%;
      h5 {
        font-size: 1rem;
      }
      .card-text-bottom {
        display: none;
      }
    }
  }
}
</style>
