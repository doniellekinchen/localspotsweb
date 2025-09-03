<template>
  <div id="app">
    <NavBar /> <!-- 👈 Global navbar component -->
    <router-view /> <!-- All routed pages will display here -->
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue' // or wherever it’s stored

export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>

<style>
:root {
  --bg1:#FFF9F6; --bg2:#FFEFE7; --text:#333; --muted:#666; --muted-2:#8a8a8a;
  --accent:#C8553D; --accent-2:#F28F3B; --cyan:#588B8B; --apricot:#FFD5C2;
  --chip-bg:#FFF1EC; --border:rgba(200,85,61,0.14);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}


body {
  overflow-x: hidden;
  background: linear-gradient(135deg, #FFF9F6 0%, #FFEFE7 100%);
}

.homepage {
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
}


@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }

  .weather-headline {
    font-size: 2.5rem;
  }

  .hero-overlay {
    padding: 1rem;
  }

  .category-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
  }

  .category-card {
    font-size: 1rem;
    padding: 1.2rem 0.8rem;
  }

  .weather-blurb {
    font-size: 1.1rem;
    padding: 0 1rem;
  }

  .overlay {
    font-size: 1rem;
    padding: 0.5rem;
  }

  .section {
    margin: 2rem 1rem;
  }

  .weather-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .scroll-container {
    overflow-x: scroll;
    flex-wrap: nowrap;
  }
}

</style>
