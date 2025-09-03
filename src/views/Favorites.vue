<template>
  <section class="favorites-page">
    <header class="fav-header">
      <div class="header-left">
        <h1 class="title">
          <span class="title-icon">💖</span>
          Your Favorites
        </h1>
        <p class="subtitle" v-if="!loading">
          {{ listings.length }} saved {{ listings.length === 1 ? 'place' : 'places' }}
        </p>
      </div>
      <div class="header-actions">
        <button class="btn ghost" @click="clearAll" v-if="listings.length">Clear all</button>
        <button class="btn" @click="saveAsImage" :disabled="!listings.length">Save as image</button>
      </div>
    </header>

    <div v-if="loading" class="loading">
      <div class="spinner" role="status" aria-label="Loading"></div>
      <p>Gathering your saved places…</p>
    </div>

    <div v-else>
      <div v-if="listings.length" ref="captureArea" class="cards-wrap">
        <div class="result-grid">
          <div v-for="item in listings" :key="item.id" class="card-wrapper">
            <router-link
              class="card"
              :to="{ name:'ListingDetails', params:{ id: item.id } }"
            >
              <div class="media">
                <img :src="firstPhoto(item)" :alt="item.name || 'Place image'" loading="lazy" decoding="async" />
                <span class="badge price" v-if="item.price">{{ item.price }}</span>
              </div>
              <div class="content">
                <h3 class="name">{{ item.name }}</h3>
                <p class="meta">{{ vibesText(item) }}</p>
                <p class="description">{{ item.description || 'No description available.' }}</p>
              </div>
            </router-link>
            <button class="favorite-btn" @click.stop="remove(item.id)" :title="'Remove'">✕</button>
          </div>
        </div>
      </div>

      <div v-else class="empty">
        <p>No favorites yet.</p>
        <router-link class="btn" to="/explore">Browse spots</router-link>
      </div>
    </div>
  </section>
</template>

<script>
import { supabase } from '../supabase';

export default {
  name: 'Favorites',
  data() {
    return {
      ids: [],
      listings: [],
      loading: true,
      placeholderImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
    };
  },
  async created() {
    const stored = localStorage.getItem('favorites');
    this.ids = stored ? JSON.parse(stored) : [];

    if (!this.ids.length) {
      this.loading = false;
      return;
    }

    // Fetch by IDs
    const { data, error } = await supabase
      .from('atl_locations4')
      .select('*')
      .in('id', this.ids);

    if (error) {
      console.error('Favorite fetch failed:', error.message);
      this.loading = false;
      return;
    }

    // Normalize arrays (defensive)
    const fixArray = (field) => {
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        try { return JSON.parse(field); } catch { return field.split(',').map(s => s.trim()).filter(Boolean); }
      }
      return [];
    };

    this.listings = (data || []).map(it => ({
      ...it,
      vibe: fixArray(it.vibe),
      photos: fixArray(it.photos)
    }));

    // keep display order by saved order (optional)
    const orderIndex = new Map(this.ids.map((id, i) => [id, i]));
    this.listings.sort((a,b)=> (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0));

    this.loading = false;
  },
  methods: {
    firstPhoto(item) {
      return item.photos?.[0] || item.image || this.placeholderImage;
    },
    vibesText(item) {
      const raw = item.vibe ?? item.vibes ?? '';
      const arr = Array.isArray(raw) ? raw : String(raw).split(/[|,]\s*/).filter(Boolean);
      return (arr.length ? arr : ['vibe unknown']).join(', ');
    },
    remove(id) {
      this.listings = this.listings.filter(x => x.id !== id);
      this.ids = this.ids.filter(x => x !== id);
      localStorage.setItem('favorites', JSON.stringify(this.ids));
    },
    clearAll() {
      this.listings = [];
      this.ids = [];
      localStorage.setItem('favorites', JSON.stringify([]));
    },
    async saveAsImage() {
      const area = this.$refs.captureArea;
      if (!area) return;

      // Prefer Web Share if available after capture
      const canvas = await window.html2canvas(area, {
        backgroundColor: null,
        scale: window.devicePixelRatio < 2 ? 2 : 1
      });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'favorites.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: 'My WBITC Favorites' });
            return;
          } catch { /* fall through to download */ }
        }

        // Fallback: download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'favorites.png';
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    }
  }
};
</script>

