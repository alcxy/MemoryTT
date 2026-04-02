import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import CategorySelect from '../pages/CategorySelect.vue'
import Learning from '../pages/Learning.vue'
import Review from '../pages/Review.vue'
import Quiz from '../pages/Quiz.vue'
import ProgramQuestion from '../pages/ProgramQuestion.vue'
import AIAnalysis from '../pages/AIAnalysis.vue'
import Statistics from '../pages/Statistics.vue'
import Settings from '../pages/Settings.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/categories', name: 'CategorySelect', component: CategorySelect },
  { path: '/learning/:categoryId', name: 'Learning', component: Learning },
  { path: '/review', name: 'Review', component: Review },
  { path: '/quiz', name: 'Quiz', component: Quiz },
  { path: '/program', name: 'ProgramQuestion', component: ProgramQuestion },
  { path: '/ai-analysis/:id', name: 'AIAnalysis', component: AIAnalysis },
  { path: '/statistics', name: 'Statistics', component: Statistics },
  { path: '/settings', name: 'Settings', component: Settings },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
