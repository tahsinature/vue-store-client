<template>
  <div>
    <div
      class="backdrop-sidenav"
      :class="{'backdrop-sidenav-show': isNavExpanded}"
      @click="isNavExpanded = !isNavExpanded"
    ></div>
    <nav :class="{exp: isNavExpanded, 'no-exp': !isNavExpanded}">
      <ul class="links">
        <router-link active-class="item-active" tag="li" class="link" to="/" exact>
          <i class="fas fa-home"></i>
          <p>Home</p>
        </router-link>
        <router-link active-class="item-active" tag="li" class="link" to="/my-products">
          <i class="fas fa-ad"></i>
          <p>My Ads</p>
        </router-link>
        <router-link active-class="item-active" tag="li" class="link" to="/#2">
          <i class="fab fa-facebook-messenger"></i>
          <p>Messages</p>
        </router-link>
        <router-link active-class="item-active" tag="li" class="link" to="/#3">
          <i class="fas fa-bell"></i>
          <p>Notification</p>
        </router-link>
        <router-link active-class="item-active" tag="li" class="link" to="/me">
          <i class="fas fa-user"></i>
          <p>Account</p>
        </router-link>
        <router-link active-class="item-active" tag="li" class="link" to="/#4">
          <i class="fas fa-info-circle"></i>
          <p>About</p>
        </router-link>
      </ul>
    </nav>
  </div>
</template>

<script>
import eventBus from '../main';

export default {
  data() {
    return {
      isNavExpanded: false,
    };
  },
  created() {
    eventBus.$on('onToggleNav', () => {
      this.isNavExpanded = !this.isNavExpanded;
    });
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/sass/main.scss";
.backdrop-sidenav {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: $backdrop-bg;
  z-index: 90;
  opacity: 0;
  visibility: hidden;
  transition: visibility 0.2s, opacity 0.2s;
}
.backdrop-sidenav-show {
  opacity: 1;
  visibility: visible;
}
nav {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  padding-top: 4rem; //For Top Header
  width: 5rem;
  @include respond(df, tab-p) {
    width: 0;
    opacity: 0;
    visibility: hidden;
  }
  background: $nav-bg;
  position: fixed;
  z-index: 90;
  left: 0;
  top: 0;
  height: 100vh;
  color: #fff;
  text-transform: uppercase;
  transition: all 0.3s;
}

.links {
  .link {
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.2s;
    padding: 0.5rem 0;
    cursor: pointer;
    i {
      transition: color 0.2s;
    }
    p {
      font-size: 0.7rem;
    }
    &:hover {
      transform: translateY(5px);
    }
  }
}
i {
  font-size: 2rem;
}

// expand
.exp {
  width: 15rem;
  opacity: 1;
  visibility: visible;
  .links {
    .link {
      padding-left: 1rem;
      flex-direction: row;
      padding: 0.7rem 1rem;
      &:not(:last-of-type) {
        margin-bottom: 0.6rem;
      }
      i {
        margin-right: 1rem;
      }
      p {
        font-size: 1rem;
      }
    }
  }
}

//text slides for noexp
.no-exp {
  .links {
    .link {
      p {
        transform: translateX(-200%);
        transition: 0.1s;
        margin-top: 0.5rem;
      }
    }
  }
  &:hover .links .link p {
    transform: translateX(0);
  }
}

//show color
nav:hover {
  .link:nth-of-type(1) {
    i {
      color: rgb(177, 13, 201);
    }
  }
  .link:nth-of-type(2) {
    i {
      color: #ff4d4d;
    }
  }
  .link:nth-of-type(3) {
    i {
      color: #00ccff;
    }
  }
  .link:nth-of-type(4) {
    i {
      color: #d009ff;
    }
  }
  .link:nth-of-type(5) {
    i {
      color: #627cf6;
    }
  }
  .link:nth-of-type(6) {
    i {
      color: #d9d7d7;
    }
  }
}
.item-active {
  background: #fff;
  color: #000;
  margin-bottom: 0.5rem;
  p {
    transform: translateX(0) !important;
  }
}
</style>
