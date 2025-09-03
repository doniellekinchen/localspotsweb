<template>
  <div class="explore-page fade-in">
    <!-- Page header -->
    <header class="explore-header">
      <h1 class="title"><span class="title-icon">🧭</span> Explore</h1>
      <div class="search-wrap">
        <input
          v-model="q"
          class="search"
          type="text"
          placeholder="Search vibes, date types, or places…"
          aria-label="Search explore categories"
        />
      </div>
      <nav class="section-nav">
        <a href="#vibes" class="nav-chip">✨ Vibes</a>
        <a href="#date" class="nav-chip">❤️ Date Types</a>
        <a href="#places" class="nav-chip">📍 Place Types</a>
      </nav>
    </header>

    <!-- Vibes -->
    <section id="vibes" class="explore-section">
      <div class="section-header">
        <h2 class="section-title"><span class="icon">✨</span> Explore by Vibe</h2>
      </div>
      <div class="grid-cards">
        <button
          v-for="vibe in filteredVibes"
          :key="vibe"
          class="category-card"
          @click="goToCategory('vibe', vibe)"
        >
          <span class="emoji">🌈</span>
          <span class="label">{{ vibe }}</span>
        </button>
        <p v-if="!filteredVibes.length" class="empty">No vibes match your search.</p>
      </div>
    </section>

    <!-- Date Types -->
    <section id="date" class="explore-section">
      <div class="section-header">
        <h2 class="section-title"><span class="icon">❤️</span> Explore by Date Type</h2>
      </div>
      <div class="grid-cards">
        <button
          v-for="date in filteredDates"
          :key="date"
          class="category-card"
          @click="goToCategory('dateType', date)"
        >
          <span class="emoji">🕒</span>
          <span class="label">{{ date }}</span>
        </button>
        <p v-if="!filteredDates.length" class="empty">No date types match your search.</p>
      </div>
    </section>

    <!-- Place Types (compact chips, show more/less) -->
    <section id="places" class="explore-section">
      <div class="section-header">
        <h2 class="section-title"><span class="icon">📍</span> Explore by Place Type</h2>
        <button v-if="filteredPlaces.length > baseLimit" class="show-more" @click="expanded = !expanded">
          {{ expanded ? 'Show less' : 'Show more' }}
        </button>
      </div>

      <div class="card-plate">
        <div class="chip-wrap">
          <button
            v-for="place in visiblePlaces"
            :key="place"
            class="chip"
            @click="goToCategory('placeType', place)"
          >
            {{ place }}
          </button>
          <p v-if="!filteredPlaces.length" class="empty inside">No place types match your search.</p>
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
      q: '',
      expanded: false,
      baseLimit: 24,
      vibes: [
        'Active','Artsy','Chill','Cultural','Foodie','Hidden gem','Historic','Luxury',
        'Nature','Quiet','Quirky','Romantic','Social','Sporty','Trendy'
      ],
      dateTypes: [
        'Solo','Date night','Friends','Family','First date','Second date','Group outing',
        'Tourists','Locals','Late night'
      ],
      placeTypes: [
        'arcade','art gallery','artesian market','arts and culture','bar','beach','bike path','book fair',
        'bookstore','boutique','board game Café','botanical garden','brewery','Café','cinema','club',
        'comedy club','cultural center','dance class','dessert spot','escape room','farmers market',
        'flea market','fitness studio','food hall','food truck','game night spot','garden','historic site',
        'hobby spot','hookah lounge','lake','live music venue','lounge','mediation studio','mini golf',
        'museum','outdoor market','painting class','park','picnic spot','pop-up shop','pottery studio',
        'restaurant','retail','rooftop','spa','sports and rec','street art walk','theater','trail',
        'trivia night venue','vintage shop','wine bar','zoo'
      ]
    };
  },
  computed: {
    qLower() { return this.q.trim().toLowerCase(); },
    filteredVibes() {
      if (!this.qLower) return this.vibes;
      return this.vibes.filter(v => v.toLowerCase().includes(this.qLower));
    },
    filteredDates() {
      if (!this.qLower) return this.dateTypes;
      return this.dateTypes.filter(v => v.toLowerCase().includes(this.qLower));
    },
    filteredPlaces() {
      if (!this.qLower) return this.placeTypes;
      return this.placeTypes.filter(v => v.toLowerCase().includes(this.qLower));
    },
    visiblePlaces() {
      return this.expanded ? this.filteredPlaces : this.filteredPlaces.slice(0, this.baseLimit);
    }
  },
  methods: {
    goToCategory(filter, value) {
      this.$router.push({ name: 'CategoryDirectory', query: { filter, value } });
    }
  }
};
</script>

