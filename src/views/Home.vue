<template>
  <div class="homepage">
    <!-- Hero Section with Enhanced VibeMatch Focus -->
    <section id="vibematch" class="hero-section fade-in">
      <div class="video-wrapper">
        <video
          v-for="(video, index) in videos"
          :key="index"
          :src="video"
          autoplay
          muted
          loop
          playsinline
          class="bg-video"
          :class="{ active: index === videoIndex }"
        ></video>
        <div class="gradient-overlay"></div>
      </div>

      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-icon">✨</span>
          <span>Discover Atlanta's Best Spots</span>
        </div>
        
        <h1 class="hero-title">
          What's Your
          <span class="highlight">Vibe</span>
          Today?
        </h1>
        
        <p class="hero-description">
          Take our quick quiz to find the perfect spot based on your mood, 
          who you're with, and your budget. Tailored just for you.
        </p>
        
        <div class="cta-section">
          <button @click="startVibeMatch" class="primary-cta">
            <span class="cta-icon">🎯</span>
            Start VibeMatch
            <span class="cta-arrow">→</span>
          </button>
          <p class="cta-subtext">Takes less than 2 minutes</p>
        </div>

        <div class="scroll-indicator" @click="scrollToWeather">
          <div class="scroll-dot"></div>
          <span>Explore more</span>
        </div>
      </div>
    </section>

    <!-- Weather Section with Improved Layout -->
    <section id="weather" class="weather-section fade-in">
      <div class="weather-container">
        <div class="weather-header">
          <h2 class="weather-title">Today's Weather Picks</h2>
          <p class="weather-subtitle">{{ weatherText }}</p>
        </div>
        
        <div class="weather-content">
          <WeatherPicks :listings="weatherListings" />
        </div>
      </div>
    </section>

    <!-- Trending Section with Better Visual Hierarchy -->
    <section class="trending-section fade-in">
      <div class="trending-background"></div>
      <div class="trending-container">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-icon">🔥</span>
            Trending For Your Budget
          </h2>
          <p class="section-subtitle">Popular spots across all price ranges</p>
        </div>

        <div class="budget-groups">
          <div v-for="(group, label) in groupedByPrice" :key="label" class="budget-group">
            <div class="budget-header">
              <span class="budget-icon">{{ budgetIcons[label] }}</span>
              <h3 class="budget-title">{{ formatLabel(label) }}</h3>
              <span class="count-badge">{{ group.length }}</span>
            </div>
            
            <div class="trending-carousel">
              <div class="trending-grid">
                <div
                  v-for="item in group.slice(0, 4)"
                  :key="item.id"
                  class="trending-card"
                  :style="{ backgroundImage: `url(${item.image || placeholderImage})` }"
                >
                  <div v-if="item.isHot" class="hot-badge">
                    <span class="hot-icon">🔥</span>
                    Hot
                  </div>
                  <router-link 
                    :to="{ name: 'ListingDetails', params: { id: item.id } }" 
                    class="card-overlay"
                  >
                    <div class="card-content">
                      <h4 class="card-title">{{ item.name }}</h4>
                      <p class="card-vibe">{{ getVibeText(item) }}</p>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section with Improved Cards -->
    <section id="categories" class="categories-section fade-in">
      <div class="categories-container">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-icon">✨</span>
            Quick Browse
          </h2>
          <p class="section-subtitle">Jump straight to what you're looking for</p>
        </div>

        <div class="category-grid">
          <div class="category-card" @click="goToCategory('dateType', 'Solo')">
            <div class="category-icon">🧘‍♀️</div>
            <div class="category-content">
              <h3>Solo Vibes</h3>
              <p>Perfect for me-time adventures</p>
            </div>
            <div class="category-arrow">→</div>
          </div>

          <div class="category-card" @click="goToCategory('dateType', 'Date night')">
            <div class="category-icon">❤️</div>
            <div class="category-content">
              <h3>Date Night</h3>
              <p>Romantic spots for two</p>
            </div>
            <div class="category-arrow">→</div>
          </div>

          <div class="category-card" @click="goToCategory('dateType', 'Friends')">
            <div class="category-icon">💃</div>
            <div class="category-content">
              <h3>Friends Hangout</h3>
              <p>Fun group activities</p>
            </div>
            <div class="category-arrow">→</div>
          </div>

          <div class="category-card" @click="goToCategory('dateType', 'Family')">
            <div class="category-icon">👨‍👩‍👧‍👦</div>
            <div class="category-content">
              <h3>Family Fun</h3>
              <p>Activities for all ages</p>
            </div>
            <div class="category-arrow">→</div>
          </div>
        </div>

        <div class="explore-more">
          <router-link to="/explore" class="explore-link">
            <span>Explore All Categories</span>
            <span class="explore-arrow">→</span>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import WeatherPicks from '../components/WeatherPicks.vue';
