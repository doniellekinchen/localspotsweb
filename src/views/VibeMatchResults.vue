<template>
  <section class="results" aria-labelledby="results-title">
    <header class="header">
      <div>
        <h1 id="results-title">🎯 Your Matches</h1>
        <p class="subtitle" v-if="!loading">
          Showing <strong>{{ filteredResults.length }}</strong>
          place{{ filteredResults.length !== 1 ? 's' : '' }}
          across <strong>{{ groupCount }}</strong>
          type{{ groupCount !== 1 ? 's' : '' }}.
        </p>
        <p class="subtitle" v-else>Finding places that match your vibe…</p>
      </div>
    </header>

    <div v-if="loading" class="loading">
      <div class="spinner" role="status" aria-label="Loading"></div>
      <p>Loading your perfect vibe matches...</p>
    </div>

    <div v-else>
      <!-- Map -->
      <div id="map" class="mapbox" aria-label="Map showing matched places"></div>

      <!-- Results -->
      <div v-if="filteredResults.length">
        <section
          v-for="(group, type) in sortedGroupedResults"
          :key="type"
          class="result-section"
        >
          <h2 class="place-type-heading">{{ formatPlaceType(type) }}</h2>

          <div class="result-grid">
            <div v-for="item in group" :key="item.id" class="card-wrapper">
              <router-link
                class="card"
                :to="{ name: 'ListingDetails', params: { id: item.id } }"
              >
                <div class="media">
                  <img
                    :src="item.image || placeholderImage"
                    :alt="item.name || 'Place image'"
                    loading="lazy"
                    decoding="async"
                  />
                  <span class="badge price" v-if="item.price">{{ item.price }}</span>
                </div>

                <div class="content">
                  <h3 class="name" :title="item.name">{{ item.name }}</h3>
                  <p class="meta">
                    {{ vibesText(item) }}
                  </p>
                  <p
                    class="description"
                    :title="(item.description || 'No description available.')"
                  >
                    {{ item.description || 'No description available.' }}
                  </p>

                  <div class="ai-tags" v-if="(item.aiTags && item.aiTags.length)">
                    <span class="chip" v-for="tag in item.aiTags" :key="tag">🧠 {{ tag }}</span>
                  </div>
                </div>
              </router-link>

              <button
                class="favorite-btn"
                :aria-pressed="isFavorite(item.id)"
                :title="isFavorite(item.id) ? 'Remove from favorites' : 'Add to favorites'"
                @click.stop="toggleFavorite(item)"
              >
                {{ isFavorite(item.id) ? '💖' : '🤍' }}
              </button>
            </div>
          </div>
        </section>
      </div>

      <div v-else class="no-results">
        <p>No matches found. Try a different vibe or budget.</p>
      </div>
    </div>
  </section>
</template>

<script>
import { supabase } from '../supabase';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken =
  'pk.eyJ1Ijoid2JpdGMtZG9uaSIsImEiOiJjbWJlcjFqbjEyaTFwMmlxNWRib3l1N2RsIn0.277_FxMEctR5auwLVoiSuw';

