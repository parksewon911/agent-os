import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './views/Dashboard.vue'
import Crm from './views/Crm.vue'
import Assistant from './views/Assistant.vue'
import OcrRemodel from './views/OcrRemodel.vue'
import Coverage from './views/Coverage.vue'
import Materials from './views/Materials.vue'
import Insights from './views/Insights.vue'
import Compare from './views/Compare.vue'
import Sns from './views/Sns.vue'
import Recruit from './views/Recruit.vue'
import Team from './views/Team.vue'
import Analysis from './views/Analysis.vue'
import Calculator from './views/Calculator.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Dashboard },
    { path: '/crm', component: Crm },
    { path: '/analysis', component: Analysis },
    { path: '/assistant', component: Assistant },
    { path: '/gems', redirect: '/assistant' },
    { path: '/ocr', component: OcrRemodel },
    { path: '/coverage', component: Coverage },
    { path: '/calculator', component: Calculator },
    { path: '/materials', component: Materials },
    { path: '/insights', component: Insights },
    { path: '/compare', component: Compare },
    { path: '/sns', component: Sns },
    { path: '/recruit', component: Recruit },
    { path: '/team', component: Team },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
