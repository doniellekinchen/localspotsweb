<template>
  <section id="weather" class="weather-section">
    <div class="weather-wrap">
      <!-- Weather Summary -->
      <div class="weather-hero">
        <div class="wx-left">
          <div class="wx-emoji">
            <span v-if="weather?.isRain">☔</span>
            <span v-else-if="weather?.isSunny">☀️</span>
            <span v-else>🌤</span>
          </div>
          <div class="wx-meta">
            <h3 class="wx-title">Today in ATL</h3>
            <p class="wx-condition">{{ weather?.condition || 'Loading…' }}</p>
          </div>
        </div>

        <div class="wx-right" v-if="weather">
          <div class="wx-temp">{{ weather.temp }}°F</div>
          <span
            class="wx-chip"
            :class="{
              rain: weather.isRain,
              sun: weather.isSunny,
              mixed: !weather.isRain && !weather.isSunny
            }"
          >
            <template v-if="weather.isRain">Cozy indoor picks</template>
            <template v-else-if="weather.isSunny">Perfect for outdoors</template>
            <template v-else>Mix & match vibes</template>
          </span>
        </div>

        <div class="wx-right" v-else>
          <span class="wx-chip mixed">Fetching weather…</span>
        </div>
      </div>

      <!-- Picks -->
      <div class="picks-header">
        <h4 class="picks-title">Today’s Picks</h4>
        <p class="picks-sub">
          Tailored to the weather — <strong>{{ filteredListings.length }}</strong> spots you’ll love
        </p>
      </div>

      <div class="weather-picks">
        <button class="scroll-btn round left" @click="scrollLeft" aria-label="Scroll left">‹</button>

        <div class="scroll-viewport">
          <div class="scroll-container" ref="scrollBox">
            <router-link
              v-for="listing in filteredListings"
              :key="listing.id"
              :to="{ name: 'ListingDetails', params: { id: listing.id } }"
              class="scroll-card"
            >
              <div class="img-wrap">
                <img :src="listing.image || placeholderImage" :alt="listing.name" />
              </div>
              <div class="card-info">
                <h4 class="card-name" :title="listing.name">{{ listing.name }}</h4>
                <p class="card-meta">
                  {{ Array.isArray(listing.vibe) ? listing.vibe.join(', ') : listing.vibe }}
                </p>
              </div>
            </router-link>
          </div>

          <!-- soft fade edges -->
          <div class="edge-mask left"></div>
          <div class="edge-mask right"></div>
        </div>

        <button class="scroll-btn round right" @click="scrollRight" aria-label="Scroll right">›</button>
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

      return listings
        .filter(item => {
          const locationType = (item["in or out"] || '').toLowerCase();
          if (isRain) {
            return locationType === 'in' || locationType === 'hybrid';
          } else {
            return locationType === 'out' || locationType === 'hybrid';
          }
        })
        .slice(0, 12);
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
      this.$refs.scrollBox.scrollBy({ left: -280, behavior: 'smooth' });
    },
    scrollRight() {
      this.$refs.scrollBox.scrollBy({ left: 280, behavior: 'smooth' });
    }
  }
}
</script>

<style scoped>
/* ===== Palette (match Home.vue) ===== */
:root {
  --bg1: #FFF9F6;
  --bg2: #FFEFE7;
  --text: #333;
  --muted: #666;
  --accent: #C8553D;   /* Jasper */
  --accent-2: #F28F3B; /* Tangerine */
  --apricot: #FFD5C2;  /* Apricot */
  --border: rgba(200,85,61,0.14);
}

.weather-section {
  background: linear-gradient(135deg, var(--bg1) 0%, var(--bg2) 100%);
  padding: 2.25rem 1.5rem;
}

.weather-wrap {
  max-width: 1200px;
  margin: 0 auto;
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.06);
  overflow: hidden;
  background: #fff;
  animation: fadeUp .8s ease-out both;
}

