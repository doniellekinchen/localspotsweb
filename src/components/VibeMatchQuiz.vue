<template>
  <section class="quiz-section" aria-labelledby="quiz-title">
    <!-- header -->
    <header class="quiz-header">
      <div>
         <span class="icon">✨</span> 
        <h1 id="quiz-title" class="title">
         Find Your Vibe
        </h1>
        <p class="subtitle">Answer a few quick questions to get personalized matches.</p>
      </div>

      <!-- progress -->
      <div class="progress-wrap" v-if="questions && questions.length">
        <span class="progress-text">Step {{ Math.min(step + 1, questions.length + 1) }} of {{ questions.length + 1 }}</span>
        <div class="progress-dots">
          <span
            v-for="i in (questions.length + 1)"
            :key="i"
            :class="['dot', { active: step + 1 === i }]"
          />
        </div>
      </div>
    </header>

    <!-- card -->
    <div class="quiz-card">
      <transition name="fade" mode="out-in">
        <!-- Step 0: location -->
<div v-if="step === 0" key="loc" class="step location-step">
  <h2 class="step-title">Where are you located?</h2>

  <div class="location-input-wrap">
    <input
      v-model="locationInput"
      class="location-input"
      placeholder="Enter your neighborhood"
      aria-label="Enter your neighborhood"
    />
    <button @click="submitLocation" class="btn btn-accent">Next →</button>
  </div>

  <ul v-if="suggestions.length" class="autocomplete-list" role="listbox">
    <li
      v-for="(s, i) in suggestions"
      :key="i"
      class="autocomplete-item"
      role="option"
      @click="selectSuggestion(s)"
    >
      {{ s.placeName }}
    </li>
  </ul>
</div>


        <!-- Other steps -->
        <!-- Other steps -->
<div
  v-else
  key="q"
  :class="['step', { 'vibe-step': step === vibeStep, 'budget-step': step === budgetStep }]"
>
  <h2 class="step-title">{{ currentQuestion.question }}</h2>

  <div class="options-wrap">
    <button
      v-for="(option, index) in currentQuestion.options"
      :key="index"
      :class="['chip', { selected: isSelected(option) }]"
      @click="handleOptionClick(option)"
    >
      {{ option }}
    </button>
  </div>

  <div class="actions" v-if="step === vibeStep || step === budgetStep">
    <button class="btn" @click="step = Math.max(0, step - 1)">← Back</button>
    <button class="btn btn-accent" @click="submitMultiSelect">Next →</button>
  </div>
</div>

      </transition>
    </div>
  </section>
</template>

<script>
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const mapboxToken = 'pk.eyJ1Ijoid2JpdGMtZG9uaSIsImEiOiJjbWM1OWk1ZGwwbjM2Mm1vZnY1eTdndzlwIn0.JJ7RwtgOgNce-mP9fI7_Gg';
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

