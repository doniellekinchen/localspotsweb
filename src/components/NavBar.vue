<template>
  <div class="nav-root" :class="{ 'nav-open': showNav }">
    <!-- Floating Toggle (morphs to X when open) -->
    <button
      class="fab"
      :aria-expanded="showNav.toString()"
      aria-controls="wb-nav-drawer"
      :aria-label="showNav ? 'Close menu' : 'Open menu'"
      @click="toggleNav"
    >
      <span class="fab-icon" :class="{ open: showNav }"></span>
    </button>

    <!-- Backdrop -->
    <transition name="fade">
      <div
        v-if="showNav"
        class="backdrop"
        @click="closeNav"
      />
    </transition>

    <!-- Drawer -->
    <transition name="slide">
      <aside
        v-if="showNav"
        id="wb-nav-drawer"
        class="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        @keydown.esc="closeNav"
      >
        <div class="drawer-header">
          <router-link to="/" class="brand" @click="closeNav">
            <span class="brand-badge">✨</span>
            We Be in the City
          </router-link>

          <button class="close-btn" @click="closeNav" aria-label="Close menu">×</button>
        </div>

        <nav class="drawer-nav">
          <router-link to="/" class="nav-link" @click="closeNav">
            <span class="i">🏠</span> Home
          </router-link>  
          <router-link to="/explore" class="nav-link" @click="closeNav">
            <span class="i">🧭</span> Explore
          </router-link>
          <router-link to="/vibematch" class="nav-link" @click="closeNav">
            <span class="i">🎯</span> VibeMatch
          </router-link>
          <router-link to="/favorites" class="nav-link" @click="closeNav">
            <span class="i">💖</span> Favorites
          </router-link>
          <router-link to="/about" class="nav-link" @click="closeNav">
            <span class="i">👋</span> About
          </router-link> 
          <router-link to="/contact" class="nav-link" @click="closeNav">
            <span class="i">✉️</span> Contact
          </router-link>
        </nav>

        <!-- Quick actions / chips -->
        <div class="drawer-quick">
          <p class="quick-title">Quick picks</p>
          <div class="chips">
            <button class="chip" @click="goQuick('vibe','Chill')">✨ Chill</button>
            <button class="chip" @click="goQuick('vibe','Foodie')">🍽 Foodie</button>
            <button class="chip" @click="goQuick('dateType','Date night')">❤️ Date night</button>
            <button class="chip" @click="goQuick('dateType','Friends')">💃 Friends</button>
          </div>
        </div>

        <div class="drawer-footer">
          <router-link to="/vibematch" class="cta" @click="closeNav">
            <span class="cta-i">🎯</span> Start VibeMatch
          </router-link>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'FloatingNavbar',
  data() {
    return { showNav: false };
  },
  watch: {
    // Close drawer on route change
    $route() { this.closeNav(); },
    // Lock scroll when open
    showNav(val) {
      document.documentElement.style.overflow = val ? 'hidden' : '';
    }
  },
  mounted() {
    window.addEventListener('keydown', this.onKey);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKey);
    document.documentElement.style.overflow = '';
  },
  methods: {
    toggleNav() { this.showNav = !this.showNav; },
    closeNav() { this.showNav = false; },
    onKey(e) { if (e.key === 'Escape') this.closeNav(); },
    goQuick(filter, value) {
      this.$router.push({ name: 'CategoryDirectory', query: { filter, value } });
      this.closeNav();
    }
  }
};
</script>

<style scoped>
/* ===== Tokens (match Home.vue vibe) ===== */
:root {
  --bg1: #FFF9F6;
  --bg2: #FFEFE7;
  --accent: #C8553D;
  --accent-2: #F28F3B;
  --apricot: #FFD5C2;
  --border: rgba(200,85,61,0.14);
  --text: #333;
}

/* Apply global font inside this component */
.nav-root,
.drawer,
.nav-link,
.brand,
.quick-title,
.chip,
.cta {
  font-family: "Special Gothic Expanded One", sans-serif;
}

/* ===== Floating Action Button ===== */
.fab {
  position: fixed;
  top: 1.25rem;
  left: 1.25rem;
  z-index: 1100;
  width: 44px; height: 44px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent-2), var(--accent));
  color: #fff;
  border: 1px solid rgba(255,255,255,0.35);
  box-shadow: 0 10px 22px rgba(0,0,0,0.18);
  display: grid; place-items: center;
  cursor: pointer;
  transition: transform .15s ease, box-shadow .15s ease;
}
.fab:hover { transform: translateY(-1px); box-shadow: 0 14px 28px rgba(0,0,0,0.22); }

