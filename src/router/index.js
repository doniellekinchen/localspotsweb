// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import VibeMatch from '../views/VibeMatch.vue'
import VibeMatchResults from '../views/VibeMatchResults.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/contact', name: 'Contact', component: Contact },

  { path: '/explore', name: 'Explore', component: () => import('../views/Explore.vue') },

  { path: '/vibematch', name: 'VibeMatch', component: VibeMatch },
  { path: '/vibematch-results', name: 'VibeMatchResults', component: VibeMatchResults },

  // Category directory uses query params: ?filter=...&value=...
  { path: '/category-directory', name: 'CategoryDirectory', component: () => import('../views/CategoryDirectory.vue') },

  // Listing details (you link by name with params: { id })
  { path: '/listing/:id', name: 'ListingDetails', component: () => import('../views/ListingDetails.vue') },

  // Favorites (no auth)
  { path: '/favorites', name: 'Favorites', component: () => import('../views/Favorites.vue') },

  // Optional: 404
  // { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFound.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, left: 0 }
  },
  linkActiveClass: 'is-active',
  linkExactActiveClass: 'is-exact-active'
})

export default router
