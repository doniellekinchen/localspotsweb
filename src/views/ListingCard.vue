<template>
  <div class="listing-card">
    <router-link :to="{ name: 'ListingDetails', params: { id: listing.id } }" class="card-content">
      <img :src="listing.photos?.[0] || placeholderImage" alt="Listing image" />
      <div class="info">
        <h2>{{ listing.name }}</h2>
        <p class="price">{{ listing.price || '$$' }}</p>
        <p class="tags">{{ Array.isArray(listing.vibe) ? listing.vibe.join(', ') : listing.vibe }}</p>
      </div>
    </router-link>
    <button class="favorite-btn" @click.stop="toggleFavorite">
      {{ isFavorite(listing.id) ? '💖' : '🤍' }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'ListingCard',
  props: {
    listing: Object,
    favorites: Array
  },
  emits: ['update:favorites'],
  data() {
    return {
      placeholderImage: 'https://via.placeholder.com/400x200?text=WBITC'
    };
  },
  methods: {
    toggleFavorite() {
      const updated = [...this.favorites];
      const index = updated.indexOf(this.listing.id);
      if (index > -1) {
        updated.splice(index, 1);
      } else {
        updated.push(this.listing.id);
      }
      localStorage.setItem('favorites', JSON.stringify(updated));
      this.$emit('update:favorites', updated);
    },
    isFavorite(id) {
      return this.favorites.includes(id);
    }
  }
};
</script>

<style scoped>
.listing-card {
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  position: relative;
  background: #fff;
  transition: transform 0.2s ease;
}

.listing-card:hover {
  transform: translateY(-4px);
}

.card-content {
  display: block;
  text-decoration: none;
  color: inherit;
}

.card-content img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.info {
  padding: 1rem;
}

.info h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #C8553D;
}

.info .price {
  color: #588B8B;
  font-size: 1rem;
  margin-top: 0.25rem;
}

.info .tags {
  font-size: 0.85rem;
  color: #777;
  margin-top: 0.5rem;
}

.favorite-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: white;
  border: none;
  border-radius: 50%;
  padding: 0.4rem;
  font-size: 1.4rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  z-index: 2;
}
</style>