/* Hamburger/X morph */
.fab-icon,
.fab-icon::before,
.fab-icon::after {
  content: "";
  display: block;
  width: 18px; height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: transform .25s ease, opacity .25s ease;
  position: relative;
}
.fab-icon::before { position: absolute; top: -6px; }
.fab-icon::after  { position: absolute; top: 6px; }
.fab-icon.open    { background: transparent; }
.fab-icon.open::before { transform: translateY(6px) rotate(45deg); }
.fab-icon.open::after  { transform: translateY(-6px) rotate(-45deg); }

/* ===== Backdrop ===== */
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.backdrop {
  position: fixed; inset: 0;
  z-index: 1080;
  background: rgba(0,0,0,0.32);
  backdrop-filter: blur(2px);
}

/* ===== Drawer ===== */
.slide-enter-active, .slide-leave-active { transition: transform .28s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-110%); }

.drawer {
  position: fixed; top: 0; left: 0; bottom: 0;
  width: min(92vw, 360px);
  z-index: 1090;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background: linear-gradient(135deg, var(--bg1), var(--bg2));
  border-right: 1px solid var(--border);
  box-shadow: 8px 0 28px rgba(0,0,0,0.18);
}

/* Header */
.drawer-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid var(--border);
}
.brand {
  display: inline-flex; align-items: center; gap: .5rem;
  font-weight: 800; color: var(--accent); text-decoration: none;
  font-size: clamp(1.1rem, 2.5vw, 1.6rem);
}
.brand-badge {
  display: inline-grid; place-items: center;
  width: 28px; height: 28px; border-radius: 999px;
  background: var(--apricot); color: var(--accent);
  border: 1px solid var(--border);
}
.close-btn {
  border: none; background: #fff; color: var(--accent);
  width: 34px; height: 34px; border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  cursor: pointer; font-size: 20px; line-height: 1;
}

/* Nav */
.drawer-nav {
  display: flex; flex-direction: column;
  padding: 0.75rem 0.75rem;
  gap: 0.25rem;
  overflow: auto;
}
.nav-link {
  display: flex; align-items: center; gap: .6rem;
  padding: 0.7rem 0.65rem;
  border-radius: 12px;
  color: var(--text);
  text-decoration: none;
  transition: background .15s ease, transform .1s ease;
  border: 1px solid transparent;
  font-size: clamp(1rem, 2vw, 1.25rem);
}
.nav-link .i { width: 1.25rem; text-align: center; }
.nav-link:hover {
  background: #FFF5F0;
  border-color: var(--border);
  transform: translateX(2px);
}
.nav-link.router-link-active {
  background: var(--apricot);
  color: var(--accent);
  border-color: var(--apricot);
  font-weight: 800;
}

/* Quick picks */
.drawer-quick {
  padding: 0.5rem 0.75rem 0.25rem;
}
.quick-title {
  margin: 0 0 .5rem 0; font-weight: 800; color: var(--accent);
  font-size: clamp(0.9rem, 1.8vw, 1.05rem);
}
.chips { display: flex; flex-wrap: wrap; gap: .5rem; }
.chip {
  border: 1px solid var(--border);
  background: #fff7f2;
  color: var(--accent);
  padding: .35rem .6rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: clamp(0.8rem, 1.6vw, 0.95rem);
  cursor: pointer;
}
.chip:hover { background: var(--apricot); }

/* Footer CTA */
.drawer-footer {
  border-top: 1px solid var(--border);
  padding: 0.75rem;
  background: #fff;
}
.cta {
  display: inline-flex; align-items: center; gap: .5rem;
  background: linear-gradient(135deg, var(--accent-2), var(--accent));
  color: #fff; text-decoration: none;
  padding: .6rem .85rem; border-radius: 12px;
  box-shadow: 0 10px 20px rgba(200,85,61,0.22);
  font-weight: 800;
  font-size: clamp(0.95rem, 2vw, 1.1rem);
}
.cta-i { font-size: 1.1rem; }

/* Wider screens */
@media (min-width: 1024px) {
  .fab { top: 1rem; left: 1rem; }
}
</style>

