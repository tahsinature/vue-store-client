<template>
  <div class="profile-control">
    <notifications group="auth" position="bottom right" animation-type="velocity"></notifications>
    <div class="brand">
      <h1>Brand</h1>
    </div>
    <div class="form">
      <h1 class="form-title">{{mode}} User</h1>
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
        <div class="text-right mt-2">Don't have an account?
          <router-link to="/register">Register</router-link>
        </div>
      </form>
      <form @submit.prevent="handleSubmit" v-if="mode === 'register' || mode === 'edit'">
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
            :class="[{'is-invalid': errors.has('userName') || userNameStatus === 'taken'}, {'is-valid': !errors.has('userName') && userNameStatus === 'ok'}]"
            @blur="checkUserName()"
            @focus="userNameStatus = null"
          >
          <small class="invalid-feedback">{{errors.first('userName')}}</small>
          <small v-if="userNameStatus === 'taken'" class="invalid-feedback">Username already taken</small>
          <small v-if="userNameStatus === 'ok'" class="valid-feedback">Username available ✔</small>
          <small v-if="userNameStatus === 'checking'">Checking Availablity...</small>
        </div>
        <div class="form-group">
          <input
            class="form-control"
            type="email"
            name="email"
            placeholder="Email Address"
            v-model="userInfo.email"
            v-validate="'required|email'"
            :class="[{'is-invalid': errors.has('email') || emailStatus === 'taken'}, {'is-valid': !errors.has('email') && emailStatus === 'ok'}]"
            @blur="checkEmail()"
            @focus="emailStatus = null"
          >
          <small class="invalid-feedback">{{errors.first('email')}}</small>
          <small v-if="emailStatus === 'taken'" class="invalid-feedback">Email is already registered</small>
          <small
            v-if="emailStatus === 'ok'"
            class="valid-feedback"
          >This email is not registered yet ✔</small>
          <small v-if="emailStatus === 'checking'">Checking Availablity...</small>
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
          <select
            id="location"
            class="form-control"
            v-model="userInfo.location"
            name="location"
            v-validate="'required'"
            :class="{'is-invalid': errors.has('location')}"
          >
            <option
              v-for="location in locations"
              :key="location.value"
              :value="location.value"
            >{{location.name}}</option>
          </select>
          <small class="invalid-feedback">{{errors.first('location')}}</small>
        </div>
        <div class="bio">
          <div class="form-group">
            <textarea
              class="form-control"
              data-gramm_editor="false"
              placeholder="Bio..."
              name="bio"
              v-validate="'required'"
              v-model="userInfo.bio"
              :class="{'is-invalid': errors.has('location')}"
            ></textarea>
            <small class="invalid-feedback">{{errors.first('bio')}}</small>
          </div>
          <div class="img-control">
            <div class="img-box" v-if="userInfo.profilePhoto" @click="userInfo.profilePhoto = null">
              <img :src="userInfo.profilePhoto.url">
              <p>Remove</p>
            </div>
            <div v-else>
              <image-uploader
                browseText="Click to browse"
                dragText="Drag an image"
                primaryText="Cover"
                dropText="Drop here"
                popupText="This is going to be your profile picture."
                markIsPrimaryText="Make Cover"
                :maxImage="1"
                ref="imageUploader"
                @before-remove="beforeRemove"
                @upload-success="uploadMedia"
                :class="{'image-uploader-error': imgWarning}"
              ></image-uploader>
              <small class="invalid-feedback d-inline" v-if="imgWarning">Image is required</small>
              <div class="progress mt-2" v-if="isUploading">
                <div
                  class="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  aria-valuenow="75"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :style="{width: uploadProgress + '%'}"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group mt-4">
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
        <button class="btn btn-success btn-block" :disabled="isProcessing">
          {{(mode === 'register') ? 'Register Me' : 'Edit & Save'}}
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            v-show="isProcessing"
          ></span>
        </button>
        <div v-if="mode === 'register'" class="text-right mt-2">Already registerd?
          <router-link to="/login">Login</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import imageUploader from 'vue-upload-multiple-image';
import axios from 'axios';
import eventBus from '../main';
import { authController, mediaController } from '../api';

