<template>
  <div class="category-page">
    <h1 class="page-title">{{ title }}</h1>

    <div v-if="Object.keys(groupedListings).length">
      <div
        v-for="(group, type) in groupedListings"
        :key="type"
        class="group-section"
      >
        <h2 class="group-title">{{ formatPlaceType(type) }}</h2>
        <div class="listing-grid">
          <ListingCard
            v-for="listing in group"
            :key="listing.id"
            :listing="listing"
          />
        </div>
      </div>
    </div>

    <div v-else class="no-results">
      <p>No listings found for this category.</p>
    </div>
  </div>
</template>

<script>
import ListingCard from '../components/ListingCard.vue';
import { supabase } from '../supabase';

export default {
  name: 'CategoryPage',
  components: {
    ListingCard
  },
  data() {
    return {
      listings: [],
      title: ''
    };
  },
  computed: {
    groupedListings() {
      const groups = {};
      this.listings.forEach(item => {
        const type = item.placeType || 'Other';
        if (!groups[type]) groups[type] = [];
        groups[type].push(item);
      });
      return groups;
    }
  },
  async created() {
    const category = this.$route.params.name;
    this.title = category;

    const { data, error } = await supabase
      .from('atl_locations4')
      .select('*')
      .contains('vibe', [category])
      .order('name');

    if (error) {
      console.error('Failed to fetch listings:', error.message);
      return;
    }

    this.listings = data || [];
  },
  methods: {
    formatPlaceType(type) {
      const icons = {
        restaurant: '🍽',
        bar: '🍹',
        cafe: '☕',
        'art gallery': '🖼️',
        spa: '💆‍♀️',
        museum: '🏛️',
        park: '🏞️'
      };
      return `${icons[type.toLowerCase()] || '📍'} ${type}`;
    }
  }
};
</script>

<style scoped>
.category-page {
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #C8553D;
}

.group-section {
  margin-bottom: 3rem;
}

.group-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #C8553D;
}

.listing-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.no-results {
  font-style: italic;
  margin-top: 2rem;
  color: #666;
}
</style>