export default {
  name: 'VibeMatchResults',
  data() {
    return {
      filteredResults: [],
      placeholderImage: 'https://via.placeholder.com/600x320?text=WBITC',
      favorites: [],
      loading: true,
      map: null,
      mapMarkers: [],
    };
  },
  async created() {
    try {
      const { dateType, vibe, budget } = this.$route.query;

      // Parse query arrays safely
      const vibeArray = this.safeParseJSON(vibe, []);
      const budgetArray = this.safeParseJSON(budget, []);

      // Base query
      let query = supabase.from('atl_locations4').select('*');

      if (dateType) {
        query = query.contains('dateType', [String(dateType).toLowerCase()]);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filter in-app for vibe/budget + enrich with AI tags
      this.filteredResults = (data || [])
        .filter((item) => {
          const rawVibes = Array.isArray(item.vibe)
            ? item.vibe
            : typeof item.vibe === 'string'
            ? item.vibe.split(/[|,]\s*/).filter(Boolean)
            : [];
          const vibeList = rawVibes.map((v) => v.toLowerCase());
          const price = item.price || '';

          const vibeMatch =
            !vibeArray.length || vibeArray.some((v) => vibeList.includes(v.toLowerCase()));
          const budgetMatch = !budgetArray.length || budgetArray.includes(price);

          return vibeMatch && budgetMatch;
        })
        .map((item) => ({
          ...item,
          aiTags: this.generateAITags(item.description || ''),
        }));

      this.loading = false;
    } catch (err) {
      console.error('🚨 Data load failed:', err);
      this.loading = false;
    }
  },
  mounted() {
    // Favorites
    const stored = localStorage.getItem('favorites');
    this.favorites = stored ? JSON.parse(stored) : [];

    // Map init (after DOM ready)
    this.$nextTick(() => {
      this.initMap();
    });
  },
  beforeUnmount() {
    if (this.map) this.map.remove();
  },
  watch: {
    // Refresh markers whenever data becomes available/changes
    filteredResults() {
      this.$nextTick(() => {
        if (this.map && this.map.isStyleLoaded()) {
          this.refreshMapMarkers();
        } else if (this.map) {
          this.map.on('load', this.refreshMapMarkers);
        }
      });
    },
  },
  computed: {
    groupedResults() {
      const groups = {};
      this.filteredResults.forEach((item) => {
        const type = item.placeType || 'Other';
        (groups[type] = groups[type] || []).push(item);
      });
      return groups;
    },
    sortedGroupedResults() {
      const entries = Object.entries(this.groupedResults);
      entries.sort((a, b) => a[0].localeCompare(b[0]));
      return Object.fromEntries(entries);
    },
    groupCount() {
      return Object.keys(this.groupedResults).length;
    },
  },
  methods: {
    // --- UI helpers ---
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
      const key = String(type || 'Other').toLowerCase();
      return `${icons[key] || '📍'} ${type}`;
    },
    vibesText(item) {
      const v =
        Array.isArray(item.vibe)
          ? item.vibe
          : typeof item.vibe === 'string'
          ? item.vibe.split(/[|,]\s*/).filter(Boolean)
          : [];
      return (v.length ? v : ['vibe unknown']).join(', ');
    },

    // --- Favorites ---
    toggleFavorite(item) {
      const idx = this.favorites.indexOf(item.id);
      if (idx > -1) this.favorites.splice(idx, 1);
      else this.favorites.push(item.id);
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
    isFavorite(id) {
      return this.favorites.includes(id);
    },

    // --- Map ---
    initMap() {
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-84.388, 33.749], // Atlanta fallback
        zoom: 11,
      });

      this.map.on('load', () => this.refreshMapMarkers());
    },
    refreshMapMarkers() {
      if (!this.map) return;

      // Remove existing markers
      this.mapMarkers.forEach((m) => m.remove());
      this.mapMarkers = [];

      const bounds = new mapboxgl.LngLatBounds();
      let hasBounds = false;

      this.filteredResults.forEach((item) => {
        if (!item.latitude || !item.longitude) return;

        const lng = parseFloat(item.longitude);
        const lat = parseFloat(item.latitude);
        if (Number.isFinite(lng) && Number.isFinite(lat)) {
          const marker = new mapboxgl.Marker({ color: '#e63946' })
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup({ offset: 16 }).setText(item.name || 'Place'))
            .addTo(this.map);

          this.mapMarkers.push(marker);
          bounds.extend([lng, lat]);
          hasBounds = true;
        }
      });

      if (hasBounds) {
        // Fit map to markers
        this.map.fitBounds(bounds, { padding: 60, maxZoom: 14, duration: 600 });
      } else {
        // Default ATL center
        this.map.setCenter([-84.388, 33.749]);
        this.map.setZoom(11);
      }
    },

    // --- Misc ---
    generateAITags(description) {
      const text = String(description || '').toLowerCase();
      const keywords = {
        romantic: ['wine', 'candle', 'date', 'romantic'],
        active: ['hike', 'games', 'play', 'sports', 'tournament'],
        artsy: ['art', 'paint', 'gallery', 'studio'],
        chill: ['relax', 'quiet', 'cozy', 'peaceful'],
        social: ['friends', 'group', 'bar', 'outdoor'],
        foodie: ['menu', 'eat', 'dish', 'chef', 'restaurant', 'cuisine'],
      };
      const tags = Object.entries(keywords)
        .filter(([, triggers]) => triggers.some((w) => text.includes(w)))
        .map(([tag]) => tag);
      return tags.length ? tags : ['vibe unknown'];
    },
    safeParseJSON(raw, fallback) {
      try {
        const v = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return Array.isArray(v) ? v : fallback;
      } catch {
        return fallback;
      }
    },
  },
};
</script>