/* === Summary hero === */
.weather-hero {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1rem;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0)),
    radial-gradient(120% 120% at -10% -10%, rgba(200,85,61,0.08), transparent 50%);
  border-bottom: 1px solid var(--border);
}

.wx-left { display: flex; align-items: center; gap: 0.9rem; }
.wx-emoji { font-size: 2.1rem; }
.wx-meta { display: grid; gap: .15rem; }
.wx-title {
  margin: 0;
  font-family: "Special Gothic Expanded One", sans-serif;
  font-size: clamp(1.2rem, 2.2vw, 1.6rem);
  color: var(--accent);
}
.wx-condition {
  margin: 0; color: var(--muted); font-weight: 600; letter-spacing: .2px;
  font-size: .98rem;
}

.wx-right { display: flex; align-items: center; gap: .6rem; }
.wx-temp {
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  font-weight: 800;
  color: var(--accent);
}
.wx-chip {
  display: inline-flex; align-items: center;
  font-weight: 800;
  padding: .35rem .6rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  font-size: .9rem;
}
.wx-chip.sun   { background: #fff7f2; color: var(--accent); }
.wx-chip.rain  { background: #eef6ff; color: #2b6cb0; border-color: #cfe2ff; }
.wx-chip.mixed { background: #f6f6f6; color: #444; }

/* === Picks header === */
.picks-header {
  display: flex; align-items: baseline; justify-content: space-between;
  gap: .75rem; padding: .75rem 1rem 0.25rem;
}
.picks-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--accent);
}
.picks-sub {
  margin: 0; color: var(--muted); font-size: .95rem;
}

/* === Carousel === */
.weather-picks {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: .5rem 0 1rem;
}

.scroll-viewport {
  position: relative;
  overflow: hidden;
}

.scroll-container {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 1rem 0.5rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.scroll-container::-webkit-scrollbar { display: none; }

/* Card: peekable width, consistent height */
.scroll-card {
  flex: 0 0 240px;
  scroll-snap-align: center;
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border);
  box-shadow: 0 8px 16px rgba(0,0,0,0.06);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.scroll-card:hover {
  transform: translateY(-3px);
  border-color: rgba(200,85,61,0.25);
  box-shadow: 0 12px 22px rgba(0,0,0,0.08);
}

.img-wrap {
  width: 100%; height: 140px; overflow: hidden;
  background: #f6f6f6;
}
.scroll-card img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}

.card-info {
  padding: 0.75rem 0.8rem 0.9rem;
}
.card-name {
  margin: 0 0 .25rem 0;
  font-weight: 800;
  font-size: 1rem;
  color: var(--text);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.card-meta {
  margin: 0; font-size: .9rem; color: #666;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* Edge masks (soft fade at sides) */
.edge-mask {
  position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none;
}
.edge-mask.left  { left: 0; background: linear-gradient(90deg, #fff, transparent); }
.edge-mask.right { right: 0; background: linear-gradient(270deg, #fff, transparent); }

/* Arrow buttons */
.scroll-btn.round {
  width: 36px; height: 36px; border-radius: 999px;
  background: #fff;
  border: 1px solid var(--border);
  color: var(--accent);
  box-shadow: 0 6px 14px rgba(0,0,0,0.08);
  cursor: pointer;
  display: grid; place-items: center;
  transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
}
.scroll-btn.round:hover {
  background: var(--apricot);
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(200,85,61,0.18);
}
.scroll-btn.left  { margin-left: .25rem; }
.scroll-btn.right { margin-right: .25rem; }

/* Fade-up entrance */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Responsive tweaks */
@media (max-width: 720px) {
  .weather-hero { grid-template-columns: 1fr; row-gap: .25rem; }
  .wx-right { justify-content: space-between; }
  .scroll-card { flex-basis: 220px; }
  .img-wrap { height: 128px; }
}
</style>
