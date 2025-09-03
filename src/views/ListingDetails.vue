<template>
  <div class="listing-details">
    <div class="hero" :style="{ backgroundImage: `url(${listing.photos?.[0] || placeholderImage})` }">
      <button class="floating-favorite" @click="toggle(listing.id)">
  {{ isFavorite(listing.id) ? '💖' : '🤍' }}
</button>
      <div class="hero-overlay">
        <h1>{{ listing.name }}</h1>
        <p class="hero-price">{{ listing.price || '$$' }}</p>
        <div class="hero-tags">
          <div v-if="listing.address" class="address">
            📍 {{ listing.address }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="listing.photos && listing.photos.length" class="photo-carousel">
      <swiper
        :slides-per-view="1"
        :space-between="10"
        :pagination="{ clickable: true }"
        :navigation="true"
        class="mySwiper"
      >
        <swiper-slide v-for="(photo, index) in listing.photos" :key="index">
          <img :src="photo" alt="Listing Photo" />
        </swiper-slide>
      </swiper>
    </div>

    <!-- DETAILS + SIDEBAR GRID -->
<div class="content-grid">
  <!-- LEFT: details -->
  <main class="details-stack">
    <section class="card details-card fade-in">
      <div class="details-grid">
        <div class="info-block">
          <h3 class="block-title">💡 Vibes It Gives</h3>
          <div class="tags">
            <span v-for="tag in (listing.vibe || [])" :key="'v2-'+tag" class="tag">{{ tag }}</span>
          </div>
        </div>

        <div class="info-block">
          <h3 class="block-title">🎯 Perfect For</h3>
          <div class="tags">
            <span v-for="type in (listing.dateType || [])" :key="'t-'+type" class="tag">{{ type }}</span>
          </div>
        </div>

        <div class="info-block span-2">
          <h3 class="block-title">📌 Things to Know</h3>
          <div class="tags">
            <span v-for="(t, i) in (listing.tags || [])" :key="'k-'+i" class="tag">🔸 {{ t }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- tighter description -->
    <section class="card description-card fade-in">
      <p class="description" v-if="listing.description">
        {{ listing.description }}
      </p>
      <p class="description muted" v-else>
        No description available.
      </p>
    </section>
  </main>

  <!-- RIGHT: sidebar (map or placeholder) -->
  <aside class="sidebar">
  <section class="card sidebar-card fade-in">
  <h3 class="block-title sidebar-title">📍 Location</h3>

  <div v-if="listing.latitude && listing.longitude" class="sidebar-map">
    <div id="detail-map" class="detail-map"></div>
  </div>
  <div v-else class="sidebar-placeholder">
    <p class="muted">Map coming soon.</p>
    <p v-if="listing.address" class="addr-chip">📍 {{ listing.address }}</p>
    <a
      v-if="listing.address"
      class="open-maps"
      :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`"
      target="_blank" rel="noopener"
    >
      Open in Google Maps →
    </a>
  </div>
 <router-link class="fav-cta" to="/favorites">💾 View Favorites</router-link>
</section>
  </aside>
</div>
  </div>
</template>

<script>
import { supabase } from '../supabase';
import mapboxgl from 'mapbox-gl';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';
import { useFavorites } from '../composables/useFavorites'; // ← add this

mapboxgl.accessToken = 'your_mapbox_token_here';

export default {
  name: 'ListingDetails',
  components: { Swiper, SwiperSlide },
  data() {
    return {
      listing: {},
      placeholderImage: 'https://via.placeholder.com/800x400?text=WBITC',
      favs: null, // ← shared favorites handle
    };
  },
  async created() {
    // wire the shared favorites once
    this.favs = useFavorites();

    const id = this.$route.params.id;
    const { data, error } = await supabase
      .from('atl_locations4')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase fetch failed:', error.message);
      this.listing = {};
      return;
    }

    // Normalize array-like fields
    const fixArray = (field) => {
      if (typeof field === 'string') {
        try { return JSON.parse(field); }
        catch { return field.split(',').map(x => x.trim()); }
      }
      return Array.isArray(field) ? field : [];
    };

    data.vibe = fixArray(data.vibe);
    data.dateType = fixArray(data.dateType);
    data.tags = fixArray(data.tags);
    data.photos = fixArray(data.photos);

    this.listing = data;
  },
  mounted() {
    this.initMap();
  },
  methods: {
    // --- Favorites (match your template calls) ---
    toggle(id) {
      this.favs?.toggle(id);
    },
    isFavorite(id) {
      return this.favs?.isFavorite(id);
    },

    // --- Map ---
    initMap() {
      if (this.listing.latitude && this.listing.longitude) {
        const map = new mapboxgl.Map({
          container: 'detail-map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [parseFloat(this.listing.longitude), parseFloat(this.listing.latitude)],
          zoom: 14
        });

        new mapboxgl.Marker()
          .setLngLat([parseFloat(this.listing.longitude), parseFloat(this.listing.latitude)])
          .setPopup(new mapboxgl.Popup().setText(this.listing.name))
          .addTo(map);
      }
    }
  }
};
</script>



<style scoped>
/* ==== Page base (match Home.vue vibe) ==== */
.listing-details {
  --bg1: #FFF9F6;
  --bg2: #FFEFE7;
  --text: #333;
  --muted: #666;
  --muted-2: #8a8a8a;
  --accent: #C8553D;
  --accent-2: #F28F3B;
  --cyan: #588B8B;
  --apricot: #FFD5C2;
  --chip-bg: #FFF1EC;
  --border: rgba(200,85,61,0.14);

  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg1) 0%, var(--bg2) 100%);
  color: var(--text);
  font-family: "Special Gothic Expanded One", sans-serif;
}

/* ==== HERO ==== */
.hero {
  position: relative;
  height: clamp(280px, 38vw, 420px);
  margin: 1rem auto 1rem;
  max-width: 1200px;
  border-radius: 20px;
  background-size: cover;
  background-position: center;
  background-image: url("https://via.placeholder.com/1200x600/FFD5C2/333?text=No+Photo"); /* fallback */
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0,0,0,0.18);
}

/* overlay for readability */
.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,.25) 0%, rgba(0,0,0,.55) 70%);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.25rem 1.5rem;
  color: #fff;
  z-index: 1;
}

.hero-overlay h1 {
  margin: 0;
  font-size: clamp(2.2rem, 5.5vw, 3.4rem);
  font-weight: 700;
  line-height: 1.1;
  text-shadow: 0 3px 20px rgba(0,0,0,.35);
}

.hero-price {
  margin-top: .25rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--apricot);
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: .45rem;
  margin-top: .5rem;
}
.hero-tags .address {
  background: rgba(255,255,255,.2);
  border: 1px solid rgba(255,255,255,.25);
  padding: .3rem .6rem;
  border-radius: 999px;
  font-size: .9rem;
  backdrop-filter: blur(6px);
  color: #fff;
}

/* floating favorite button */
.floating-favorite {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: .55rem .7rem;
  font-size: 1.3rem;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(0,0,0,.25);
  transition: transform .15s ease;
}
.floating-favorite:hover { transform: scale(1.07); }

/* =========================================================
   CONTENT LAYOUT (details left, sidebar right)
   ========================================================= */
.content-grid {
  max-width: 1200px;
  margin: 0 auto 1.25rem;
  padding: 0 1.25rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px; /* left grows, right fixed */
  gap: 1.25rem; /* space between columns */
}
@media (max-width: 1024px) {
  .content-grid { grid-template-columns: 1fr; }
  .sidebar { order: 2; }  /* details first on mobile */
}

/* Left column (stack of cards) */
.details-stack { display: grid; gap: 1rem; }

.card {
  background: #fff;
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow: 0 8px 25px rgba(0,0,0,.06);
  padding: 1rem 1.25rem;
}

/* ===== Details card – cleaned up so it feels like ONE plate ===== */
.details-card {
  padding: 1rem 1.1rem;
  /* subtle inner highlight to avoid “nested card” look */
  box-shadow: 0 8px 25px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.55);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  column-gap: 1.1rem;       /* tighter than before */
  row-gap: .75rem;          /* closer vertical rhythm */
  align-items: start;       /* stop drooping */
}
@media (max-width: 760px) { .details-grid { grid-template-columns: 1fr; } }

.info-block {
  display: grid;
  gap: .35rem;              /* tighter title → chips */
  padding: 0;
}

.block-title {
  color: var(--accent);
  margin: 0;
  font-size: 1.12rem;
}

/* “Things to Know” spans both columns and has an internal divider */
.span-2 {
  grid-column: 1 / -1;
  padding-top: .85rem;
  margin-top: .15rem;
  border-top: 2px solid #FFF5F0; /* soft internal divider */
}
@media (max-width: 760px) { .span-2 { grid-column: auto; } }

/* tags spacing */
.tags { display: flex; flex-wrap: wrap; gap: .45rem; }
.tag {
  background: var(--apricot);
  color: var(--accent);
  padding: .32rem .62rem;        /* slightly tighter */
  border-radius: 999px;
  font-size: .86rem;             /* slightly smaller */
  font-weight: 700;
  border: 1px solid rgba(200,85,61,.18);
  white-space: nowrap;
}

/* Tighter description card */
.description-card { padding: 0.75rem 1rem; }
.description {
  margin: 0;
  font-size: 0.975rem;
  line-height: 1.5;
  color: #3f3f3f;
}
.muted { color: var(--muted); font-style: italic; }

/* Right column (sidebar) */
.sidebar { position: relative; display: grid; gap: 1rem; }
.sidebar-card { padding: 0.9rem 1rem; }
.sidebar-title { margin: 0 0 .4rem 0; }

.sidebar-map { border-radius: 12px; overflow: hidden; }
.detail-map {
  width: 100%;
  height: 320px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,.06);
  border: 1px solid var(--border);
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(255,255,255,.6), rgba(255,255,255,0)) padding-box,
    radial-gradient(120% 120% at -10% -10%, rgba(200,85,61,.12), transparent 40%) border-box;
}

.sidebar-placeholder { display: grid; gap: .5rem; }
.addr-chip {
  background: #fff7f2;
  border: 1px solid var(--border);
  padding: .4rem .6rem;
  border-radius: 999px;
  font-size: .9rem;
  color: var(--accent);
  width: fit-content;
}
.open-maps {
  display: inline-block;
  font-weight: 700;
  color: var(--accent);
  text-decoration: none;
  border: 1px solid var(--border);
  padding: .45rem .65rem;
  border-radius: 10px;
  transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
}
.open-maps:hover {
  background: var(--apricot);
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(200,85,61,.18);
}

/* ==== Swiper Gallery (if you keep it above the grid) ==== */
.photo-carousel {
  margin: 1.5rem auto;
  max-width: 1200px;
  padding: 0 1.25rem;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
}
.mySwiper { width: 100%; height: 280px; }
.mySwiper img { width: 100%; height: 100%; object-fit: cover; }

/* Favorites CTA button in sidebar */
.fav-cta {
  margin-top: .75rem;
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  padding: .55rem .9rem;
  border-radius: 999px;
  font-weight: 800;
  text-decoration: none;
  color: var(--accent);
  border: 1px solid var(--border);
  background: #fff;
  transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
}
.fav-cta:hover {
  background: var(--apricot);
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(200,85,61,.18);
}


/* ==== Responsive tweaks ==== */
@media (max-width: 640px) {
  .hero { height: clamp(220px, 48vw, 320px); }
  .mySwiper { height: 220px; }
  .card { padding: .85rem 1rem; }
}
</style>
