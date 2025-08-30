<template>
  <div class="explore-card" @click="goToCategory">
    <div class="emoji">{{ emoji }}</div>
    <p class="label">{{ label }}</p>
  </div>
</template>

<script>
export default {
  name: 'ExploreCard',
  props: ['label', 'category'],
  computed: {
    emoji() {
      const map = {
        // vibes
        foodie: '🍽', chill: '😌', trendy: '🕶', artsy: '🎨', active: '🏃‍♀️',
        romantic: '💘', nature: '🌿', historic: '🏛', luxury: '💎', quirky: '🤪',
        social: '🥂', quiet: '🤫', sporty: '🏈', cultural: '🧠', 'hidden gem': '🕵️‍♀️',

        // date types
        solo: '🧍‍♀️', 'date night': '❤️', friends: '👯‍♀️', family: '👨‍👩‍👧‍👦',
        'first date': '💞', 'second date': '💑', 'group outing': '👯‍♂️',
        tourists: '🧳', locals: '🏡', 'late night': '🌙',

        // fallback
        default: '✨'
      };
      const key = this.label.toLowerCase();
      return map[key] || map.default;
    }
  },
  methods: {
    goToCategory() {
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
.explore-card {
  background: #FFD5C2;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  color: #C8553D;
  font-family: "Special Gothic Expanded One", sans-serif;
}

.explore-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.emoji {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.label {
  font-size: 1rem;
  font-weight: 600;
}
</style>