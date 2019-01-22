import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';
import Home from './views/Home.vue';
import { authController, productController } from './api';
import eventBus from './main';
import store from './store/store';

axios.defaults.baseURL = 'http://localhost:3000';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/products/new',
      name: 'new-product',
      component: () => import('./views/ProductControl.vue'),
    },
    {
      path: '/products/:id/edit',
      name: 'edit-product',
      component: () => import('./views/ProductControl.vue'),
      beforeEnter(to, from, next) {
        const admin = store.getters.getAdmin;
        const productId = to.params.id;
        productController
          .getSingleProduct(productId)
          // eslint-disable-next-line consistent-return
          .then((result) => {
            if (result.data.author == admin._id) {
              return next();
            }
            // eslint-disable-next-line no-alert
            alert('Youre unauthorized');
            next('/me');
          })
          .catch(() => next('404'));
      },
    },
    {
      path: '/products/:id',
      name: 'product',
      component: () => import('./views/ProductDetails.vue'),
    },
    {
      path: '/me',
      name: 'profile',
      component: () => import('./views/Profile.vue'),
    },
    {
      path: '/my-products',
      name: 'my-ads',
      component: () => import('./views/MyProducts.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/ProfileControl.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/ProfileControl.vue'),
    },
    {
      path: '/*',
      name: '404',
      component: () => import('./views/404.vue'),
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk(about.[hash].js) for this route
    //   // which is lazy - loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
  ],
});
router.beforeEach((to, from, next) => {
  next();
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers = {
      'x-auth-token': token,
    };
    authController
      .authenticateUser(token)
      .then((resp) => {
        store.dispatch('setAdmin', resp.data);
        eventBus.isLoggedIn = true;
        next();
      })
      .catch(() => next());
  } else {
    next();
  }
});

export default router;
