<template>
  <section class="budget-trending-section">
    <h2 class="section-title">🔥 Trending For Your Budget</h2>

    <div v-for="(group, label) in groupedByPrice" :key="label" class="budget-group">
      <h3 class="budget-label">{{ budgetIcons[label] }} {{ formatLabel(label) }}</h3>
      <div class="card-row">
        <ListingCard
          v-for="item in group.slice(0, 3)"
          :key="item.id"
          :item="item"
        />
      </div>
    </div>
  </section>
</template>

<script>
import ListingCard from './ListingCard.vue';

export default {
  name: 'TrendingByBudget',
  components: { ListingCard },
  props: {
    listings: Array // full list of places passed in from parent
  },
  computed: {
    groupedByPrice() {
      const priceGroups = {
        '$': [],
        '$$': [],
        '$$$': [],
        '$-$$': [],
        '$$-$$$': []
      };

      this.listings.forEach(item => {
        if (priceGroups[item.price]) {
          priceGroups[item.price].push(item);
        }
      });

      return priceGroups;
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
      const map = {
        '$': 'Budget-Friendly',
        '$$': 'Mid-Tier Picks',
        '$$$': 'High-End Spots',
        '$-$$': 'Flexible Finds',
        '$$-$$$': 'Lux on a Budget'
      };
      return map[label] || label;
    }
  }
};
</script>

<style scoped>
.budget-trending-section {
  padding: 3rem 1rem;
  background: #fff9f6;
}

.section-title {
  font-size: 2rem;
  color: #c8553d;
  margin-bottom: 2rem;
  text-align: center;
}

.budget-group {
  margin-bottom: 3rem;
}

.budget-label {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #f28f3b;
}

.card-row {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
}
</style>
