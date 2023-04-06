import { createRouter, createWebHashHistory } from 'vue-router'
import HomeComponentTwo from '../views/HomeComponentTwo.vue'
import LoginComponent from '../views/LoginComponent.vue'
import PlanFlightComponent from '../views/PlanFlightComponent.vue'
import PageNotFoundComponent from '../views/PageNotFoundComponent.vue'
import ProfileComponent from '../views/ProfileComponent.vue'
import SignUpComponent from '../views/SignUpComponent.vue'
import FlightOutcomeComponent from '../views/FlightOutcomeComponent.vue'
import MyGoogleMapComponent from '../components/MyGoogleMapComponent.vue'
import WeatherDisplayComponent from '../views/WeatherDisplayComponent.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeComponentTwo,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginComponent,
  },
  {
    path: '/planner',
    name: 'planner',
    component: PlanFlightComponent,
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUpComponent,
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileComponent,
  },
  {
    path: '/reviewFlight',
    name: 'reviewFlight',
    component: FlightOutcomeComponent
  },
  {
    path: '/mapView',
    name: 'mapView',
    component: MyGoogleMapComponent
  },
  {
    path: '/weatherDisplay',
    name: 'weatherDisplay',
    component: WeatherDisplayComponent
  },
  { 
    path: '/:pathMatch(.*)*',
    name: 'pagenotfound',
    component: PageNotFoundComponent
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
