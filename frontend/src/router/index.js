import { useLoginStore } from '@/stores/login'
import BookmarkView from '@/views/BookmarkView.vue'
import CommentView from '@/views/CommentView.vue'
import CreateQuoteView from '@/views/CreateQuoteView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import MyQuotesView from '@/views/MyQuotesView.vue'
import ProfilView from '@/views/ProfilView.vue'
import QuoteDetailsView from '@/views/QuoteDetailsView.vue'
import RegisterView from '@/views/RegisterView.vue'
import SettingView from '@/views/SettingView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: { name: 'login' },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },

  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/addquote',
    name: 'add-quote',
    component: CreateQuoteView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/details/:id',
    name: 'details-quote',
    component: QuoteDetailsView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/comment/:id',
    name: 'comment-quote',
    component: CommentView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/bookmarks/:id',
    name: 'bookmark',
    component: BookmarkView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/myquotes',
    name: 'myQuotes',
    component: MyQuotesView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profil/:id',
    name: 'profil',
    component: ProfilView,
    meta: {
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

// router.beforeEach((to, from, next) => {
//   const loginStore = useLoginStore()
//   const logged = loginStore.token
//   if (!logged) {
//     next({ name: 'login' })
//   } else if (to.name === 'login' && logged) {
//     next({ name: 'home' })
//   } else {
//     next()
//   }
// })

// ✅ NOUVELLE MÉTHODE (Recommandée)
router.beforeEach((to, from) => {
  const loginStore = useLoginStore() // Si tu utilises Pinia

  if (to.meta.requiresAuth && !loginStore.token) {
    // On RETOURNE la destination au lieu d'appeler next()
    return { name: 'login' }
  }

  if (to.name === 'login' && loginStore.token) {
    return { name: 'home' }
  }
  if (to.name === 'register' && loginStore.token) {
    return { name: 'home' }
  }

  // Si tout est ok, on ne retourne rien (ou true)
})

export default router
