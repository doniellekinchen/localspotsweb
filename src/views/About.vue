<!-- src/views/About.vue -->
<template>
  <div class="about-page">
    <!-- Hero -->
    <header class="hero">
      <div class="hero-inner">
        <span class="badge">ATL · Curated vibes</span>
        <h1 class="title">About <span class="highlight">We Be in the City</span></h1>
        <p class="subtitle">
          We help you find the right spot for your mood — solo, date night, friends, or family —
          with picks that feel <em>made for you</em>.
        </p>

        <div class="hero-ctas">
          <router-link to="/vibematch" class="btn primary">
            🎯 Try VibeMatch
          </router-link>
          <router-link to="/explore" class="btn ghost">
            ✨ Browse Everything
          </router-link>
        </div>
      </div>
    </header>

    <!-- What & Why -->
    <section class="section">
      <div class="container two-col">
        <div class="card story">
          <h2 class="h2">What We Do</h2>
          <p>
            WBITC pairs the day’s energy with places you’ll actually enjoy: from cozy indoor
            escapes to sunshine-ready adventures. We mix
            <strong>weather, vibe, budget, and who you’re with</strong> to surface spots that fit.
          </p>
          <ul class="checklist">
            <li>Smart suggestions that feel personal</li>
            <li>Indoor vs. outdoor picks that adapt to weather</li>
            <li>Clear price vibes: $, $$, $$$</li>
          </ul>
        </div>

        <div class="card story">
          <h2 class="h2">Why We Built It</h2>
          <p>
            “Where should we go?” shouldn’t take a 30-minute group chat. We wanted a simple,
            delightful way to pick a place quickly, without endless scrolling or decision fatigue.
          </p>
          <p class="muted">Shortlist. Decide. Go have fun.</p>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="section">
      <div class="container">
        <h2 class="h2 center">What makes WBITC different</h2>
        <div class="feature-grid">
          <div class="feature card">
            <div class="icon">🌤</div>
            <h3>Weather-aware</h3>
            <p>Rain or shine, we suggest the right kind of spots for today’s forecast.</p>
          </div>
          <div class="feature card">
            <div class="icon">💸</div>
            <h3>Budget clarity</h3>
            <p>See price vibes at a glance: $, $$, $$$ — pick what fits right now.</p>
          </div>
          <div class="feature card">
            <div class="icon">🎨</div>
            <h3>Real vibes</h3>
            <p>“Chill”, “Romantic”, “Hidden gem”, “Sporty” — filter by how you want to feel.</p>
          </div>
          <div class="feature card">
            <div class="icon">🧠</div>
            <h3>Smart curation</h3>
            <p>Less noise. More “ooh, that’s perfect.” We highlight the good stuff first.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="section">
      <div class="container">
        <h2 class="h2 center">How it works</h2>
        <ol class="steps">
          <li class="step card">
            <span class="step-num">1</span>
            <div>
              <h4>Set your vibe</h4>
              <p>Who you’re with, mood, and rough budget.</p>
            </div>
          </li>
          <li class="step card">
            <span class="step-num">2</span>
            <div>
              <h4>We match the moment</h4>
              <p>We factor in weather + vibe to surface great spots.</p>
            </div>
          </li>
          <li class="step card">
            <span class="step-num">3</span>
            <div>
              <h4>Go have fun</h4>
              <p>Bookmark favorites, tap for details, and head out.</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section">
      <div class="container">
        <h2 class="h2 center">FAQ</h2>
        <div class="faq">
          <details class="card">
            <summary>Is it just for Atlanta?</summary>
            <p>We’re starting with ATL because we love the city! More cities are on the roadmap.</p>
          </details>
          <details class="card">
            <summary>How do you pick places?</summary>
            <p>A mix of research, community feedback, and signals like vibe, price, and weather fit.</p>
          </details>
          <details class="card">
            <summary>Can I suggest a place?</summary>
            <p>
              Absolutely. Email <a href="mailto:info@wbitc.com">info@wbitc.com</a> or use the Contact page.
            </p>
          </details>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section cta-wrap">
      <div class="container center">
        <div class="cta-card card">
          <h3 class="h2">Ready to find your vibe?</h3>
          <div class="hero-ctas">
            <router-link to="/vibematch" class="btn primary">Start VibeMatch</router-link>
            <router-link to="/explore" class="btn ghost">Explore ATL</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default { name: 'AboutPage' }
</script>

<style scoped>
/* ===== Theme tokens (match Home.vue) ===== */
.about-page {
  --bg1: #FFF9F6;
  --bg2: #FFEFE7;
  --text: #333;
  --muted: #666;
  --muted-2: #8a8a8a;
  --accent: #C8553D;
  --accent-2: #F28F3B;
  --apricot: #FFD5C2;
  --border: rgba(200,85,61,0.14);

  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg1) 0%, var(--bg2) 100%);
  color: var(--text);
}

