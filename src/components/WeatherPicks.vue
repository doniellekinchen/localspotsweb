<template>
  <section id="weather" class="weather-section">
    <div class="weather-picks-box">
      <div v-if="weather" class="weather-summary">
        <div class="weather-info">
          <div class="weather-icon">
            <span v-if="weather.isRain">☔</span>
            <span v-else-if="weather.isSunny">☀️</span>
            <span v-else>🌤</span>
          </div>
          <div class="weather-text">
            <h3>Today's Weather in ATL</h3>
            <p class="condition">{{ weather.condition }}</p>
            <p class="temp">{{ weather.temp }}°F</p>
            <p class="vibe-message">
              <span v-if="weather.isRain">Let’s keep it cozy indoors.</span>
              <span v-else-if="weather.isSunny">Get out there and shine.</span>
              <span v-else>Vibes unclear. Explore freely.</span>
            </p>
          </div>
        </div>
      </div>
      <div v-else class="weather-summary">
        <p class="loading">Loading the vibes…</p>
      </div>

      <div class="weather-picks-carousel">
        <button class="scroll-btn left" @click="scrollLeft">‹</button>
        <div class="scroll-container" ref="scrollBox">
          <router-link
            v-for="listing in filteredListings"
            :key="listing.id"
            :to="{ name: 'ListingDetails', params: { id: listing.id } }"
            class="scroll-card"
          >
            <img :src="listing.image || placeholderImage" :alt="listing.name" />
            <div class="card-info">
              <h4>{{ listing.name }}</h4>
              <p>{{ listing.vibe }}</p>
            </div>
          </router-link>
        </div>
        <button class="scroll-btn right" @click="scrollRight">›</button>
      </div>
    </div>
  </section>
</template>


<script>
import listings from '../data/listings.json'

export default {
  name: 'WeatherPicks',
  data() {
    return {
      weather: null,
      placeholderImage: 'https://via.placeholder.com/200x120?text=WBITC',
    }
  },
  computed: {
filteredListings() {
  if (!this.weather) return [];

  const isRain = this.weather.isRain;

  return listings.filter(item => {
    const locationType = (item["in or out"] || '').toLowerCase();

    if (isRain) {
      return locationType === 'in' || locationType === 'hybrid';
    } else {
      return locationType === 'out' || locationType === 'hybrid';
    }
  }).slice(0, 10);
}
  },
mounted() {
  fetch('https://api.weatherapi.com/v1/current.json?key=f0c3fa38ac994d36a6d34534252705&q=Atlanta')
    .then(res => res.json())
    .then(data => {
      const condition = data.current.condition.text.toLowerCase();
      this.weather = {
        condition: data.current.condition.text,
        temp: data.current.temp_f,
        isRain: condition.includes('rain') || condition.includes('thunder'),
        isSunny: condition.includes('sun') || condition.includes('clear'),
      };
    })
    .catch(err => {
      console.error('Weather fetch error:', err);
      this.weather = {
        condition: 'Unavailable',
        temp: '--',
        isRain: false,
        isSunny: false
      };
    });
},

methods: {
  scrollLeft() {
    this.$refs.scrollBox.scrollBy({ left: -250, behavior: 'smooth' });
  },
  scrollRight() {
    this.$refs.scrollBox.scrollBy({ left: 250, behavior: 'smooth' });
  }
}


}
</script>

<style scoped>
.weather-section {
  background: linear-gradient(135deg, #FFF7F2, #FFEFE7);
  padding: 3rem 2rem;
  border-radius: 20px;
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.weather-summary {
  margin-bottom: 1.5rem;
  text-align: center;
}

.weather-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.weather-icon {
  font-size: 2.5rem;
}
.weather-text h3 {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}
.condition,
.temp {
  margin: 0.25rem 0;
}

.temp {
  font-size: 1.5rem;
  font-weight: 600;
}

.vibe-message {
  margin-top: 0.5rem;
  font-style: italic;
  color: #666;
}

.weather-picks-carousel {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden; /* Crucial to clip extra stuff */
}

.scroll-container {
  display: flex;
   scroll-snap-type: x mandatory;
  overflow-x: auto;
  width: 100%;
  gap: 0;
  padding: 1rem 0;
  scroll-behavior: smooth;
  scrollbar-width: none;
   -webkit-overflow-scrolling: touch;
}

.scroll-container::-webkit-scrollbar {
  display: none;
}

.scroll-card {
  min-width: 200px;
  flex: 0 0 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s;
  text-decoration: none;
  color: inherit;
    scroll-snap-align: center;
  flex: 0 0 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 1rem; /* optional, but avoids edge smushing */
  text-align: center;
}

.scroll-card:hover {
  transform: translateY(-3px);
}

.scroll-card img {
  width: 100%;
  height: 130px;
  object-fit: cover;
}

.card-info {
  padding: 0.75rem;
  text-align: left;
}

.scroll-btn {
  background: white;
  border: none;
  font-size: 2rem;
  padding: 0 0.5rem;
  cursor: pointer;
  z-index: 10;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  color: #C8553D;
}

.scroll-btn.left {
  left: 0;
}

.scroll-btn.right {
  right: 0;
}
</style>
