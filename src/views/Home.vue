<template>
  <div class="homepage">
    <!-- Hero Section -->
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
        <div class="dark-overlay"></div>
      </div>

      <div class="hero-overlay">
        <h1 class="title">What's Your Vibe Today?</h1>
        <p>Start the quiz to find your perfect outing based on mood, weather, and budget.</p>
        <button @click="startVibeMatch">Start VibeMatch</button>
      </div>
    </section>

    <!-- Weather Picks Section -->
   <section id="weather" class="weather-fullscreen fade-in">
  <h1 class="weather-headline">Today’s Weather in ATL</h1>
  <div class="weather-inner">
    <!-- <h2 class="subtitle">🌦 Today’s Vibe Check</h2> -->
    <p class="weather-blurb">{{ weatherText }}</p>
    <WeatherPicks :listings="weatherListings" />
  </div>
</section>

    <!-- Featured Listings Section -->
<section class="section trending-section fade-in">
  <div class="trending-overlay"></div>
  <div class="trending-content">
    <h2 class="subtitle">🔥 Trending For Your Budget</h2>

    <div v-for="(group, label) in groupedByPrice" :key="label" class="budget-group">
      <h3 class="budget-label">{{ budgetIcons[label] }} {{ formatLabel(label) }}</h3>
      <div class="trending-grid">
        <div
          v-for="item in group.slice(0, 3)"
          :key="item.id"
          class="trending-card"
          :style="{ backgroundImage: `url(${item.image})` }"
        >
          <div v-if="item.isHot" class="hot-badge">🔥 Hot</div>
          <router-link :to="{ name: 'ListingDetails', params: { id: item.id } }" class="overlay">
            <span>{{ item.name }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</section>




    <!-- Categories -->
    <section id="categories" class="section fade-in">
      <h2 class="subtitle">✨ Explore by Category</h2>
      <div class="category-grid">
        <CategoryCard
  title="Solo Vibes"
  :label="'Solo'"
  :category="'dateType'"
/>
<CategoryCard
  title="Date Night"
  :label="'Date night'"
  :category="'dateType'"
/>
<CategoryCard
  title="Girls' Night Out"
  :label="'Friends'"  
  :category="'dateType'"
/>
<CategoryCard
  title="Family Fun"
  :label="'Family'"
  :category="'dateType'"
/>

      </div>
    </section>
  </div>
</template>

<script>
import VibeMatchQuiz from '../components/VibeMatchQuiz.vue';
import WeatherPicks from '../components/WeatherPicks.vue';
import CategoryCard from '../components/CategoryCard.vue';
import { supabase } from '../supabase';

export default {
  name: 'HomePage',
  components: {
    WeatherPicks,
    CategoryCard,
    VibeMatchQuiz
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
      }
    };
  },
  computed: {
    selectedVideo() {
      return this.videos[this.videoIndex];
    },
    weatherText() {
      if (!this.weather) return 'Loading weather data...';
      if (this.weather.isRain) return '☔ Rainy day vibes? We’ve got cozy spots you’ll love.';
      if (this.weather.isSunny) return '☀️ Sunshine approved! Let’s take it outside.';
      return '🌤 A little bit of everything — explore versatile picks!';
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
      return buckets;
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
        '$$': 'Mid-Tier Picks',
        '$$$': 'High-End Spots',
        '$-$$': 'Flexible Finds',
        '$$-$$$': 'Lux on a Budget'
      };
      return friendly[label] || label;
    },
    startVibeMatch() {
      this.$router.push('/vibematch');
    },
    rotateVideo() {
      this.videoIndex = (this.videoIndex + 1) % this.videos.length;
    },
    async fetchFeatured() {
      const { data, error } = await supabase
        .from('atl_locations4')
        .select('*')
        .eq('isHot', true)
        .limit(6);

      if (!error) {
        this.featured = data;
      } else {
        console.error('🔥 Featured fetch failed:', error.message);
      }
    },
    async fetchWeatherListings() {
      let tags = [];

      if (this.weather.isRain) tags = ['cozy', 'indoors'];
      else if (this.weather.isSunny) tags = ['outdoor', 'nature', 'park'];
      else tags = ['fun'];

      const { data, error } = await supabase
        .from('atl_locations4')
        .select('*')
        .contains('tags', tags)
        .limit(5);

      if (!error) {
        this.weatherListings = data;
      } else {
        console.error('🌦 Weather fetch failed:', error.message);
      }
    }
  },
  mounted() {
    // run video + data logic
    setInterval(this.rotateVideo, 10000);
    this.fetchFeatured();
    this.fetchWeatherListings();

    // set up intersection observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  }
};
</script>


<style scoped>
.homepage {
  padding: 0;
  margin: 0;
  font-family: 'Roboto', sans-serif;
  background-color: #FFFFFF;
}

/* Hero Section Styles */
.hero-section {
  position: relative;
  height: 100vh;
  overflow: hidden;
  text-align: center;
}

.video-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
    overflow: hidden;
}

.bg-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  z-index: 0;
}

.bg-video.active {
  opacity: 1;
  z-index: 1;
}

.dark-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.hero-overlay {
  position: relative;
  z-index: 2;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  color: white;
}

