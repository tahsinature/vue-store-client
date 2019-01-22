<template>
  <div class="container">
    <h1>{{mode}} Ad</h1>
    <hr>
    <flash-message></flash-message>
    <div class="form-group">
      <input
        type="text"
        placeholder="Title"
        class="form-control"
        v-model="newProduct.title"
        v-validate="{required: true, min: 5, max: 15}"
        name="title"
        :class="{'is-invalid': errors.has('title')}"
      >
      <small class="invalid-feedback">{{errors.first('title')}}</small>
    </div>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text">$</span>
      </div>
      <input
        type="number"
        class="form-control"
        aria-label="Amount (to the nearest dollar)"
        placeholder="Price"
        v-model.number="newProduct.price"
        name="price"
        v-validate="{required: true}"
        :class="{'is-invalid': errors.has('price')}"
      >
      <small class="invalid-feedback">{{errors.first('price')}}</small>
    </div>
    <div class="form-group">
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <label class="input-group-text" for="inputGroupSelect01">Location</label>
        </div>
        <select class="custom-select" id="inputGroupSelect01" v-model="newProduct.location">
          <option v-for="location in locations" :key="location">{{location}}</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <textarea
        data-gramm_editor="false"
        id
        cols="30"
        rows="10"
        class="form-control"
        placeholder="Describe about this product here..."
        name="description"
        v-model="newProduct.description"
        v-validate="{required: true, max: 255}"
        :class="{'is-invalid': errors.has('description')}"
      ></textarea>
      <small class="invalid-feedback">{{errors.first('description')}}</small>
    </div>
    <div class="image-preview-box jumbotron mb-3" v-show="newProduct.images.length >= 1">
      <div>
        <app-single-image-preview
          v-for="(image, index) in newProduct.images"
          :key="index"
          :image="image.url"
          @onImageRemove="removeUploadedImage(index)"
        ></app-single-image-preview>
      </div>
    </div>
    <div class="progress mb-3" v-if="isUploading">
      <div
        class="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        :style="{width: uploadProgress+'%'}"
      ></div>
    </div>
    <div class="image-uploader-box mb-3">
      <div class="text-center">
        <div class="upload-wrapper">
          <image-uploader
            browseText="Click to browse"
            dragText="Drag an image"
            popupText="Cover photos appears at first and will be used as default image."
            primaryText="Cover"
            dropText="Drop here"
            markIsPrimaryText="Make Cover"
            :maxImage="5 - newProduct.images.length"
            @upload-success="uploadImageSuccess"
            @before-remove="beforeRemove"
            :key="1"
            ref="imageUploader"
          ></image-uploader>
          <button
            class="btn btn-block btn-success"
            @click="uploadMedia()"
            :disabled="this.selectedImages.length < 1
        || this.selectedImages.length > 5
        || this.newProduct.images.length >= 5"
          >
            Upload
            <i class="fas fa-upload"></i>
          </button>
        </div>
      </div>
      <div
        class="tips-wrapper"
        :class="{
        'arrow_box-top': windowSize<= 576,
        'arrow_box-left': windowSize> 576, }
        "
      >
        <div>
          <h3>Use real photos!</h3>
          <p>Ads with real photos get 10 times more views than with catalogue images.</p>
          <img src="https://w.bikroy-st.com/dist/img/all/post/images-hint-4720b5e9.png" alt>
          <p>Images must be JPG or PNG format (max 5 MB). Do not upload images with watermarks.</p>
        </div>
      </div>
    </div>
    <!-- <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text" id="inputGroupFileAddon01">Upload</span>
      </div>
      <div class="custom-file">
        <input
          type="file"
          class="custom-file-input"
          id="inputGroupFile01"
          aria-describedby="inputGroupFileAddon01"
          @change="onImageSelect($event)"
          ref="image"
        >
        <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
      </div>
    </div>-->
    <button
      class="btn btn-primary btn-block"
      type="button"
      :disabled="checkMode"
      :class="{'btn-success': allDone}"
      @click="reviewPost()"
    >
      <span v-if="!allDone">{{mode === 'edit' ? 'Edit And Publish': 'Publish'}}</span>
      <span v-if="allDone">Validation Completed</span>
      <i class="fas fa-check-circle ml-2 valid-tick" v-show="allDone"></i>
      <span
        class="spinner-grow spinner-grow-sm"
        role="status"
        aria-hidden="true"
        v-if="checkMode && !allDone"
      ></span>
    </button>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import imageUploader from 'vue-upload-multiple-image';
import axios from 'axios';
import { productController, mediaController } from '../api';
import SingleImagePreviewVue from '../components/SingleImagePreview.vue';

