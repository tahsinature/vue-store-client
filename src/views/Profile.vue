<template>
  <div>
    <h1>Profile Page</h1>
    <router-link to="/login" tag="button">Log in</router-link>
    <button @click="logout()">Logout</button>
    <router-link to="/register" tag="button">Register</router-link>
    {{getAdmin}}
    <div v-if="getAdmin">
      <h1>User details</h1>
      <hr>
      <p>Id: {{getAdmin._id}}</p>
      <p>Name: {{getAdmin.fullName}}</p>
      <p>Member since: 12 aug 2019</p>
      <p>active ad: 5</p>
    </div>
    <div>
      <router-link to="/products/new" tag="button">Post New</router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import eventBus from '../main';

export default {
  beforeRouteEnter(to, from, next) {
    if (eventBus.isLoggedIn) {
      next();
    } else {
      next('/login');
    }
  },
  computed: {
    ...mapGetters(['getAdmin']),
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$store.dispatch('removeAdmin');
      eventBus.isLoggedIn = false;
      window.location.reload();
      this.$router.push('/');
    },
  },
};
</script>

<style>
</style>
