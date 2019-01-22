<template>
  <div class="profile-control">
    <div class="brand">
      <h1>Brand</h1>
    </div>
    <div class="form">
      <h1
        v-text="mode === 'register' ? 'Register' : 'Login'"
        :class="{'mode-move': mode === 'register'}"
      ></h1>
      <!-- <flash-message transitionIn="animated swing" class="alert alert-primary"></flash-message> -->
      <transition name="fade">
        <flash-message></flash-message>
      </transition>
      <form v-if="mode === 'login'" @submit.prevent="handleLogin">
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            placeholder="Username"
            v-model="loginInfo.userName"
          >
        </div>
        <div class="form-group">
          <input
            type="password"
            class="form-control"
            placeholder="Password"
            v-model="loginInfo.password"
          >
          <div class="form-group form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="exampleCheck1"
              v-model="loginInfo.rememberPassword"
            >
            <label class="form-check-label" for="exampleCheck1">Remember Me</label>
          </div>
        </div>
        <button class="btn btn-block btn-success">Login</button>
        <div class="text-right">Don't have an account?
          <router-link to="/register">Register</router-link>
        </div>
      </form>
      <form @submit.prevent="handleSubmit" v-if="mode === 'register'">
        <div class="form-group">
          <input
            class="form-control"
            type="text"
            placeholder="Full Name"
            name="fullName"
            v-model="userInfo.fullName"
            v-validate="{required: true}"
            :class="{'is-invalid': errors.has('fullName')}"
          >
          <small class="invalid-feedback">Name is required.</small>
        </div>
        <div class="form-group">
          <input
            class="form-control"
            type="text"
            placeholder="Username"
            name="userName"
            v-model="userInfo.userName"
            v-validate="{required: true, min: 3}"
            :class="{'is-invalid': errors.has('userName')}"
          >
          <small class="invalid-feedback">{{errors.first('userName')}}</small>
        </div>
        <div class="form-group">
          <input
            class="form-control"
            type="email"
            name="email"
            placeholder="Email Address"
            v-model="userInfo.email"
            v-validate="'required|email'"
            :class="{'is-invalid': errors.has('email')}"
          >
          <small class="invalid-feedback">{{errors.first('email')}}</small>
        </div>
        <div class="form-group">
          <input
            class="form-control"
            type="password"
            name="password"
            placeholder="Password"
            v-model="userInfo.password"
            ref="password"
            v-validate="{required: true, min: 6}"
            :class="{'is-invalid': errors.has('password')}"
          >
          <small class="invalid-feedback">{{errors.first('password')}}</small>
        </div>
        <div class="form-group">
          <input
            class="form-control"
            type="password"
            name="password_confirmation"
            placeholder="Confirm Password"
            v-validate="'required|confirmed:password'"
            data-vv-as="password"
            :class="{'is-invalid': errors.has('password_confirmation')}"
          >
          <small class="invalid-feedback">Password needs to be matched</small>
        </div>
        <div class="form-group">
          <input
            class="form-control"
            type="text"
            placeholder="Contact Number"
            v-model="userInfo.contactNo"
            v-validate="{required: true}"
            name="contactNo"
            :class="{'is-invalid': errors.has('contactNo')}"
          >
          <small class="invalid-feedback">Phone Number is required</small>
        </div>
        <div class="form-group">
          <input
            class="form-control"
            type="text"
            placeholder="Profile Photo URL"
            v-model="userInfo.profilePhoto"
            v-validate="'required'"
            name="profilePhoto"
            :class="{'is-invalid': errors.has('profilePhoto')}"
          >
          <small class="invalid-feedback">Profile Photo is required</small>
        </div>
        <div class="form-group">
          <div class="form-check form-check-inline">
            <input
              type="radio"
              id="male"
              value="Male"
              class="form-check-input"
              v-model="userInfo.gender"
            >
            <label for="male" class="form-check-label">Male</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              type="radio"
              id="female"
              value="Female"
              class="form-check-input"
              v-model="userInfo.gender"
            >
            <label for="female" class="form-check-label">Female</label>
          </div>
        </div>
        <div class="form-group">
          <label for="location">Location</label>
          <select id="location" class="form-control" v-model="userInfo.location">
            <option v-for="location in locations" :key="location">{{location}}</option>
          </select>
        </div>
        <button class="btn btn-success btn-block" :disabled="isProcessing">
          Register
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            v-show="isProcessing"
          ></span>
        </button>
        <div class="text-right">Already registerd?
          <router-link to="/login">Login</router-link>
        </div>
      </form>
      <!-- <div>
        <p>{{userInfo.fullName}}</p>
        <p>{{userInfo.userName}}</p>
        <p>{{userInfo.email}}</p>
        <p>{{userInfo.password}}</p>
        <p>{{userInfo.contactNo}}</p>
        <p>{{userInfo.profilePhoto}}</p>
        <p>{{userInfo.gender}}</p>
        <p>{{userInfo.location}}</p>
      </div>-->
    </div>
  </div>
