<template>
  <div>
    <app-loader v-if="$root.$data.isAppLoading" />
    <app v-else />
  </div>
</template>

<script>
import App from "./App";
import AppLoader from "./components/AppLoader";
export default {
  components: {
    app: App,
    "app-loader": AppLoader
  }
};
</script>

<style>
</style>