export default {
  components: {
    'image-uploader': imageUploader,
  },
  data() {
    return {
      mode: undefined,
      userInfo: {
        fullName: '',
        userName: '',
        email: '',
        password: '',
        contactNo: '',
        profilePhoto: null,
        gender: 'Male',
        location: null,
        bio: '',
      },
      loginInfo: {
        userName: '',
        password: '',
        rememberPassword: false,
      },
      editInfo: {
        fullName: '',
        password: '',
        contactNo: '',
        profilePhoto: '',
        location: '',
        bio: '',
      },
      locations: [
        { name: 'Select Location', value: null },
        { name: 'Asia', value: 'asia' },
        { name: 'Africa', value: 'africa' },
        { name: 'North America', value: 'north-america' },
        { name: 'South America', value: 'south-america' },
        { name: 'Antartica', value: 'antartica' },
        { name: 'Europe', value: 'europe' },
        { name: 'Australia', value: 'australia' },
      ],
      userNameStatus: null,
      emailStatus: null,
      imgWarning: false,
      confirmation: null,
      isProcessing: false,
      selectedImages: undefined,
      uploadProgress: 0,
      isUploading: false,
    };
  },
  watch: {
    $route(to, from) {
      this.mode = to.path.split('/')[1];
    },
  },
  methods: {
    checkUserName() {
      if (this.errors.has('userName') || !this.userInfo.userName) return;

      this.userNameStatus = 'checking';
      authController
        .checkAvailablity({ userName: this.userInfo.userName })
        .then((res) => {
          if (res.status === 200) return (this.userNameStatus = 'ok');
        })
        .catch((err) => {
          if (err.response.status === 409) {
            return (this.userNameStatus = 'taken');
          }
        });
    },
    checkEmail() {
      if (this.errors.has('email') || !this.userInfo.email) return;

      this.emailStatus = 'checking';
      authController
        .checkAvailablity({ email: this.userInfo.email })
        .then((res) => {
          if (res.status === 200) return (this.emailStatus = 'ok');
        })
        .catch((err) => {
          if (err.response.status === 409) {
            return (this.emailStatus = 'taken');
          }
        });
    },
    beforeRemove() {
      this.$refs.imageUploader.images = [];
      this.userInfo.profilePhoto = null;
      this.imgWarning = true;
    },
    // eslint-disable-next-line no-unused-vars
    uploadMedia(formData, index, files) {
      if (this.selectedImages) return;
      this.imgWarning = false;
      const file = formData.getAll('file')[0];
      const fd = new FormData();
      fd.append('images', file);
      mediaController.uploadMedia(fd);
      this.isUploading = true;
      axios
        .post('/media', fd, {
          onUploadProgress: (event) => {
            this.uploadProgress = Math.floor(
              (event.loaded / event.total) * 100,
            );
          },
        })
        .then((res) => {
          this.uploadProgress = 0;
          this.isUploading = false;
          // console.log(res.data[0]);
          // eslint-disable-next-line prefer-destructuring
          this.userInfo.profilePhoto = res.data[0];
        })
        .catch(() => {
          this.uploadProgress = 0;
          this.isUploading = false;
        });
    },
    handleSubmit() {
      this.$validator
        .validateAll()
        // eslint-disable-next-line consistent-return
        .then((valid) => {
          if (!valid) {
            this.imgWarning = true;
            return this.$emit('onNotify', {
              title: 'Oops, Bad Inputs',
              text: 'Please check and double check your inputs.',
              type: 'error',
            });
          }
          this.isProcessing = true;
          console.log(this.userInfo);
          authController
            .registerUser(this.userInfo)
            .then(() => {
              this.$emit('onNotify', {
                title: 'Registration Successful',
                text: 'Please Login with your credentials. .😃',
                type: 'success',
              });
              // this.userInfo = null;
              this.$router.push('/login');
            })
            .catch((err) => {
              console.log(err);

              this.isProcessing = false;
              // setTimeout(() => {
              //   this.flash(err.response.data.message.errorMessage, 'error', {
              //     timeout: 2000,
              //     important: true,
              //   });
              // }, 1000);
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
          this.$emit('onNotify', {
            title: 'Login Successfull',
            text: `Welcome ${response.data.user.fullName} to your profile.`,
            type: 'success',
          });
        })
        .catch((err) => {
          this.$emit('onNotify', {
            title: err.response.statusText,
            text: err.response.data.message.errorMessage,
            type: 'error',
          });
        });
    },
  },
  beforeMount() {
    // eslint-disable-next-line prefer-destructuring
    this.mode = this.$route.fullPath.split('/').pop();
    if (this.mode === 'edit') {
      this.userInfo = this.$store.getters.getAdmin;
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.fullPath.split('/').pop() === 'edit') {
      if (eventBus.isLoggedIn) {
        next();
      } else {
        next('login');
      }
    } else if (eventBus.isLoggedIn) {
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
    margin: 2rem 0;
    &-title {
      text-transform: uppercase;
      font-size: 1.6rem;
      margin-bottom: 1.4rem;
    }
    padding: 0 10vw;
    .form-check-input,
    .form-check-label {
      cursor: pointer;
    }
  }
}
.bio {
  display: flex;
  justify-content: space-between;
  .img-control {
    display: flex;
    justify-content: center;
    align-items: center;
    .img-box {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid #ddd;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      p {
        position: absolute;
        bottom: 0;
        left: 0;
        background: rgba($color: #000000, $alpha: 0.6);
        width: 100%;
        height: 30%;
        text-align: center;
        font-family: "Courier New", Courier, monospace;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
      }
      &:hover {
        p {
          height: 100%;
          cursor: pointer;
          background: rgba($color: red, $alpha: 0.6);
        }
      }
    }
  }
  .form-group {
    flex-grow: 1;
    margin-right: 1rem;
    textarea {
      height: 100%;
    }
  }
}
.image-uploader-error {
  border: 2px solid rgba(255, 0, 0, 0.692);
  border-radius: 5px;
}
</style>