import { supabase } from '../supabase';

export default {
  name: 'HomePage',
  components: {
    WeatherPicks
  },
  data() {
    return {
      videoIndex: 0,
      videos: [
        '/videos/fun1.mp4',
        '/videos/fun2.mp4',
        '/videos/fun3.mp4',
        '/videos/fun4.mp4',
        '/videos/fun5.mp4'
      ],
      featured: [],
      weatherListings: [],
      weather: {
        isSunny: true,
        isRain: false
      },
      placeholderImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
    };
  },
  computed: {
    weatherText() {
      if (!this.weather) return 'Loading weather data...';
      if (this.weather.isRain) return '☔ Rainy day vibes? We\'ve got cozy indoor spots you\\ll love.';
      if (this.weather.isSunny) return '☀️ Sunshine approved! Perfect weather for outdoor adventures.';
      return '🌤 Mixed weather calls for versatile picks — indoor and outdoor options ready!';
    },
    groupedByPrice() {
      const buckets = {
        '$': [],
        '$$': [],
        '$$$': [],
        '$-$$': [],
        '$$-$$$': []
      };
      this.featured.forEach(item => {
        if (buckets[item.price]) {
          buckets[item.price].push(item);
        }
      });
      // Only return groups that have items
      return Object.fromEntries(
        Object.entries(buckets).filter(([key, value]) => value.length > 0)
      );
    },
    budgetIcons() {
      return {
        '$': '💸',
        '$$': '💰',
        '$$$': '💎',
        '$-$$': '🎯',
        '$$-$$$': '⚖️'
      };
    }
  },
  methods: {
    formatLabel(label) {
      const friendly = {
        '$': 'Budget-Friendly',
        '$$': 'Mid-Range',
        '$$$': 'Premium',
        '$-$$': 'Flexible Budget',
        '$$-$$$': 'Upscale Value'
      };
      return friendly[label] || label;
    },
    getVibeText(item) {
      const vibes = Array.isArray(item.vibe) ? item.vibe : 
                   typeof item.vibe === 'string' ? item.vibe.split(',').map(v => v.trim()) : [];
      return vibes.slice(0, 2).join(', ') || 'Great vibes';
    },
    startVibeMatch() {
      this.$router.push('/vibematch');
    },
    goToCategory(filter, value) {
      this.$router.push({
        name: 'CategoryDirectory',
        query: { filter, value }
      });
    },
    scrollToWeather() {
      document.getElementById('weather').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    },
    rotateVideo() {
      this.videoIndex = (this.videoIndex + 1) % this.videos.length;
    },
    async fetchFeatured() {
      const { data, error } = await supabase
        .from('atl_locations4')
        .select('*')
        .limit(20);

      if (!error && data) {
        // Mix of hot items and random selection
        const hotItems = data.filter(item => item.isHot);
        const otherItems = data.filter(item => !item.isHot);
        const randomOthers = otherItems.sort(() => 0.5 - Math.random()).slice(0, 8);
        this.featured = [...hotItems, ...randomOthers];
      } else {
        console.error('Featured fetch failed:', error?.message);
      }
    },
    async fetchWeatherListings() {
      const { data, error } = await supabase
        .from('atl_locations4')
        .select('*')
        .limit(10);

      if (!error && data) {
        this.weatherListings = data;
      } else {
        console.error('Weather listings fetch failed:', error?.message);
      }
    }
  },
  mounted() {
    // Video rotation
    setInterval(this.rotateVideo, 8000);
    
    // Data fetching
    this.fetchFeatured();
    this.fetchWeatherListings();

    // Intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.1 });

    this.$nextTick(() => {
      document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    });
  }
};
</script>

<style scoped>
/* Global Styles */
.homepage {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #ffffff;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 100vh;
  min-height: 600px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.bg-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
}

.bg-video.active {
  opacity: 1;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(200, 85, 61, 0.3) 50%,
    rgba(0, 0, 0, 0.5) 100%
  );
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 600px;
  padding: 2rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

.badge-icon {
  font-size: 1.1rem;
}

.hero-title {
  font-family: "Special Gothic Expanded One", sans-serif;
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: 600;
  line-height: 1.1;
  margin: 0 0 1.5rem 0;
  text-shadow: 2px 4px 20px rgba(0, 0, 0, 0.3);
}

