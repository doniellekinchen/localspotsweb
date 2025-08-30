<template>
  <div class="quiz-container">
    <div class="quiz-overlay">
      <div class="quiz-card">
         <div class="progress-dots">
          <span
            v-for="i in questions.length"
            :key="i"
            :class="{ dot: true, active: step === i }"
          ></span>
        </div>
        <transition name="fade">
          <div v-if="step === 0" class="step">
          <h2 class="step-title">Where are you located?</h2>
          <input v-model="locationInput" placeholder="Enter your neighborhood" />
          <ul v-if="suggestions.length" class="autocomplete-list">
            <li
              v-for="(s, i) in suggestions"
              :key="i"
              class="autocomplete-item"
              @click="selectSuggestion(s)"
            >
              {{ s.placeName }}
            </li>
          </ul>
          <button @click="submitLocation" class="next-button">Next</button>
        </div>
        <div v-else class="step">
          <h2 class="step-title">{{ currentQuestion.question }}</h2>
         <div class="options-scroll-wrapper">
  <div class="options-grid">
    <button
      v-for="(option, index) in currentQuestion.options"
      :key="index"
      :class="{ selected: isSelected(option) }"
      @click="handleOptionClick(option)"
    >
      {{ option }}
    </button>
  </div>
</div>

          <button
            v-if="step === vibeStep || step === budgetStep"
            class="next-button"
            @click="submitMultiSelect"
          >
            Next
          </button>
         </div>
        </transition>
      </div>
    </div>
  </div>
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
      vibeStep: 2,
      budgetStep: 3,
      questions: [
        {
          question: "Who are you with?",
          options: ["Solo", "Date Night", "Family", "Friends", "First Date", "Second Date", "Group Outing", "Tourist", "Locals", "Late Night"]
        },
        {
          question: "What's your vibe today?",
          options: ["Foodie", "Chill", "Adventurous", "Romantic", "Arts & Culture", "Trendy", "Artsy", "Nature", "Historic", "Luxury", "Quirky", "Quiet", "Sporty", "Cultural", "Hidden Gem", "Social", "Active"]
        },
        {
          question: "What's your budget?",
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
          .forwardGeocode({
            query: newVal,
            autocomplete: true,
            limit: 5
          })
          .send();

        const features = response.body.features;

        if (!features || features.length === 0) {
          this.suggestions = [];
          return;
        }

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
          ? this.selectedMulti = this.selectedMulti.filter(o => o !== option)
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
.quiz-container {
  position: fixed;
  inset: 0;
  background-image: url('/atlskyline2.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
  overflow: hidden;
}

.quiz-overlay {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
}

.quiz-card {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 960px;
  padding: 3rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  z-index: 1;
}

.step {
  text-align: center;
}

.step-title {
  font-size: 2rem;
  color: #c8553d;
  margin-bottom: 1.5rem;
}

input {
  padding: 0.85rem;
  font-size: 1rem;
  width: 100%;
  border-radius: 12px;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.autocomplete-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: white;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
}

.autocomplete-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}
.autocomplete-item:hover {
  background-color: #fff0ea;
}

.options-scroll-wrapper {
  max-height: 300px; /* adjust based on your layout */
  overflow-y: auto;
  margin-top: 1rem;
  padding-right: 4px; /* to avoid scrollbar overlap */
}

/* Optional: make it prettier when scrolling */
.options-scroll-wrapper::-webkit-scrollbar {
  width: 6px;
}
.options-scroll-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(200, 85, 61, 0.4);
  border-radius: 3px;
}


.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.options-grid button {
  background: white;
  border: 2px solid #f3d1c4;
  border-radius: 999px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.25s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
.options-grid button:hover {
  background-color: #ffe3d6;
  transform: scale(1.03);
}
.options-grid button.selected {
  background-color: #c8553d;
  color: white;
  font-weight: 600;
  border-color: #c8553d;
}

button {
  cursor: pointer;
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1.5rem;
  background-color: #ffe8df;
  color: #333;
  font-weight: 500;
  transition: all 0.3s ease;
}
button:hover {
  background-color: #ffd5c2;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.next-button {
  background-color: #F28F3B;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.9rem 2.5rem;
  margin-top: 2rem;
}
.next-button:hover {
  background-color: #c8553d;
}

.progress-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
.dot {
  width: 12px;
  height: 12px;
  background-color: #ddd;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}
.dot.active {
  background-color: #F28F3B;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-height: 700px) {
  .quiz-overlay {
    align-items: flex-start;
    padding-top: 2rem;
  }
}


</style>
