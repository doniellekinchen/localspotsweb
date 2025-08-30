<template>
  <div class="category-directory">
    <h1 class="category-title">{{ title }}</h1>

    <div v-if="loading" class="loading">
      <p>Loading listings...</p>
      <div class="spinner"></div>
    </div>

    <div v-else>
      <div v-if="filteredListings.length">
        <div v-for="(group, type) in groupedListings" :key="type" class="result-section">
          <h2 class="place-type-heading">{{ formatPlaceType(type) }}</h2>
          <div class="result-grid">
            <div v-for="item in group" :key="item.id" class="card-wrapper">
              <router-link :to="{ name: 'ListingDetails', params: { id: item.id } }" class="card">
                <img :src="item.photos?.[0] || placeholderImage" alt="Listing Image" />
                <h2>{{ item.name }}</h2>
                <p>{{ item.price || '$$' }} · {{ item.vibe?.join(', ') }}</p>
                <p class="description">{{ item.description || 'No description available.' }}</p>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-results">
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
      return this.listings.filter(item => {
        const field = item[this.filter];
        if (Array.isArray(field)) {
          return field.map(x => x.toLowerCase()).includes(this.value.toLowerCase());
        }
        return String(field).toLowerCase() === this.value.toLowerCase();
      });
    },
    groupedListings() {
      const groups = {};
      this.filteredListings.forEach(item => {
        const type = item.placeType || 'Other';
        if (!groups[type]) groups[type] = [];
        groups[type].push(item);
      });
      return groups;
    }
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

    // Normalize array fields
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

    this.listings = data.map(item => {
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
        'art gallery': '🎨'
      };
      return `${icons[type.toLowerCase()] || '📍'} ${type}`;
    }
  }
};
</script>

<style scoped>
.category-directory {
  padding: 2rem;
  background-color: #fffdfc;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
}

.category-title {
  font-size: 2.5rem;
  color: #C8553D;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: bold;
}

.loading {
  text-align: center;
  margin-top: 4rem;
  color: #888;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 4px solid #eee;
  border-top-color: #C8553D;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 1rem auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.result-section {
  margin-bottom: 3rem;
}

.place-type-heading {
  font-size: 1.6rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  border-left: 6px solid #F28F3B;
  padding-left: 0.75rem;
}

.result-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.card-wrapper {
  flex: 1 1 280px;
}

.card {
  display: block;
  background: #fff;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  text-decoration: none;
  color: #222;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.08);
}

.card img {
  width: 100%;
  height: 170px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 0.75rem;
}

.card h2 {
  font-size: 1.15rem;
  margin-bottom: 0.3rem;
  font-weight: 600;
  color: #C8553D;
}

.card p {
  margin: 0.25rem 0;
  font-size: 0.95rem;
  color: #555;
}

.description {
  font-size: 0.85rem;
  color: #777;
  margin-top: 0.4rem;
}

.no-results {
  text-align: center;
  margin-top: 3rem;
  font-size: 1rem;
  color: #777;
}

.card img {
  transition: filter 0.3s ease;
}
.card:hover img {
  filter: brightness(1.05) saturate(1.2);
}

</style>