.highlight {
  color: #FFD5C2;
  position: relative;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 0.1em;
  left: 0;
  right: 0;
  height: 0.15em;
  background: linear-gradient(90deg, #F28F3B, #FFD5C2);
  border-radius: 2px;
  opacity: 0.8;
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.cta-section {
  margin-bottom: 3rem;
}

.primary-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #F28F3B, #C8553D);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(242, 143, 59, 0.4);
  position: relative;
  overflow: hidden;
}

.primary-cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.primary-cta:hover::before {
  left: 100%;
}

.primary-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(242, 143, 59, 0.5);
}

.cta-icon {
  font-size: 1.2rem;
}

.cta-arrow {
  transition: transform 0.3s ease;
}

.primary-cta:hover .cta-arrow {
  transform: translateX(4px);
}

.cta-subtext {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.3s ease;
}

.scroll-indicator:hover {
  color: white;
}

.scroll-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: bounce 2s infinite;
}

.scroll-indicator span {
  font-size: 0.85rem;
  font-weight: 500;
}

/* Weather Section */
.weather-section {
  background: linear-gradient(135deg, #FFF9F6 0%, #FFEFE7 100%);
  padding: 4rem 0;
}

.weather-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.weather-header {
  text-align: center;
  margin-bottom: 3rem;
}

.weather-title {
  font-family: "Special Gothic Expanded One", sans-serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  color: #C8553D;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.weather-subtitle {
  font-size: 1.2rem;
  color: #588B8B;
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Trending Section */
.trending-section {
  position: relative;
  padding: 4rem 0;
  overflow: hidden;
}

.trending-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(200, 85, 61, 0.05) 0%,
    rgba(242, 143, 59, 0.08) 50%,
    rgba(255, 213, 194, 0.1) 100%
  );
  z-index: 0;
}

.trending-container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-family: "Special Gothic Expanded One", sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  color: #C8553D;
  margin: 0 0 0.75rem 0;
  font-weight: 600;
}

.title-icon {
  font-size: 0.9em;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.budget-groups {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.budget-group {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(200, 85, 61, 0.1);
}

.budget-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #FFF5F0;
}

.budget-icon {
  font-size: 1.8rem;
}

.budget-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.count-badge {
  background: #FFD5C2;
  color: #C8553D;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.trending-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.trending-card {
  position: relative;
  height: 200px;
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.trending-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.hot-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: linear-gradient(135deg, #ff6b6b, #ff5252);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  z-index: 2;
}

.hot-icon {
  font-size: 0.9rem;
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  text-decoration: none;
  padding: 2rem 1.5rem 1.5rem;
  transition: background 0.3s ease;
}

.card-overlay:hover {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
}

.card-content {
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.trending-card:hover .card-content {
  transform: translateY(-4px);
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.card-vibe {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

/* Categories Section */
.categories-section {
  background: white;
  padding: 4rem 0;
}

.categories-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: white;
  border: 2px solid #FFF5F0;
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 213, 194, 0.3), transparent);
  transition: left 0.5s ease;
}

.category-card:hover::before {
  left: 100%;
}

.category-card:hover {
  border-color: #FFD5C2;
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(200, 85, 61, 0.1);
}

.category-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.category-content {
  flex: 1;
  text-align: left;
}

.category-content h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.category-content p {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.category-arrow {
  font-size: 1.2rem;
  color: #C8553D;
  transition: transform 0.3s ease;
}

.category-card:hover .category-arrow {
  transform: translateX(4px);
}

.explore-more {
  text-align: center;
}

.explore-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #C8553D;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid #FFD5C2;
  border-radius: 999px;
  transition: all 0.3s ease;
}

.explore-link:hover {
  background: #FFD5C2;
  transform: translateY(-2px);
}

.explore-arrow {
  transition: transform 0.3s ease;
}

.explore-link:hover .explore-arrow {
  transform: translateX(4px);
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
  60% { transform: translateY(-4px); }
}

.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.fade-in.show {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    padding: 1.5rem;
  }

  .hero-description {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .primary-cta {
    padding: 0.9rem 2rem;
    font-size: 1rem;
  }

  .weather-container,
  .trending-container,
  .categories-container {
    padding: 0 1.5rem;
  }

  .category-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .category-card {
    padding: 1.25rem;
  }

  .budget-group {
    padding: 1.5rem;
  }

  .trending-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .budget-header {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    min-height: 500px;
  }

  .category-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .category-content {
    text-align: center;
  }

  .trending-grid {
    grid-template-columns: 1fr;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .bg-video,
  .fade-in,
  .primary-cta,
  .category-card,
  .trending-card {
    transition: none;
  }
  
  .hero-badge,
  .scroll-dot {
    animation: none;
  }
}

/* Focus states for keyboard navigation */
.primary-cta:focus,
.category-card:focus,
.explore-link:focus {
  outline: 3px solid #FFD5C2;
  outline-offset: 2px;
}
</style>