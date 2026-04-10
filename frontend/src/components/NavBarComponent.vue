<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useLoginStore } from '@/stores/login'
import { jwtDecode } from 'jwt-decode'
import { onMounted, ref, computed } from 'vue'
import { watch } from 'vue'
import {LogOut} from 'lucide-vue-next';

const loginStore = useLoginStore()
const router = useRouter()
const route = useRoute() // Pour savoir sur quelle page on est

const decoded = ref(null)

// Fonction pour décoder le token proprement
const decodeToken = () => {
  if (loginStore.token) {
    try {
      decoded.value = jwtDecode(loginStore.token)
      
    } catch (e) {
      console.error('Token invalide')
      loginStore.logout()
    }
  }
}

const handleLogout = () => {
  loginStore.logout()
  decoded.value = null
  router.push({ name: 'login' })
}
const isMenuOpen = ref(false)

// Ferme le menu quand on change de page
router.afterEach(() => {
  isMenuOpen.value = false
})

// Vérifie si un lien est actif pour changer sa couleur
const isActive = (routeName) => route.name === routeName

watch(
  () => loginStore.token,
  () => {
    decodeToken()
  },
  { immediate: true },
)
</script>

<template>
  <nav class="bg-white  shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between items-center">
        <!-- Logo -->
        <div class="flex shrink-0 items-center cursor-pointer" @click="router.push('/')">
          <span class="text-2xl font-black text-indigo-600 tracking-tighter">citApp</span>
        </div>

               <!-- Actions Droite + Bouton Mobile -->
        <div class="flex items-center gap-2">
          <!-- Desktop Actions (Login/User) -->
          <div class="flex items-center gap-4">
            <div class="flex justify-center gap-3" v-if="loginStore.token && decoded">
              <div
              @click="router.push({ name: 'profil', params: {id: decoded.sub} })"
                class="flex cursor-pointer items-center gap-2 px-3 py-1 md:bg-gray-50 md:rounded-full md:border md:border-gray-100"
              >
                <div
                  class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-extralight uppercase text-xs  overflow-hidden"
                >
                  <img
                    v-if="decoded?.avatar"
                    :src=" decoded.avatar || `http://localhost:4000/uploads/${decoded.avatar}`"
                    class="h-full w-full object-cover"
                  />
                  <span v-else>
                    {{ decoded?.username?.substring(0, 2) }}
                  </span>
                </div>
                <span class="text-sm hidden md:flex font-medium text-gray-700">{{ decoded?.username }}</span>
              </div>
              <LogOut @click="handleLogout" title="Deconnexion"
                class="cursor-pointer text-red-500 hover:text-red-600" />
            </div>
            <template v-else>
              <button
                @click="router.push({ name: 'login' })"
                class="cursor-pointer text-sm font-medium text-gray-600"
              >
                Connexion
              </button>
              <button
                @click="router.push({ name: 'register' })"
                class="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-bold"
              >
                S'inscrire
              </button>
            </template>
          </div>

          <!-- Bouton Dropdown Mobile (Hamburger) -->
          <!-- <button
            v-if="loginStore.token"
            @click="isMenuOpen = !isMenuOpen"
            class="cursor-pointer md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                v-if="!isMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button> -->
        </div>
      </div>
    </div>

    <!-- Menu Dropdown Mobile (Contenu) -->
    <!-- <div
      v-if="loginStore.token"
      v-show="isMenuOpen"
      class="md:hidden border-t border-gray-100 bg-white"
    >
      <div class="space-y-1 px-4 pb-3 pt-2">
        <button
          @click="router.push('/')"
          class="cursor-pointer block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
        >
          Accueil
        </button>
        <button
          class="cursor-pointer block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50"
        >
          Explorer
        </button>
        <button
          @click="router.push({ name: 'add-quote' })"
          class="cursor-pointer block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50"
        >
          Créer
        </button>
        <button
          @click="router.push({ name: 'profil', params: {id: decoded.sub} })"
          class="cursor-pointer block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50"
        >
          Profil
        </button>

        <div class="border-t border-gray-100 my-2 pt-2">
          <template v-if="loginStore.token">
            <div class="px-3 py-2 text-sm font-bold text-indigo-600 uppercase">
              {{ decoded?.username }}
            </div>
            <button
              @click="handleLogout"
              class="cursor-pointer block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
            >
              Déconnexion
            </button>
          </template>
          <template v-else>
            <button
              @click="router.push({ name: 'login' })"
              class="cursor-pointer block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700"
            >
              Connexion
            </button>
            <button
              @click="router.push({ name: 'register' })"
              class="cursor-pointer block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-600"
            >
              S'inscrire
            </button>
          </template>
        </div>
      </div>
    </div> -->
  </nav>
</template>

<style scoped>
/* Optionnel : transition douce pour le logo */
span {
  transition: transform 0.2s ease;
}
span:hover {
  transform: scale(1.02);
}
</style>
