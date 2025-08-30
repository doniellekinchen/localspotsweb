<template>
  <div class="listing-details">
    <div class="hero" :style="{ backgroundImage: `url(${listing.photos?.[0] || placeholderImage})` }">
      <button class="floating-favorite" @click="toggleFavorite(listing)">
        {{ isFavorite(listing.id) ? '💖' : '🤍' }}
      </button>
      <div class="hero-overlay">
        <h1>{{ listing.name }}</h1>
        <p class="hero-price">{{ listing.price || '$$' }}</p>
        <div class="hero-tags">
          <div v-if="listing.address" class="address">
            📍 {{ listing.address }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="listing.photos && listing.photos.length" class="photo-carousel">
      <swiper
        :slides-per-view="1"
        :space-between="10"
        :pagination="{ clickable: true }"
        :navigation="true"
        class="mySwiper"
      >
        <swiper-slide v-for="(photo, index) in listing.photos" :key="index">
          <img :src="photo" alt="Listing Photo" />
        </swiper-slide>
      </swiper>
    </div>

    <div class="details-tags">
      <h3>💡 Vibes It Gives</h3>
      <div class="tags">
        <span v-for="tag in listing.vibe" :key="tag" class="tag">{{ tag }}</span>
      </div>

      <h3>🎯 Perfect For</h3>
      <div class="tags">
        <span v-for="type in listing.dateType" :key="type" class="tag">{{ type }}</span>
      </div>

      <h3>📌 Things to Know</h3>
      <div class="tags">
        <span v-for="(tag, index) in listing.tags" :key="index" class="tag">🔸 {{ tag }}</span>
      </div>
    </div>

    <p class="description">{{ listing.description || 'No description available.' }}</p>

    <div class="map-section" v-if="listing.latitude && listing.longitude">
      <h3>📍 Find It on the Map</h3>
      <div id="detail-map" class="detail-map"></div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase';
import mapboxgl from 'mapbox-gl';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

mapboxgl.accessToken = 'your_mapbox_token_here';

export default {
  name: 'ListingDetails',
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      listing: {},
      placeholderImage: 'https://via.placeholder.com/800x400?text=WBITC',
      favorites: []
    };
  },
  async created() {
    const id = this.$route.params.id;

    const { data, error } = await supabase
      .from('atl_locations4')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase fetch failed:', error.message);
      this.listing = {};
      return;
    }

    // Normalize array-like fields
    const fixArray = (field) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return field.split(',').map(x => x.trim());
        }
      }
      return Array.isArray(field) ? field : [];
    };

    data.vibe = fixArray(data.vibe);
    data.dateType = fixArray(data.dateType);
    data.tags = fixArray(data.tags);
    data.photos = fixArray(data.photos);

    this.listing = data;
  },
  mounted() {
    this.initMap();
    const stored = localStorage.getItem('favorites');
    this.favorites = stored ? JSON.parse(stored) : [];
  },
  methods: {
    toggleFavorite(item) {
      const index = this.favorites.indexOf(item.id);
      if (index > -1) {
        this.favorites.splice(index, 1);
      } else {
        this.favorites.push(item.id);
      }
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
    isFavorite(id) {
      return this.favorites.includes(id);
    },
    initMap() {
      if (this.listing.latitude && this.listing.longitude) {
        const map = new mapboxgl.Map({
          container: 'detail-map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [parseFloat(this.listing.longitude), parseFloat(this.listing.latitude)],
          zoom: 14
        });

        new mapboxgl.Marker()
          .setLngLat([parseFloat(this.listing.longitude), parseFloat(this.listing.latitude)])
          .setPopup(new mapboxgl.Popup().setText(this.listing.name))
          .addTo(map);
      }
    }
  }
};
</script>

<style scoped>
.listing-details {
  padding: 2rem;
  background: #fffaf7;
  font-family: "Special Gothic Expanded One", sans-serif;
}

.hero {
  position: relative;
  height: 320px;
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.hero-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
  position: absolute;
  bottom: 0;
  padding: 1.5rem;
  width: 100%;
}

.hero-overlay h1 {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.hero-price {
  font-size: 1.1rem;
  margin-top: 0.3rem;
  font-weight: 600;
  color: #ffd5c2;
}

.hero-tags .address {
  font-size: 0.9rem;
  margin-top: 0.5rem;
  color: #f0f0f0;
}

.floating-favorite {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  border: none;
  border-radius: 50%;
  padding: 0.6rem 0.75rem;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
  z-index: 10;
  transition: transform 0.2s ease;
}
.floating-favorite:hover {
  transform: scale(1.1);
}

.photo-carousel {
  margin: 2rem 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.mySwiper {
  width: 100%;
  height: 300px;
}

.mySwiper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.details-tags {
  margin-top: 2rem;
}

.details-tags h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #c8553d;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tag {
  background: #ffd5c2;
  color: #c8553d;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.description {
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
  background: #fff;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.map-section {
  margin-top: 2.5rem;
}

.map-section h3 {
  font-size: 1.25rem;
  color: #c8553d;
  margin-bottom: 1rem;
}

.detail-map {
  width: 100%;
  height: 320px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

</style>
