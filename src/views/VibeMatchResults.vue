<template>
  <section class="results fade-in" aria-labelledby="results-title">
    <header class="header fade-in">
      <div class="header-left">
        <h1 id="results-title" class="title">
          <span class="title-icon">🎯</span>
          Your Matches
        </h1>
        <p class="subtitle" v-if="!loading">
          Showing <strong>{{ filteredResults.length }}</strong>
          place{{ filteredResults.length !== 1 ? 's' : '' }}
          across <strong>{{ groupCount }}</strong>
          type{{ groupCount !== 1 ? 's' : '' }}. We are still updating with different places and vibes! Contact us if you know a place that should be here! 
        </p>
        <p class="subtitle" v-else>Finding places that match your vibe…</p>
      </div>
    </header>

    <div v-if="loading" class="loading fade-in">
      <div class="spinner" role="status" aria-label="Loading"></div>
      <p>Loading your perfect vibe matches...</p>
    </div>

    <div v-else class="results-body">
      
      <!-- Sticky Map + CTA -->
<div class="map-col">
  <div id="map" class="mapbox fade-in" aria-label="Map showing matched places"></div>

  <router-link class="fav-cta fade-in" :to="{ name: 'Favorites' }">
    💖 View Favorites
  </router-link>
</div>

      <!-- Results -->
      <div class="groups">
        <template v-if="filteredResults.length">
          <section
            v-for="(group, type) in sortedGroupedResults"
            :key="type"
            class="result-section fade-in"
          >
            <h2 class="place-type-heading">
              {{ formatPlaceType(type) }}
              <span class="count-badge">{{ group.length }}</span>
            </h2>

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
                    <p class="meta">{{ vibesText(item) }}</p>
                    <p class="description" :title="(item.description || 'No description available.')">
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
        </template>

        <div v-else class="no-results fade-in">
          <p>No matches found. Try a different vibe or budget.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { supabase } from '../supabase';
import mapboxgl from 'mapbox-gl';
import { useFavorites } from '../composables/useFavorites';

mapboxgl.accessToken =
  'pk.eyJ1Ijoid2JpdGMtZG9uaSIsImEiOiJjbWJlcjFqbjEyaTFwMmlxNWRib3l1N2RsIn0.277_FxMEctR5auwLVoiSuw';

export default {
  name: 'VibeMatchResults',
  data() {
    return {
      filteredResults: [],
      placeholderImage: 'https://via.placeholder.com/600x320?text=WBITC',
      loading: true,
      map: null,
      mapMarkers: [],
    };
  },

  async created() {
    this.favs = useFavorites();
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

     isFavorite(id) {
     return this.favs?.isFavorite(id);
   },
   toggleFavorite(item) {
     this.favs?.toggle(item.id);
   },
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
/* ===== Tokens aligned with Home.vue ===== */
:root {
  --bg1: #FFF9F6;
  --bg2: #FFEFE7;
  --text: #333;
  --muted: #666;
  --muted-2: #8a8a8a;
  --accent: #C8553D;   /* Jasper */
  --accent-2: #F28F3B; /* Tangerine */
  --cyan: #588B8B;     /* Dark Cyan */
  --apricot: #FFD5C2;  /* Apricot */
  --chip-bg: #FFF1EC;
  --border: rgba(200,85,61,0.14);
}

/* ===== Page wrapper ===== */
.results {
  position: relative;
  padding: 2.5rem 2rem;
  background: linear-gradient(135deg, var(--bg1) 0%, var(--bg2) 100%);
  color: var(--text);
  font-family: "Special Gothic Expanded One", sans-serif;
  overflow: hidden;
}

/* soft background blobs like Home.vue */
.results::before,
.results::after {
  content: "";
  position: absolute;
  pointer-events: none;
  filter: blur(12px);
}
.results::before {
  inset: -20% -10% auto auto;
  width: 340px; height: 340px;
  background: radial-gradient(ellipse at center, rgba(242,143,59,0.12), transparent 60%);
}
.results::after {
  left: -60px; bottom: -120px;
  width: 420px; height: 420px;
  background: radial-gradient(ellipse at center, rgba(200,85,61,0.10), transparent 60%);
  filter: blur(14px);
}

/* ===== Header ===== */
.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  position: relative;
  z-index: 1;
}
.title {
  display: flex; align-items: center; gap: .6rem;
  font-size: clamp(2.4rem, 5vw, 3.4rem);
  color: var(--accent);
  margin: 0;
  font-weight: 600;
  letter-spacing: .2px;
  text-shadow: 0 1px 0 rgba(255,255,255,.6);
}
.title-icon { font-size: .95em; }
.subtitle {
  font-size: 1.05rem;
  color: var(--cyan);
  margin: .35rem 0 0;
}

/* ===== Two-column body (sticky map + groups) ===== */
.results-body {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}
@media (max-width: 980px) {
  .results-body { grid-template-columns: 1fr; }
}

/* Map chrome */
.mapbox {
  height: 520px;
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow: 0 12px 30px rgba(0,0,0,.08);
  overflow: hidden;
  position: sticky;
  top: 1rem;
  background:
    linear-gradient(180deg, rgba(255,255,255,.6), rgba(255,255,255,0)) padding-box,
    radial-gradient(120% 120% at -10% -10%, rgba(200,85,61,.15), transparent 40%) border-box;
}
@media (max-width: 980px) {
  .mapbox { position: static; height: 360px; }
}

.map-col {
  display: grid;
  align-content: start;
  gap: 0.85rem;
}

/* Favorites CTA under the map */
.fav-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  padding: .75rem 1rem;
  border-radius: 12px;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;

  background: #fff;
  color: var(--accent);
  border: 1px solid var(--border);
  box-shadow: 0 8px 18px rgba(0,0,0,.06);

  transition: transform .15s ease, box-shadow .15s ease, background .15s ease, border-color .15s ease;
}