export default {
  components: {
    'image-uploader': imageUploader,
    'app-single-image-preview': SingleImagePreviewVue,
  },
  data() {
    return {
      newProduct: {
        title: '',
        price: undefined,
        location: 'Asia',
        description: '',
        images: [],
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
      selectedImages: [],
      firstTry: true,
      checkMode: false,
      allDone: false,
      windowSize: undefined,
      isUploading: false,
      uploadProgress: 0,
      mode: undefined,
    };
  },
  methods: {
    uploadImageSuccess(formData, index, files) {
      const file = formData.getAll('file')[0];
      if (this.selectedImages.length < 5 - this.newProduct.images.length) {
        this.selectedImages.push(file);
      } else {
        this.$refs.imageUploader.images.pop(5 - this.selectedImages.length);
        this.flash('Maximum Image Limit: 5', 'error', {
          timeout: 3000,
          important: true,
        });
      }
    },
    beforeRemove(index, done, files) {
      this.selectedImages.splice(index, 1);
      done();
    },
    uploadMedia() {
      if (
        this.selectedImages.length < 1
        || this.selectedImages.length > 5
        || this.newProduct.images.length >= 5
      ) {
        return;
      }
      const fd = new FormData();
      this.selectedImages.forEach((file) => {
        fd.append('images', file);
      });
      this.selectedImages = [];
      this.$refs.imageUploader.images = [];
      // mediaController
      //   .uploadMedia(fd)
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
          res.data.forEach((imgObj) => {
            if (this.newProduct.images.length < 5) {
              this.newProduct.images.push(imgObj);
            }
          });
        })
        .catch((err) => {
          this.uploadProgress = 0;
          this.isUploading = false;
        });
    },
    removeUploadedImage(index) {
      this.newProduct.images.splice(index, 1);
    },
    reviewPost() {
      this.checkMode = true;
      // setTimeout(() => {
      this.$validator.validateAll().then((success) => {
        if (success) {
          this.allDone = true;
          if (this.mode === 'new') {
            productController
              .newProduct(this.newProduct)
              .then((resp) => {
                this.$store.dispatch('addNewProduct', resp.data);
                // eslint-disable-next-line no-underscore-dangle
                this.$router.push(`/products/${resp.data._id}`);
              })
              .catch(err => console.log(err.response));
          } else {
            productController
              .editProduct(this.$route.params.id, this.newProduct)
              .then((resp) => {
                this.$store.dispatch('editProduct', resp.data);
                // eslint-disable-next-line no-underscore-dangle
                this.$router.push(`/products/${resp.data._id}`);
              })
              .catch(err => console.log(err.response));
          }
        } else {
          this.checkMode = false;
        }
      });
      // }, 1000);
    },
  },
  created() {
    this.windowSize = document.documentElement.clientWidth;
    window.addEventListener('resize', () => {
      this.windowSize = document.documentElement.clientWidth;
    });
  },
  beforeMount() {
    this.mode = this.$route.fullPath.split('/').pop();
    if (this.mode === 'edit') {
      const product = this.$store.getters.products.find(
        element => element._id == this.$route.params.id,
      );
      if (!product) {
        this.$router.push('404aa');
      } else {
        this.newProduct.title = product.title;
        this.newProduct.price = product.price;
        this.newProduct.location = product.location;
        this.newProduct.description = product.description;
        this.newProduct.images = product.images;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/sass/main.scss";
.image-preview-box {
  text-align: center;
  padding: 1rem;
  & > div {
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    display: inline-block;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
.image-uploader-box {
  display: grid;
  // grid-template-columns: min-content 1fr;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  align-items: center;
  @include respond(df, mbl) {
    grid-template-columns: 1fr;
  }
  grid-gap: 2rem;
  .upload-wrapper {
    display: inline-block;
    button {
      margin-top: 0.5rem;
      // color: rgba(114, 114, 114, 0.76);
      // background: #adb48f2b;
      // transition: all 0.3s;
      // &:hover {
      //   color: rgb(255, 255, 255);
      //   background: #999999;
      // }
    }
  }
  .tips-wrapper {
    background: red;
    border-radius: 10px;
    padding: 1rem;
    color: #673500;
    background: #fbf6d5;
    border: solid 2px #dcb300;
    width: 100%;
    @include respond(mf, tab-l) {
      width: 70%;
    }
    div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        margin: 1rem 0;
      }
    }
  }
}
.arrow_box-top {
  position: relative;
  // background: #fbf6d5;
  border: 2px solid #dcb300;
}
.arrow_box-top:after,
.arrow_box-top:before {
  bottom: 100%;
  left: 50%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.arrow_box-top:after {
  border-color: rgba(251, 246, 213, 0);
  border-bottom-color: #fbf6d5;
  border-width: 10px;
  margin-left: -10px;
}
.arrow_box-top:before {
  border-color: rgba(220, 179, 0, 0);
  border-bottom-color: #dcb300;
  border-width: 13px;
  margin-left: -13px;
}

.arrow_box-left {
  position: relative;
  background: #fbf6d5;
  border: 2px solid #dcb300;
}
.arrow_box-left:after,
.arrow_box-left:before {
  right: 100%;
  top: 50%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.arrow_box-left:after {
  border-color: rgba(251, 246, 213, 0);
  border-right-color: #fbf6d5;
  border-width: 10px;
  margin-top: -10px;
}
.arrow_box-left:before {
  border-color: rgba(220, 179, 0, 0);
  border-right-color: #dcb300;
  border-width: 13px;
  margin-top: -13px;
}
</style>