#vibematch {
  padding-top: 80px; /* Adjust if needed */
}

#vibematch .title {
   font-family: "Special Gothic Expanded One", sans-serif;
  font-weight: 600;
  font-style: normal;
  color: #C8553D;
  font-size: 5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 4px 10px rgba(0, 0, 0, 0.4); 
}

#vibematch p {
  color: #FFD5C2;
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto 2rem auto;
}

#vibematch button {
  background-color: #F28F3B;
  color: white;
  border: none;
  padding: 0.8rem 2.2rem;
  font-size: 1.1rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  display: inline-block;
  width: fit-content; /* 🟢 key fix */
  align-self: center; /* if inside a flex container */
}


#vibematch button:hover {
  background-color: #C8553D;
}

.section {
  margin: 4rem 2rem;
  text-align: center;
}

.debug-wrapper {
  outline: 2px dashed red;
  max-width: 100%;
}


.subtitle {
  font-family: "Special Gothic Expanded One", sans-serif;
  font-size: 2rem;
  color: #C8553D;
  margin-bottom: 1.5rem;
}

/* Category Cards */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: white;
  padding: 2rem 1rem;
  border-radius: 16px;
  font-size: 1.2rem;
  font-weight: bold;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-card span {
  margin-top: 0.5rem;
}

.category-card.solo {
  background-image: url('https://images.unsplash.com/photo-1549924231-f129b911e442');
}

.category-card.date {
  background-image: url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e');
}

.category-card.friends {
  background-image: url('https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e');
}

.category-card.family {
  background-image: url('https://images.unsplash.com/photo-1606041008023-472dfb5e5306');
}

/* Fade animation for video switching */
.fade-enter-active, .fade-leave-active {
  transition: 0.1ms ease-in-out;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.weather-fullscreen {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(rgba(255, 247, 242, 0.3), rgba(255, 239, 231, 0.3)),
              url('/softsky.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  padding: 3rem 1rem;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
    margin-bottom: 0;
  padding-bottom: 0;
}


.weather-headline {
  font-family: "Special Gothic Expanded One", sans-serif;
  font-size: 5rem;
  font-weight: 600;
  color: #C8553D;
  text-align: center;
  /* margin: 2rem auto 1rem; */
  margin-bottom: 0.5rem;
  text-shadow: 2px 4px 10px rgba(0, 0, 0, 0.15);
  width: 100%;
}

.weather-inner {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem; /* Add horizontal padding for small screens */
  box-sizing: border-box;
  /* outline: 1px solid lime;  */
  overflow-x: hidden;
}


.weather-fullscreen .subtitle {
  font-family: 'Bowlby One', cursive;
  font-size: 3rem;
  color: #C8553D;
  margin-bottom: 1rem;
}

.weather-blurb {
  font-size: 1.3rem;
  color: #588B8B;
  margin-top: 0;
  margin-bottom: 2rem;
}

.overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6);
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  font-size: 1.25rem;
  font-weight: bold;
  border-radius: inherit;
  text-align: center;
}

.trending-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.trending-card {
  position: relative;
  height: 280px;
  border-radius: 20px;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(200, 85, 61, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.trending-card:hover {
  transform: scale(1.04);
  box-shadow: 0 12px 28px rgba(200, 85, 61, 0.35);
}

.trending-card .overlay {
  background: linear-gradient(to top, rgba(97, 91, 91, 0.898), transparent);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 1rem;
  height: 100%;
  color: white;
  font-weight: bold;
  font-size: 1.4rem;
  text-align: center;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6);
  transition: background 0.3s ease;
}

.trending-section {
  position: relative;
  background: url('/atlskyline.jpg') no-repeat center center;
  background-size: cover;
  overflow: hidden;
  padding: 4rem 2rem;
  margin: 2rem 0;
  /* border-radius: 20px; */
  color: white;
    margin-top: 0;
  padding-top: 0;
}

.trending-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* adjust darkness here */
  z-index: 1;
  pointer-events: none;
}

.trending-content {
  position: relative;
  z-index: 2;
}


.hot-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #ff6b6b;
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: 0.65rem; /* This is the magic line */
  font-weight: bold;
  border-radius: 999px;
  z-index: 2;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}


@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@media (max-width: 600px) {
  .weather-headline {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .weather-blurb {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .weather-inner {
    padding: 1rem;
  }
}

.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.fade-in.show {
  opacity: 1;
  transform: translateY(0);
}

.budget-group {
  margin-bottom: 3rem;
}

.budget-label {
  font-size: 1.4rem;
  font-weight: bold;
  margin: 1.5rem 0 1rem;
  color: #f28f3b;
}

.trending-grid {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.trending-card {
  flex: 0 0 auto;
  width: 250px;
  height: 160px;
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  transition: transform 0.3s ease;
}

.trending-card:hover {
  transform: translateY(-4px) scale(1.02);
}

:deep(.hot-badge) {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #ff6b6b;
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: 0.65rem;
  font-weight: bold;
  border-radius: 999px;
  z-index: 2;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}



.overlay {
  position: absolute;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  color: white;
  width: 100%;
  text-align: center;
  padding: 0.5rem;
  font-weight: bold;
  text-decoration: none;
}

</style>