<style scoped>
/* Tokens to match Home.vue */
.favorites-page {
  --bg1:#FFF9F6; --bg2:#FFEFE7; --text:#333; --muted:#666;
  --accent:#C8553D; --accent2:#F28F3B; --apricot:#FFD5C2;
  --border: rgba(200,85,61,0.14);
  background: linear-gradient(135deg, var(--bg1) 0%, var(--bg2) 100%);
  min-height: 100vh;
  padding: 2.2rem 1.5rem;
  color: var(--text);
  font-family: "Special Gothic Expanded One", sans-serif;
}

.fav-header{
  max-width:1200px;margin:0 auto 1rem;display:flex;gap:1rem;
  align-items:flex-end;justify-content:space-between;flex-wrap:wrap;
}
.title{
  display:flex;align-items:center;gap:.5rem;
  font-size: clamp(2rem, 5vw, 3rem); color:var(--accent); margin:0; font-weight:700;
}
.title-icon{font-size:1.1em}
.subtitle{margin:.25rem 0 0 0;color:#588B8B;font-size:1.05rem}

.header-actions{display:flex;gap:.6rem;align-items:center}
.btn{
  background: linear-gradient(135deg, var(--accent2), var(--accent));
  color:#fff;border:none;border-radius:999px;padding:.6rem 1rem;
  font-weight:700;cursor:pointer;box-shadow:0 8px 22px rgba(242,143,59,.35);
  transition: transform .15s ease, box-shadow .15s ease, opacity .2s;
}
.btn:hover{ transform: translateY(-1px); box-shadow:0 12px 28px rgba(242,143,59,.45); }
.btn:disabled{opacity:.6;cursor:not-allowed}
.btn.ghost{
  background:#fff;color:var(--accent);border:1px solid var(--border);
  box-shadow:0 4px 12px rgba(0,0,0,.06);
}
.loading{display:grid;place-items:center;gap:1rem;padding:2rem 0;}
.spinner{
  width:42px;height:42px;border:4px solid #eee;border-top-color:var(--accent);
  border-radius:50%;animation:spin 1s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg)}}

/* capture area wrapper to give margins in the exported image */
.cards-wrap{max-width:1200px;margin:0 auto;padding: .5rem}

.result-grid{
  display:grid;
  grid-template-columns: repeat( auto-fill, minmax(260px, 1fr) );
  gap: 1rem;
}

/* Card style to match Results */
.card-wrapper{ position:relative; }
.card{
  display:grid;grid-template-rows:auto 1fr;background:#fff;border-radius:16px;
  overflow:hidden;text-decoration:none;color:inherit;
  border:1px solid var(--border);
  box-shadow:0 6px 18px rgba(0,0,0,.08);
  transition:transform .2s ease, box-shadow .2s ease, border-color .2s ease;
}
.card:hover{ transform: translateY(-3px); box-shadow:0 12px 24px rgba(0,0,0,.12); border-color: rgba(200,85,61,.25); }

.media{ position:relative; aspect-ratio:16/9; background:#f5f5f5; }
.card img{ width:100%; height:100%; object-fit:cover; display:block; }
.badge{ position:absolute; padding:.34rem .6rem; border-radius:999px; font-size:.78rem; font-weight:800; background:#fff; color:var(--accent); border:1px solid var(--border); box-shadow:0 2px 8px rgba(0,0,0,.08);}
.badge.price{ bottom:10px; right:10px; }

.content{ padding:.85rem .95rem 1rem; }
.name{ font-size:1.12rem; margin:0 0 .25rem; font-weight:700; color:var(--text); line-height:1.25; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.meta{ font-size:.92rem; color:#666; margin:0 0 .45rem; min-height:1.2em; }
.description{ font-size:.92rem;color:#4f4f4f;margin:0 }

.favorite-btn{
  position:absolute; top:.6rem; right:.6rem; width:36px;height:36px;border-radius:999px;
  background:#fff;border:1px solid var(--border); cursor:pointer; display:grid;place-items:center;
  box-shadow:0 2px 8px rgba(0,0,0,.1); font-weight:800; color:#c33;
}

/* Empty state */
.empty{ text-align:center; margin:3rem 0; display:grid; gap:1rem; }
</style>