<style scoped>
/* ===== Tokens to match Home.vue ===== */
.explore-page {
  --bg1: #FFF9F6;
  --bg2: #FFEFE7;
  --text: #333;
  --muted: #666;
  --accent: #C8553D;
  --accent-2: #F28F3B;
  --apricot: #FFD5C2;
  --border: rgba(200,85,61,0.14);

  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg1) 0%, var(--bg2) 100%);
  color: var(--text);
  font-family: "Special Gothic Expanded One", sans-serif;
  padding: 2rem 1.25rem 2.5rem;
}

/* Header */
.explore-header {
  max-width: 1200px;
  margin: 0 auto 1rem;
  display: grid;
  gap: .8rem;
}
.title {
  margin: 0;
  font-weight: 700;
  font-size: clamp(2rem, 5vw, 3rem);
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: .6rem;
}
.title-icon { font-size: 0.95em; }

.search-wrap { display: grid; }
.search {
  appearance: none;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: .85rem 1rem;
  font-size: 1rem;
  box-shadow: 0 6px 16px rgba(0,0,0,.06);
  background: #fff;
}
.search::placeholder { color: #999; }

.section-nav { display: flex; flex-wrap: wrap; gap: .5rem; }
.nav-chip {
  text-decoration: none;
  color: var(--accent);
  border: 1px solid var(--border);
  background: #fff;
  padding: .38rem .7rem;
  border-radius: 999px;
  font-weight: 700;
}

/* Sections */
.explore-section {
  max-width: 1200px;
  margin: 1.2rem auto 1.8rem;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .6rem;
  margin-bottom: .6rem;
}
.section-title {
  display: flex; align-items: center; gap: .55rem;
  font-size: clamp(1.4rem, 3.2vw, 1.8rem);
  color: var(--accent);
  margin: 0;
}
.icon { font-size: 1.1em; }

.show-more {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: .45rem .7rem;
  font-weight: 800;
  color: var(--accent);
  cursor: pointer;
  transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
}
.show-more:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(200,85,61,.12);
  background: var(--apricot);
}

/* Card grid for Vibes/Date types */
.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: .9rem;
}
.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .45rem;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1rem;
  cursor: pointer;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0,0,0,.06);
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
}
.category-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 26px rgba(0,0,0,.12);
  border-color: rgba(200,85,61,.25);
}
.category-card .emoji { font-size: 1.6rem; }
.category-card .label {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text);
}

/* Place types as compact chips inside a plate */
.card-plate {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: .9rem;
  box-shadow: 0 8px 20px rgba(0,0,0,.06);
}
.chip-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}
.chip {
  background: var(--apricot);
  color: var(--accent);
  border: 1px solid rgba(200,85,61,.18);
  padding: .34rem .6rem;
  border-radius: 999px;
  font-size: .9rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform .15s ease, box-shadow .15s ease;
}
.chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(200,85,61,.18);
}

/* Empty states */
.empty {
  grid-column: 1 / -1;
  padding: .85rem;
  color: #888;
  font-style: italic;
}
.empty.inside { padding: 0; }

/* Fade-in helper */
.fade-in { opacity: 0; transform: translateY(16px); animation: rise .6s ease-out forwards; }
@keyframes rise { to { opacity: 1; transform: translateY(0); } }

/* Mobile tweaks */
@media (max-width: 640px) {
  .explore-page { padding: 1.25rem 1rem 1.75rem; }
  .grid-cards { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
}
</style>