.fav-cta:hover {
  background: var(--apricot);
  border-color: rgba(200,85,61,.25);
  transform: translateY(-1px);
  box-shadow: 0 12px 22px rgba(200,85,61,.18);
}

/* ===== Groups & sections ===== */
.groups { display: flex; flex-direction: column; gap: 2rem; }

.result-section {
  background: #fff;
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow: 0 8px 25px rgba(0,0,0,.06);
  padding: 1.25rem;
  transition: transform .25s ease, box-shadow .25s ease;
}
.result-section:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,.09); }

.place-type-heading {
  display: flex; align-items: center; gap: .6rem;
  font-size: 1.5rem;
  color: var(--accent);
  margin: 0 0 1rem 0;
}
.count-badge {
  background: var(--apricot);
  color: var(--accent);
  padding: .2rem .65rem;
  border-radius: 999px;
  font-size: .85rem;
  font-weight: 800;
  box-shadow: 0 4px 10px rgba(242,143,59,.25);
}

/* ===== Cards ===== */
.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
.card-wrapper { position: relative; }

.card {
  display: grid; grid-template-rows: auto 1fr;
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border);
  box-shadow: 0 6px 18px rgba(0,0,0,.08);
  text-decoration: none; color: inherit; overflow: hidden;
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}
.card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,.12); border-color: rgba(200,85,61,.25); }

.media { position: relative; aspect-ratio: 16/9; background: #f5f5f5; }
.card img { width: 100%; height: 100%; object-fit: cover; display: block; transform: scale(1); transition: transform .45s ease; }
.card:hover img { transform: scale(1.03); }
.media::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(transparent 60%, rgba(0,0,0,.75));
  opacity: 0; transition: opacity .25s ease;
}
.card:hover .media::after { opacity: .2; }

.badge {
  position: absolute;
  padding: .38rem .65rem;
  border-radius: 999px;
  font-size: .78rem; font-weight: 800;
  background: #fff; color: var(--accent);
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
}
.badge.price { bottom: 10px; right: 10px; }

.content { padding: .9rem 1rem 1rem; }
.name {
  font-size: 1.15rem; margin: 0 0 .25rem;
  color: var(--text); line-height: 1.25; font-weight: 700;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.meta { font-size: .92rem; color: var(--muted); margin: 0 0 .45rem; min-height: 1.2em; }
.description {
  font-size: .92rem; color: #4f4f4f; margin: 0 0 .6rem;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}

/* AI tags */
.ai-tags { display: flex; flex-wrap: wrap; gap: .4rem; }
.chip {
  display: inline-flex; align-items: center; gap: .25rem;
  padding: .25rem .5rem; background: var(--chip-bg); color: var(--accent);
  border-radius: 999px; font-size: .78rem; border: 1px solid var(--border);
}

/* Favorite */
.favorite-btn {
  position: absolute; top: .6rem; right: .6rem;
  width: 40px; height: 40px; display: grid; place-items: center;
  background: #fff; border: 1px solid var(--border); border-radius: 999px;
  box-shadow: 0 2px 8px rgba(0,0,0,.1);
  font-size: 1.2rem; cursor: pointer;
  transition: transform .15s ease, box-shadow .15s ease;
}
.favorite-btn:hover { transform: scale(1.07); }

/* Empty / Loading */
.no-results {
  margin-top: 2rem; text-align: center; font-style: italic; color: var(--muted-2);
}
.loading {
  display: grid; place-items: center; gap: 1rem; padding: 2rem 0;
}
.spinner {
  width: 42px; height: 42px;
  border: 4px solid #eee; border-top-color: var(--accent);
  border-radius: 50%; animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ===== CSS-only fade-in (no JS needed) ===== */
@media (prefers-reduced-motion: no-preference) {
  .fade-in { animation: rise-in .8s ease-out both; }
  .header.fade-in { animation-delay: .05s; }
  .mapbox.fade-in { animation-delay: .1s; }
  .result-section.fade-in { animation-delay: .15s; }
}
@keyframes rise-in {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .fade-in { opacity: 1; transform: none; animation: none; }
}

/* ===== Responsive tweaks ===== */
@media (max-width: 640px) {
  .results { padding: 1.75rem 1rem; }
  .title { font-size: 2rem; }
  .mapbox { height: 320px; }
}

@media (max-width: 980px) {
  .fav-cta { width: 100%; text-align: center; }
}
</style>
