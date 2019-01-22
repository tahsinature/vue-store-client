<template>
  <div class="card">
    <img src="https://www.shopgro.in/img/no-image.png" class="card-img-top">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
      <p
        class="card-text"
      >This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>

      <div class="card-text card-text-bottom">
        <div class="card-text-bottom__left">
          <small class="text-center">8 Hours ago</small>
        </div>
        <div class="card-text-bottom__right">
          <div>
            <i class="fas fa-heart"></i>
            <span>5</span>
          </div>
          <div>
            <i class="fas fa-comment-dots"></i>
            <span>5</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "../assets/sass/main.scss";
.card {
  border-radius: 2rem;
  min-width: 300px;
  max-width: 300px;
  margin: 15px;
  @include respond(df, mbl) {
    min-width: 100%;
    margin: 15px 0;
  }
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.04);
    transform-origin: top;
    box-shadow: 0 -10px 2rem 0.5rem rgba($color: #000000, $alpha: 0.05);
    background: rgba(0, 255, 128, 0.164);
  }
}
.card-body {
  display: flex;
  flex-direction: column;
  padding: 1.1rem;
  .card-text:nth-last-of-type(1) {
    margin-bottom: 0.5rem;
  }

  .card-text-bottom {
    margin-top: auto;
    border-radius: 0 0 1rem 1rem;
    display: flex;
    overflow: hidden;
    &__left {
      background: rgb(127, 157, 197);
      width: 50%;
    }
    &__right {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      color: #fff;
      i {
        margin-right: 0.2rem;
      }
    }
    background: rgb(161, 187, 221);
    small {
      padding: 0.5rem 0.5rem;
      display: block;
      color: #fff;
    }
  }
}
</style>
