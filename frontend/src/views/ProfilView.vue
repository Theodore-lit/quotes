<template>
  <div class="min-h-screen py-10 px-4 bg-gradient-to-b from-amber-50 to-white">
    <div class="mx-auto max-w-3xl sm:px-6 lg:px-8">
      <!-- Header du Profil -->
      <div
        class="relative bg-white shadow-lg rounded-lg py-8 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b-4 border-amber-600">

        <div
          class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white font-bold uppercase text-2xl overflow-hidden border-2 border-amber-300">
          <img v-if="user?.avatar"
            :src="user.avatar.startsWith('http') ? user.avatar : `${baseUrl}/uploads/${user.avatar}`"
            class="h-full w-full object-cover" alt="Profile" />
          <span v-else>{{ user?.username?.substring(0, 1) }}</span>
        </div>

        <div class="flex-1 text-center sm:text-left">
          <h1 class="text-2xl font-bold text-gray-900">{{ user?.username }}</h1>
          <div class="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-1">
            <p class="text-sm text-amber-700">{{ user?.email }}</p>
          </div>
          <p v-if="user?.bio" class="text-sm text-gray-600 py-2">
            <span class="text-gray-800 font-medium">Bio: </span> {{ user?.bio }}
          </p>
          <p v-if="user?.gender" class="text-sm text-gray-600">
           <span class="text-gray-800 font-medium">Sexe: </span> {{ user?.gender == 'M' ? 'Masculin' : 'Feminin' }}
            </p>
        </div>

        <div v-if="user?._id == decoded?.sub"
          class="w-full sm:w-auto sm:absolute sm:right-5 sm:top-6 flex flex-row-reverse sm:flex-col-reverse gap-2 sm:gap-4 justify-center">

          <button @click="handleLogout"
            class="flex-1 sm:flex-none cursor-pointer text-center px-4 py-2 rounded-lg text-sm font-semibold text-red-600 border border-red-100 hover:bg-red-50 transition-colors">
            Déconnexion
          </button>

          <button @click="router.push({ name: 'settings' })"
            class="flex-1 sm:flex-none cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-700 px-4 py-2 text-white transition-colors shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
              <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.06A1.65 1.65 0 0 0 11 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.06a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.06A1.65 1.65 0 0 0 20.91 9H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span class="text-sm font-medium">Paramètres</span>
          </button>
        </div>
      </div>
    </div>
    <!-- Liste des citations de l'utilisateur -->
    <MyQuotesView />
  </div>
</template>

<script setup>
import userService from '@/services/user.js'
import { useLoginStore } from '@/stores/login'
import { jwtDecode } from 'jwt-decode'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MyQuotesView from '@/views/MyQuotesView.vue'
import OPTmodal from '@/ui/OPTmodal.vue'
import { notifySuccess, notifyError, confirmDelete, notifyWarning, confirmLogout } from '@/utils/notifications.js'
const baseUrl = import.meta.env.VITE_API_URL;


const router = useRouter()
const route = useRoute()
const loginStore = useLoginStore()
const token = loginStore.token
const decoded = token ? jwtDecode(token) : null
const user = ref(null)

async function myQuotes() {
  try {
    const response = await userService.getUserById(route.params.id)
    user.value = response.data.data || response.data
  } catch (error) {
    notifyWarning('Aïe Aïe, problème au cours du chargement. Vérifiez votre connexion')
    user.value = []
  }
}

async function handleLogout() {
  try {
    const confirm = await confirmLogout()
    if (!confirm) return
    loginStore.logout()
    decoded.value = null
    router.push({ name: 'login' })
  } catch (error) {

  }
}

onMounted(myQuotes)
</script>
