// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/Home.vue'
import GiraffeGameView from '../components/GirrafeGame.vue'
import GiraffeGameplay from '../components/GiraffeGameplay.vue'
import GameFeedbackEmoji from '../components/GameFeedbackEmoji.vue'
import GameFeedbackDetail from '../components/GameFeedbackDetail.vue'
import GiraffeGameplayLevel3 from '../components/GiraffeGameplayLevel3.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/giraffe-game',
    name: 'giraffe-game',
    component: GiraffeGameView
  },
  {
    path: '/giraffe-gameplay',
    name: 'giraffe-gameplay',
    component: GiraffeGameplay
  },
  {
    path: '/giraffe-gameplay-level2',
    name: 'giraffe-gameplay-level2',
    component: () => import('../components/GiraffeGameplayLevel2.vue')
  },
  {
    path: '/level3',
    name: 'level3',
    component: GiraffeGameplayLevel3
  },
  {
    path: '/level4',
    name: 'level4',
    component: () => import('../components/GiraffeGameplayLevel4.vue')
  },
  {
    path: '/game-feedback-emoji',
    name: 'game-feedback-emoji',
    component: GameFeedbackEmoji
  },
  {
    path: '/game-feedback-detail',
    name: 'game-feedback-detail',
    component: GameFeedbackDetail
  },
  {
    path: '/home',
    name: 'home-page',
    component: () => import('../views/Home.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router