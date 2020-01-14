<template>
  <div class="app-loader-holder">
    <!-- Loading square for squar.red network -->
    <span class="loader">
      <span class="loader-inner"></span>
    </span>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.app-loader-holder {
  text-align: center;
  background-color: #242f3f;
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 110;
}

.loader {
  display: inline-block;
  width: 30px;
  height: 30px;
  position: relative;
  border: 4px solid #fff;
  top: 50%;
  animation: loader 2s infinite ease;
}

.loader-inner {
  vertical-align: top;
  display: inline-block;
  width: 100%;
  background-color: #fff;
  animation: loader-inner 2s infinite ease-in;
}

@keyframes loader {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(180deg);
  }

  50% {
    transform: rotate(180deg);
  }

  75% {
    transform: rotate(360deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes loader-inner {
  0% {
    height: 0%;
  }

  25% {
    height: 0%;
  }

  50% {
    height: 100%;
  }

  75% {
    height: 100%;
  }

  100% {
    height: 0%;
  }
}
</style>