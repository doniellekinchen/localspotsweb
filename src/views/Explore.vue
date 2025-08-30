<template>
  <div class="explore-page">
    <!-- Vibes Section -->
    <section class="explore-section">
      <h2 class="section-title">✨ Explore by Vibe</h2>
      <div class="grid-group">
        <div
          v-for="vibe in vibes"
          :key="vibe"
          class="category-card-alt"
          @click="goToCategory('vibe', vibe)"
        >
          <div class="emoji">🌈</div>
          <div class="label">{{ vibe }}</div>
        </div>
      </div>
    </section>

    <!-- Date Types Section -->
    <section class="explore-section">
      <h2 class="section-title">❤️ Explore by Date Type</h2>
      <div class="grid-group">
        <div
          v-for="date in dateTypes"
          :key="date"
          class="category-card-alt"
          @click="goToCategory('dateType', date)"
        >
          <div class="emoji">🕒</div>
          <div class="label">{{ date }}</div>
        </div>
      </div>
    </section>

    <!-- Place Types Section -->
    <section class="explore-section">
      <h2 class="section-title">📍 Explore by Place Type</h2>
      <div class="grid-group">
        <div
          v-for="place in placeTypes"
          :key="place"
          class="category-card-alt"
          @click="goToCategory('placeType', place)"
        >
          <div class="emoji">🏠</div>
          <div class="label">{{ place }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Explore',
  data() {
   return {
  vibes: [
    'Active', 'Artsy', 'Chill', 'Cultural', 'Foodie', 'Hidden gem',
    'Historic', 'Luxury', 'Nature', 'Quiet', 'Quirky', 'Romantic',
    'Social', 'Sporty', 'Trendy'
  ],
  dateTypes: [
    'Solo', 'Date night', 'Friends', 'Family', 'First date',
    'Second date', 'Group outing', 'Tourists', 'Locals', 'Late night'
  ],
  placeTypes: [
    'arcade', 'art gallery', 'artesian market', 'arts and culture',
    'bar', 'beach', 'bike path', 'book fair', 'bookstore',
    'boutique', 'board game Café', 'botanical garden', 'brewery',
    'Café', 'cinema', 'club', 'comedy club', 'cultural center',
    'dance class', 'dessert spot', 'escape room', 'farmers market',
    'flea market', 'fitness studio', 'food hall', 'food truck',
    'game night spot', 'garden', 'historic site', 'hobby spot',
    'hookah lounge', 'lake', 'live music venue', 'lounge',
    'mediation studio', 'mini golf', 'museum', 'outdoor market',
    'painting class', 'park', 'picnic spot', 'pop-up shop',
    'pottery studio', 'restaurant', 'retail', 'rooftop', 'spa',
    'sports and rec', 'street art walk', 'theater', 'trail',
    'trivia night venue', 'vintage shop', 'wine bar', 'zoo'
  ]
};

  },
  methods: {
    goToCategory(filter, value) {
      this.$router.push({
        name: 'CategoryDirectory',
        query: { filter, value }
      });
    }
  }
};
</script>

<style scoped>
.explore-page {
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #fcebe6 0%, #fff 50%, #f9f2f0 100%);
  min-height: 100vh;
  box-sizing: border-box;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #C8553D;
  margin-bottom: 1rem;
  text-align: left;
  padding-left: 0.5rem;
}

.explore-section {
  margin-bottom: 3.5rem;
}

/* Grid Group Styling */
.grid-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

/* Card Style */
.category-card-alt {
  background: white;
  border-radius: 16px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.category-card-alt:hover {
  background: #fff5f0;
  transform: translateY(-3px);
}

.category-card-alt .emoji {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.category-card-alt .label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
}
</style>
