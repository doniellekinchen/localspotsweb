import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import VibeMatchResults from '../views/VibeMatchResults.vue'
import VibeMatch from '../views/VibeMatch.vue'
import ListingDetails from '../views/ListingDetails.vue'
import CategoryDirectory from '../views/CategoryDirectory.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/vibematch', name: 'VibeMatch', component: VibeMatch },
  { path: '/vibematch-results', name: 'VibeMatchResults', component: VibeMatchResults },
{
  path: '/category-directory',
  name: 'CategoryDirectory',
  component: () => import('../views/CategoryDirectory.vue')
},

  {
  path: '/category/:name',
  name: 'CategoryPage',
  component: () => import('../views/CategoryPage.vue')
},

{
  path: '/listing/:id',
  name: 'ListingDetails',
  component: () => import('../views/ListingDetails.vue') // adjust path as needed
},
{
  path: '/explore',
  name: 'Explore',
  component: () => import('../views/Explore.vue')
},

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