</template>

<script>
import eventBus from '../main';
import { authController } from '../api';

export default {
  data() {
    return {
      mode: undefined,
      userInfo: {
        fullName: '',
        userName: '',
        email: '',
        password: '',
        contactNo: '',
        profilePhoto: '',
        gender: 'Male',
        location: 'Asia',
      },
      loginInfo: {
        userName: '',
        password: '',
        rememberPassword: false,
      },
      locations: [
        'Asia',
        'Africa',
        'North America',
        'South America',
        'Antartica',
        'Europe',
        'Australia',
      ],
      confirmation: null,
      submitted: false,
      isProcessing: false,
    };
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      // eslint-disable-next-line prefer-destructuring
      this.mode = to.path.split('/')[1];
    },
  },
  methods: {
    handleSubmit() {
      this.$validator
        .validateAll()
        // eslint-disable-next-line consistent-return
        .then((valid) => {
          if (!valid) {
            return this.flash('Oops, Please reheck your inputs.', 'error', {
              timeout: 3000,
              important: true,
            });
          }
          this.isProcessing = true;
          authController
            .registerUser(this.userInfo)
            .then((data) => {
              this.flash(data.data.message, 'success', {
                timeout: 2000,
                important: true,
              });
              this.userInfo = null;
              this.$router.push('/login');
            })
            .catch((err) => {
              setTimeout(() => {
                this.flash(err.response.data.message.errorMessage, 'error', {
                  timeout: 2000,
                  important: true,
                });
                this.isProcessing = false;
              }, 1000);
            });
        });
    },
    handleLogin() {
      authController
        .loginUser(this.loginInfo)
        .then((response) => {
          localStorage.setItem('token', response.data['x-auth-token']);
          this.$store.dispatch('setAdmin', response.data.user);
          eventBus.isLoggedIn = true;
          this.$router.push('/me');
        })
        .catch(err => console.log(err.response));
    },
  },
  beforeMount() {
    // eslint-disable-next-line prefer-destructuring
    this.mode = this.$route.fullPath.split('/')[1];
  },
  beforeRouteEnter(to, from, next) {
    if (eventBus.isLoggedIn) {
      next('/me');
    } else {
      next();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/sass/main.scss";

.profile-control {
  // background: url("https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX15766677.jpg");
  background: rgb(37, 51, 61);
  color: #fff;
  display: grid;
  grid-template-columns: 1fr 1fr;
  @include respond(df, tab-l) {
    grid-template-columns: 1fr;
  }
  min-height: calc(100vh - 4rem);
  align-items: center;
  // justify-items: center;
  .brand {
    justify-self: center;
    @include respond(df, tab-l) {
      display: none;
    }
  }
  .form {
    padding: 0 10vw;
    .form-check-input,
    .form-check-label {
      cursor: pointer;
    }
  }
}
</style>