export default {
  name: 'VibeMatchQuiz',
  data() {
    return {
      step: 0,
      locationInput: '',
      suggestions: [],
      coords: null,
      answers: [],
      selectedMulti: [],
      vibeStep: 2,   // multi-select step index (as in your original)
      budgetStep: 3, // multi-select step index (as in your original)
      questions: [
        {
          question: "Who are you with? Choose one.",
          options: ["Solo", "Date Night", "Family", "Friends", "First Date", "Second Date", "Group Outing", "Tourist", "Locals", "Late Night"]
        },
        {
          question: "What's your vibe today? Choose many.",
          options: ["Foodie", "Chill", "Adventurous", "Romantic", "Arts & Culture", "Trendy", "Artsy", "Nature", "Historic", "Luxury", "Quirky", "Quiet", "Sporty", "Cultural", "Hidden Gem", "Social", "Active"]
        },
        {
          question: "What's your budget? Choose many",
          options: ["$", "$$", "$$$", "$-$$", "$$-$$$"]
        }
      ]
    };
  },
  watch: {
    async locationInput(newVal) {
      if (newVal.length < 3) {
        this.suggestions = [];
        return;
      }
      try {
        const response = await geocodingClient
          .forwardGeocode({ query: newVal, autocomplete: true, limit: 5 })
          .send();
        const features = response.body.features || [];
        this.suggestions = features.map(f => ({
          placeName: f.place_name,
          lat: f.geometry.coordinates[1],
          lon: f.geometry.coordinates[0]
        }));
      } catch (err) {
        console.error('Failed to fetch suggestions:', err.message);
        this.suggestions = [];
      }
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.step - 1];
    },
    totalSteps() {
      return this.questions.length + 1; // +1 for location
    }
  },
  methods: {
    selectSuggestion(suggestion) {
      this.locationInput = suggestion.placeName;
      this.coords = suggestion;
      this.suggestions = [];
    },
    submitLocation() {
      if (!this.coords || this.locationInput !== this.coords.placeName) {
        const match = this.suggestions.find(
          s => s.placeName.toLowerCase() === this.locationInput.toLowerCase()
        );
        if (match) {
          this.selectSuggestion(match);
        } else {
          alert('Please select a location from the suggestions.');
          return;
        }
      }
      this.answers.push(this.coords);
      this.step++;
    },
    isSelected(option) {
      return this.selectedMulti.includes(option);
    },
    handleOptionClick(option) {
      if (this.step === this.vibeStep || this.step === this.budgetStep) {
        this.selectedMulti.includes(option)
          ? (this.selectedMulti = this.selectedMulti.filter(o => o !== option))
          : this.selectedMulti.push(option);
      } else {
        this.answers.push(option);
        this.step++;
        this.selectedMulti = [];
      }
    },
    submitMultiSelect() {
      if (this.selectedMulti.length === 0) {
        alert('Please select at least one option.');
        return;
      }
      this.answers.push(this.selectedMulti);
      this.step++;
      if (this.step > this.questions.length) {
        const [location, dateType, vibe, budget] = this.answers;
        this.$router.push({
          name: 'VibeMatchResults',
          query: {
            location: location.placeName,
            lat: location.lat,
            lon: location.lon,
            dateType,
            vibe: JSON.stringify(vibe),
            budget: JSON.stringify(budget)
          }
        });
      } else {
        this.selectedMulti = [];
      }
    }
  }
};
</script>

<style scoped>
/* iOS text sizing quirks */
html { -webkit-text-size-adjust: 100%; }

/* ===== Theme tokens (match site) ===== */
:root {
  --bg1: #FFF9F6;
  --bg2: #FFEFE7;
  --text: #333;
  --muted: #666;
  --accent: #C8553D;
  --accent-2: #F28F3B;
  --cyan: #588B8B;
  --apricot: #FFD5C2;
  --chip-bg: #FFF1EC;
  --border: rgba(200,85,61,0.14);
}

.quiz-section {
  min-height: 100vh;
  padding: 2.25rem 1.25rem 3rem;
  background: linear-gradient(135deg, var(--bg1) 0%, var(--bg2) 100%);
  font-family: "Special Gothic Expanded One", sans-serif;
  color: var(--text);
  display: grid;
  grid-template-rows: auto auto;
  gap: 1rem;
  position: relative;
  overflow: hidden;
}

/* soft background blobs */
.quiz-section::before,
.quiz-section::after {
  content: "";
  position: absolute;
  pointer-events: none;
  filter: blur(12px);
}
.quiz-section::before {
  right: -80px; top: -80px;
  width: 360px; height: 360px;
  background: radial-gradient(ellipse at center, rgba(242,143,59,0.12), transparent 60%);
}
.quiz-section::after {
  left: -100px; bottom: -120px;
  width: 460px; height: 460px;
  background: radial-gradient(ellipse at center, rgba(200,85,61,0.10), transparent 60%);
  filter: blur(14px);
}

/* header */
.quiz-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  gap: 0.6rem;
  flex-wrap: wrap;
  z-index: 1;
}
.title {
  display: flex;
  align-items: center;
  gap: .6rem;
  font-size: clamp(2rem, 5vw, 3rem);
  color: var(--accent);
  margin: 0;
  font-weight: 700;
  text-shadow: 0 1px 0 rgba(255,255,255,.6);
}
.icon { font-size: 1.1em; }
.subtitle {
  margin: .25rem 0 0;
  color: var(--cyan);
  font-size: 1.05rem;
}

/* progress */
.progress-wrap { display: grid; gap: .4rem; justify-items: end; }
.progress-text { color: var(--muted); font-size: .95rem; }
.progress-dots {
  display: flex; gap: .4rem; align-items: center; justify-content: flex-end;
}
.dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: #e8e8e8; transition: background-color .3s ease, transform .3s ease;
}
.dot.active { background: var(--accent-2); transform: scale(1.1); }

/* card */
.quiz-card {
  align-self: start;
  height: auto;
  z-index: 1;
  max-width: 840px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0,0,0,.08);
  padding: 1.25rem;
}

