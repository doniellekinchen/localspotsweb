<template>
  <div>
    <!-- Floating Nav Toggle -->
    <div class="fab" @click="toggleNav">
      ☰
    </div>

    <!-- Animated Nav Panel -->
    <transition name="slide-fade">
      <div v-if="showNav" class="nav-panel">
        <div class="nav-left">
          <h1 class="logo-text">We Be in the City</h1>
        </div>
        <div class="nav-right">
          <nav class="nav-options">
            <router-link to="/" @click.native="closeNav">Home</router-link>
            <router-link to="/about" @click.native="closeNav">About</router-link>
            <router-link to="/explore" @click.native="closeNav">Explore</router-link>
            <router-link to="/vibematch" @click.native="closeNav">VibeMatch</router-link>
            <router-link to="/contact" @click.native="closeNav">Contact</router-link>
          </nav>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'FloatingNavbar',
  data() {
    return {
      showNav: false
    };
  },
  methods: {
    toggleNav() {
      this.showNav = !this.showNav;
    },
    closeNav() {
      this.showNav = false;
    }
  }
};
</script>

<style scoped>
/* Floating Button */
.fab {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  background-color: #F28F3B;
  color: white;
  border: none;
  padding: 0.9rem 1.2rem;
  font-size: 1.5rem;
  border-radius: 999px;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: background 0.3s ease;
}

.fab:hover {
  background-color: #C8553D;
}

/* Nav Panel */
.nav-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  z-index: 999;
  background: linear-gradient(135deg, #fffaf6, #fcebe6);
}

/* Left Side: Logo */
.nav-left {
  flex: 1;
  background-color: #F28F3B;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  font-family: "Special Gothic Expanded One", sans-serif;
}

/* Right Side: Links */
.nav-right {
  flex: 1;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.nav-options a {
  font-size: 1.5rem;
  font-weight: 600;
  color: #C8553D;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-options a:hover {
  color: #F28F3B;
}

/* Smooth transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