/* ===== Hero ===== */
.hero {
  position: relative;
  padding: 3.2rem 1.5rem 2.2rem;
  text-align: center;
  overflow: hidden;
}
.hero::before {
  content: "";
  position: absolute;
  inset: -20% -10% auto auto;
  height: 360px; width: 360px;
  background: radial-gradient(ellipse at center, rgba(242,143,59,0.12), transparent 60%);
  filter: blur(12px);
  pointer-events: none;
}
.hero::after {
  content: "";
  position: absolute;
  bottom: -140px; left: -80px;
  height: 460px; width: 460px;
  background: radial-gradient(ellipse at center, rgba(200,85,61,0.10), transparent 60%);
  filter: blur(16px);
  pointer-events: none;
}

.hero-inner { max-width: 900px; margin: 0 auto; position: relative; }
.badge {
  display: inline-block;
  background: #fff7f2;
  border: 1px solid var(--border);
  color: var(--accent);
  padding: .4rem .75rem;
  border-radius: 999px;
  font-weight: 800;
  margin-bottom: .9rem;
}

.title {
  margin: 0;
  font-family: "Special Gothic Expanded One", sans-serif;
  font-size: clamp(2.2rem, 5.5vw, 3.2rem);
  color: var(--accent);
  font-weight: 700;
  letter-spacing: .2px;
}
.highlight { color: var(--accent-2); }
.subtitle {
  max-width: 720px;
  margin: .65rem auto 0;
  color: var(--muted);
  font-size: 1.05rem;
}

.subtitle {
  font-family: "Special Gothic Expanded One", sans-serif;
}

.hero-ctas {
  display: inline-flex; gap: .6rem; margin-top: 1.1rem; flex-wrap: wrap;
}
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: .8rem 1.1rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 800;
  border: 1px solid var(--border);
}
.btn.primary {
  background: linear-gradient(135deg, var(--accent-2), var(--accent));
  color: #fff; border: none;
  box-shadow: 0 12px 26px rgba(200,85,61,0.22);
}
.btn.ghost { background: #fff; color: var(--accent); }
.btn:hover { transform: translateY(-1px); }

/* ===== Sections ===== */
.section { padding: 1.5rem 1.25rem; }
.container { max-width: 1100px; margin: 0 auto; }

.two-col {
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 1rem;
}
@media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }

.card {
  background: #fff;
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow: 0 8px 25px rgba(0,0,0,.06);
  padding: 1.1rem 1.25rem;
  font-family: "Special Gothic Expanded One", sans-serif;
}

.h2 {
  font-family: "Special Gothic Expanded One", sans-serif;
  font-size: clamp(1.4rem, 3.6vw, 2rem);
  color: var(--accent);
  margin: 0 0 .6rem 0;
  font-weight: 700;
}
.center { text-align: center; }

/* Story/checklist */
.story p { margin: 0 0 .6rem 0; font-family: "Special Gothic Expanded One", sans-serif;}
.checklist { margin: .5rem 0 0; padding-left: 1.1rem; }
.checklist li { margin: .25rem 0; font-family: "Special Gothic Expanded One", sans-serif;}

/* Features */
.feature-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}
.feature .icon {
  font-size: 1.6rem;
  width: 42px; height: 42px;
  display: grid; place-items: center;
  border-radius: 12px;
  background: #fff7f2;
  color: var(--accent);
  border: 1px solid var(--border);
  margin-bottom: .5rem;
}
.feature h3 {
  margin: 0 0 .25rem 0; font-size: 1.05rem; color: var(--text);
}
.feature p { margin: 0; color: var(--muted); }

.feature h3, .feature p {
  font-family: "Special Gothic Expanded One", sans-serif; /* unify */
}

/* How it works */

.steps,
.steps ol,
.steps-ol,
.steps-ol ol,
.steps-ol li {
  list-style: none;
  margin-left: 0;
  padding-left: 0;
}

/* Extra safety across browsers */
.steps li::marker,
.steps-ol li::marker {
  content: "";
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  justify-content: center;          /* centers the grid */
  margin: 0 auto;
  max-width: 900px;                 /* keeps it from going full bleed */
}

.step {
  background: #fff;
  border-radius: 18px;
  border: 1px solid var(--border);
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
  padding: 1rem;
  text-align: center;               /* center text inside */
  max-width: 260px;                 /* keeps cards tidy */
  margin: 0 auto;                   /* ensures each card is centered */
}
.step-num {
  width: 34px; height: 34px; border-radius: 999px;
  display: grid; place-items: center;
  background: var(--apricot); color: var(--accent);
  font-weight: 900; border: 1px solid var(--border);
}
.step h4 { margin: 0 0 .25rem 0; }
.step p { margin: 0; color: var(--muted); }

.step h4, .step p {
  font-family: "Special Gothic Expanded One", sans-serif;
}

/* FAQ */
.faq {
  display: grid; gap: 0.8rem; max-width: 900px; margin: 0 auto;
}
.faq details summary {
  cursor: pointer; font-weight: 700; color: var(--text);
}
.faq p { margin: .5rem 0 0 0; color: var(--muted); font-family: "Special Gothic Expanded One", sans-serif; }
.faq a { color: var(--accent); font-weight: 700; }

/* CTA */
.cta-wrap { padding-bottom: 3rem; }
.cta-card { text-align: center; font-family: "Special Gothic Expanded One", sans-serif; }
</style>