/* step */
.step { display: grid; gap: 1rem; }
.step-title {
  font-size: 1.4rem; 
  color: var(--accent); 
  margin: .25rem 0 .75rem;
  text-align: center;
  width: 100%;
}

/* option chips */
.options-wrap {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: .6rem;
  justify-self: center;
}

/* Exactly 2 columns on the "What's your vibe?" step */
.vibe-step .options-wrap {
  display: grid;                  /* already grid, but ensure */
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .6rem .8rem;               /* row gap, column gap */
  justify-items: stretch;         /* chips fill each column nicely */
}

/* Optional: keep 2 columns even on small phones */
@media (max-width: 360px) {
  .vibe-step .options-wrap {
    grid-template-columns: repeat(2, 1fr);
    gap: .5rem .6rem;
  }
}


.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: .7rem .9rem;
  border-radius: 999px;
  border: 1px solid rgba(200,85,61,.18);
  background: #fff;
  color: var(--accent);
  font-weight: 700;
  transition: transform .15s ease, background .15s ease, box-shadow .15s ease, color .15s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
}
.chip:hover { transform: translateY(-1px); background: #FFF5F0; }
.chip.selected {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 8px 18px rgba(200,85,61,.25);
}

/* actions */
.actions {
  margin-top: .25rem;
  display: flex;
  gap: .6rem;
  justify-content: center;
  flex-wrap: wrap;
}
.btn {
  padding: .7rem 1.1rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #fff;
  color: var(--accent);
  font-weight: 800;
  cursor: pointer;
  transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
}
.btn:hover { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(0,0,0,.06); background: #FFF5F0; }
.btn-accent {
  background: var(--accent-2);
  color: #fff;
  border-color: transparent;
}
.btn-accent:hover { background: #d9772f; }

/* transitions */
.fade-enter-active, .fade-leave-active { transition: opacity .28s ease, transform .28s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(8px); }

/* ===== LOCATION ROW (the part that was clipping) ===== */
.location-step { gap: .75rem; }

/* Make input + button a reliable grid so they can’t overlap */
.location-input-wrap {
  display: grid;
  grid-template-columns: 1fr max-content; /* input grows, button keeps size */
  align-items: center;
  gap: .6rem;
}
.location-input {
  flex: 1;
  padding: .8rem 1rem;
  border-radius: 12px;
  border: 1px solid #e8e1de;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
  font-size: 16px;           /* 16px prevents iOS auto-zoom */
}
.location-step .btn {
  white-space: nowrap;
  height: 100%;
  padding: .8rem 1.1rem;
  min-width: 100px;          /* predictable size so it won’t get squeezed */
  max-width: 124px;
}

/* Suggestions dropdown */
.autocomplete-list {
  list-style: none;
  margin-top: .5rem;
  max-width: 100%;
  padding: .25rem;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 10px 24px rgba(0,0,0,.08);
  max-height: 45vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.autocomplete-item {
  padding: .6rem .7rem;
  cursor: pointer;
  border-radius: 8px;
}
.autocomplete-item:hover { background: #FFF5F0; }

/* ===== Phone tweaks (actual devices) ===== */
@media (max-width: 430px) {
  /* Use the *small* viewport height so Safari chrome doesn’t steal space */
  .quiz-section {
    min-height: 100svh;
    padding: .85rem .9rem calc(1rem + env(safe-area-inset-bottom));
    gap: .5rem;
  }

  .quiz-header {
    align-items: center;
    text-align: center;
    gap: .35rem;
    margin-bottom: .2rem;
  }
  .title {
    font-size: clamp(1.7rem, 6.2vw, 2.2rem);
    line-height: 1.05;
  }
  .subtitle {
    font-size: .95rem;
    max-width: 30ch;
    margin-inline: auto;
  }

  .progress-wrap { width: 100%; justify-items: center; }
  .progress-text { font-size: .85rem; }
  .progress-dots { gap: .3rem; }
  .dot { width: 9px; height: 9px; }

  .quiz-card {
    margin-top: .2rem;
    padding: .95rem;
    width: min(94vw, 680px);
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0,0,0,.06);
    scroll-margin-top: 72px; /* avoids overlap with floating menu when jumping */
  }

  /* If the phone is very narrow, stack the button under the input */
  @media (max-width: 380px) {
    .location-input-wrap { grid-template-columns: 1fr; }
    .location-step .btn { width: 100%; max-width: none; }
  }

  @media (max-width: 430px) {
  .btn,
  .btn-accent {
    flex: 1;
    max-width: 180px; /* keeps them from stretching too much */
    text-align: center;
  }
}
}
</style>