<style scoped>
/* Keep your font */
.results {
  --bg: #fffaf6;
  --text: #333;
  --muted: #666;
  --muted-2: #999;
  --accent: #c8553d;
  --chip-bg: #fff1ec;
  --border: rgba(0,0,0,0.08);

  padding: 2.5rem 2rem;
  background: var(--bg);
  font-family: "Special Gothic Expanded One", sans-serif;
  color: var(--text);
}

/* Header */
.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.results h1 {
  font-size: 2.2rem;
  line-height: 1.15;
  color: var(--accent);
  margin: 0;
}
.subtitle {
  font-size: 1rem;
  color: var(--muted);
  margin-top: 0.25rem;
}

/* Map */
.mapbox {
  height: 340px;
  border-radius: 16px;
  margin: 1.25rem 0 2.25rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
  border: 1px solid var(--border);
  overflow: hidden;
}

/* Section */
.result-section {
  margin-bottom: 2.25rem;
}
.place-type-heading {
  font-size: 1.35rem;
  color: var(--accent);
  margin-bottom: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Grid + Card */
.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}
.card-wrapper { position: relative; }

.card {
  display: grid;
  grid-template-rows: auto 1fr;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid var(--border);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 22px rgba(0,0,0,0.12);
}

.media {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16/9;
  background: #f5f5f5;
}
.card img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}
.badge.price {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #fff;
  color: var(--accent);
  padding: 0.3rem 0.55rem;
  font-weight: 700;
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid var(--border);
}

.content { padding: 0.85rem 0.95rem 1rem; }
.name {
  font-size: 1.1rem;
  margin: 0 0 0.25rem;
  color: var(--text);
  line-height: 1.25;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.meta {
  font-size: 0.92rem;
  color: var(--muted);
  margin: 0 0 0.5rem;
  min-height: 1.2em;
}

/* Multi-line clamp for description */
.description {
  font-size: 0.92rem;
  color: #555;
  margin: 0 0 0.6rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ai-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: var(--chip-bg);
  color: var(--accent);
  border-radius: 999px;
  font-size: 0.78rem;
  border: 1px solid var(--border);
}

/* Favorite */
.favorite-btn {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 999px;
  width: 40px; height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  display: grid; place-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.favorite-btn:hover { transform: scale(1.07); }

/* Empty / Loading */
.no-results {
  margin-top: 2.5rem;
  text-align: center;
  font-style: italic;
  color: #888;
}
.loading {
  display: grid;
  place-items: center;
  gap: 1rem;
  padding: 2rem 0;
}
.spinner {
  width: 42px; height: 42px;
  border: 4px solid #eee; border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Responsive tweaks */
@media (max-width: 640px) {
  .results { padding: 1.75rem 1rem; }
  .results h1 { font-size: 1.9rem; }
  .mapbox { height: 300px; }
}
</style>
