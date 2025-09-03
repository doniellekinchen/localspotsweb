<!-- src/views/Contact.vue -->
<template>
  <div class="contact-page">
    <!-- Hero Header -->
    <header class="contact-hero">
      <h1 class="hero-title">📬 Get in Touch</h1>
      <p class="hero-sub">
        Have a suggestion or spotted a cool spot? We’d love to hear from you!
      </p>
    </header>

    <!-- Contact Card -->
    <section class="contact-card">
      <p>
        Drop us a note anytime at
        <a href="mailto:info@wbitc.com" class="email-link">info@wbitc.com</a>
      </p>

      <div class="divider">or</div>

      <!-- (Optional) Contact Form -->
      <form class="contact-form">
        <div class="form-group">
          <input type="text" placeholder="Your Name" required />
        </div>
        <div class="form-group">
          <input type="email" placeholder="Your Email" required />
        </div>
        <div class="form-group">
          <textarea placeholder="Your Message" rows="4" required></textarea>
        </div>
        <button type="submit" class="submit-btn">Send Message</button>
      </form>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ContactPage'
}
</script>

<style scoped>
/* ==== Page Base ==== */
.contact-page {
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
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ==== Hero Section ==== */
.contact-hero {
  text-align: center;
  margin-bottom: 2rem;
}
.hero-title {
  font-family: "Special Gothic Expanded One", sans-serif;
  font-size: clamp(2rem, 5vw, 2.8rem);
  margin: 0;
  color: var(--accent);
}
.hero-sub {
  font-size: 1.05rem;
  color: var(--muted);
  margin-top: 0.5rem;
}

/* ==== Contact Card ==== */
.contact-card {
  background: #fff;
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
  padding: 2rem 1.5rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.email-link {
  color: var(--accent);
  font-weight: 700;
  text-decoration: none;
}
.email-link:hover {
  color: var(--accent-2);
}

/* Divider */
.divider {
  margin: 1.5rem 0;
  text-transform: uppercase;
  font-size: 0.85rem;
  color: var(--muted);
  position: relative;
}
.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: var(--border);
}
.divider::before { left: 0; }
.divider::after { right: 0; }

/* ==== Contact Form ==== */
.contact-form {
  display: grid;
  gap: 1rem;
  text-align: left;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  font-size: 0.95rem;
  font-family: inherit;
  box-sizing: border-box;
}
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-2);
  box-shadow: 0 0 0 3px rgba(242,143,59,0.25);
}

.submit-btn {
  padding: 0.9rem 1.5rem;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.25s ease, transform 0.15s ease;
}
.submit-btn:hover {
  background: var(--accent-2);
  transform: translateY(-2px);
}
</style>
