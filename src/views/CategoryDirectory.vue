<template>
  <div class="category-directory">
    <h1 class="category-title fade-in">{{ title }}</h1>

    <div v-if="loading" class="loading fade-in">
      <p>Loading listings...</p>
      <div class="spinner"></div>
    </div>

    <div v-else>
      <div v-if="filteredListings.length">
        <div
          v-for="(group, type) in groupedListings"
          :key="type"
          class="result-section fade-in"
        >
          <h2 class="place-type-heading">{{ formatPlaceType(type) }}</h2>
          <div class="result-grid">
            <div
              v-for="item in group"
              :key="item.id"
              class="card-wrapper fade-in"
            >
              <router-link
                :to="{ name: 'ListingDetails', params: { id: item.id } }"
                class="card"
              >
                <img
                  :src="item.photos?.[0] || placeholderImage"
                  alt="Listing Image"
                />
                <h2>{{ item.name }}</h2>
                <p class="meta">
                  {{ item.price || '$$' }} ·
                  {{ item.vibe?.join(', ') || 'vibe unknown' }}
                </p>
                <p class="description">
                  {{ item.description || 'No description available.' }}
                </p>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-results fade-in">
        <p>No listings found for this category.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase';

export default {
  name: 'CategoryDirectory',
  data() {
    return {
      listings: [],
      placeholderImage: '/atlskyline.jpg',
      loading: true,
      filter: '',
      value: '',
    };
  },
  computed: {
    title() {
      return `${this.value.charAt(0).toUpperCase()}${this.value.slice(1)}`;
    },
    filteredListings() {
      return this.listings.filter((item) => {
        const field = item[this.filter];
        if (Array.isArray(field)) {
          return field.map((x) => x.toLowerCase()).includes(this.value.toLowerCase());
        }
        return String(field).toLowerCase() === this.value.toLowerCase();
      });
    },
    groupedListings() {
      const groups = {};
      this.filteredListings.forEach((item) => {
        const type = item.placeType || 'Other';
        if (!groups[type]) groups[type] = [];
        groups[type].push(item);
      });
      return groups;
    },
  },
  async created() {
    const { filter, value } = this.$route.query;
    this.filter = filter;
    this.value = value;

    const { data, error } = await supabase.from('atl_locations4').select('*');
    if (error) {
      console.error('Error loading listings:', error.message);
      this.loading = false;
      return;
    }

    const fixArray = (field) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return field.split(',').map((x) => x.trim());
        }
      }
      return Array.isArray(field) ? field : [];
    };

    this.listings = data.map((item) => {
      item.vibe = fixArray(item.vibe);
      item.dateType = fixArray(item.dateType);
      item.tags = fixArray(item.tags);
      item.photos = fixArray(item.photos);
      return item;
    });

    this.loading = false;
  },
  methods: {
    formatPlaceType(type) {
      const icons = {
        restaurant: '🍽',
        park: '🏞',
        spa: '💆',
        cafe: '☕',
        museum: '🏛',
        bar: '🍹',
        'art gallery': '🎨',
      };
      return `${icons[type.toLowerCase()] || '📍'} ${type}`;
    },
  },
};
</script>

<style scoped>
.category-directory {
  --bg1: #FFF9F6;
  --bg2: #FFEFE7;
  --accent: #C8553D;
  --accent-2: #F28F3B;
  --border: rgba(200, 85, 61, 0.14);

  min-height: 100vh;
  padding: 2.5rem 1.5rem;
  background: linear-gradient(135deg, var(--bg1) 0%, var(--bg2) 100%);
  font-family: "Special Gothic Expanded One", sans-serif;
  color: #333;
}

/* Page title */
.category-title {
  font-size: clamp(2rem, 5vw, 2.8rem);
  color: var(--accent);
  text-align: center;
  margin-bottom: 2.5rem;
  font-weight: 700;
}

/* Loading state */
.loading {
  text-align: center;
  margin-top: 4rem;
  color: #888;
}
.spinner {
  width: 32px;
  height: 32px;
  border: 4px solid #eee;
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 1rem auto;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Section grouping */
.result-section {
  max-width: 1200px;
  margin: 0 auto 3.5rem;
}

/* Place type headings */
.place-type-heading {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

/* ==== GRID FIXES ==== */
.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
  align-items: stretch;
}

/* Card wrapper */
.card-wrapper {
  min-width: 0;
  width: 100%;
  display: block;
}

/* Card itself */
.card {
  display: grid;
  grid-template-rows: auto auto auto 1fr;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 18px;
  padding: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.08);
}

/* Card image */
.card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 0.6rem;
  transition: filter 0.3s ease;
}
.card:hover img {
  filter: brightness(1.05) saturate(1.12);
}

/* Card text */
.card h2 {
  font-size: 1.1rem;
  margin: 0.2rem 0 0.15rem;
  font-weight: 700;
  color: var(--accent);
}
.card p {
  margin: 0.25rem 0;
  font-size: 0.92rem;
  color: #555;
}
.meta {
  font-size: 0.92rem;
  color: #666;
  margin-bottom: 0.35rem;
}
.description {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.4;
  margin-top: 0.2rem;
}

/* No results */
.no-results {
  text-align: center;
  margin-top: 3rem;
  font-size: 1rem;
  color: #777;
}

/* Responsive */
@media (max-width: 680px) {
  .result-grid {
    grid-template-columns: 1fr;
  }
  .card img {
    height: 160px;
  }
}
</style>
