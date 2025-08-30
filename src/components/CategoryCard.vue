<template>
  <div class="category-card" :class="{ disabled: comingSoon }" @click="handleClick">
    <div class="icon">{{ icon }}</div>
    <h3>{{ title }}</h3>
    <div v-if="comingSoon" class="coming-soon">Coming Soon</div>
  </div>
</template>

<script>
export default {
  name: 'CategoryCard',
  props: {
  title: String,
  label: String,    // e.g. 'Solo'
  category: String  // e.g. 'dateType'
},
  computed: {
    icon() {
      const icons = {
        'Solo Vibes': '🧘‍♀️',
        'Date Night': '❤️',
        "Girls' Night Out": '💃',
        'Family Fun': '👨‍👩‍👧‍👦'
      };
      return icons[this.title] || '✨';
    },
    comingSoon() {
      return this.title === "Girls' Night Out";
    },
    dateTypeValue() {
      // Translation table for real values Supabase is using
      return {
        'Solo Vibes': 'Solo',
        'Date Night': 'Date night',
        'Family Fun': 'Family'
      }[this.title];
    }
  },
  methods: {
  handleClick() {
    if (this.comingSoon) return; // BLOCK THE NONSENSE

    this.$router.push({
      name: 'CategoryDirectory',
      query: {
        filter: this.category,
        value: this.label
      }
    });
  }
}

};
</script>


<style scoped>
.category-card {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.category-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.coming-soon {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #FFD166;
  color: #333;
  font-weight: bold;
  font-size: 0.75rem;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
</style>
