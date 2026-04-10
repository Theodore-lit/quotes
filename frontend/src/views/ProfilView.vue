<template>
  <div class="min-h-screen py-10">
    <div class="mx-auto max-w-3xl sm:px-6 lg:px-8">
      <!-- Header du Profil -->
      <div
        class="relative bg-white shadow sm:rounded-lg mb-8 p-6 flex items-center gap-6 border-b-4 border-indigo-600"
      >
        <div
          class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold uppercase text-2xl overflow-hidden"
        >
          <img
            v-if="user?.avatar"
            :src="user.avatar ||`http://localhost:4000/uploads/${user.avatar}`"
            class="h-full w-full object-cover"
            alt="Profile"
          />
          <span v-else>
            {{ user?.username?.substring(0, 2) }}
          </span>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ user?.username }}</h1>
          <div class="flex justify-between gap-5">
            <p class="text-sm text-gray-500">{{ user?.email }}</p>
            <p class="text-sm text-gray-500">{{ user?.gender == 'M' ? 'Homme' : '' }}</p>
            <p class="text-sm text-gray-500">{{ user?.gender == 'F' ? 'Femme' : '' }}</p>
          </div>
          <p v-if="user?.bio" class="text-sm text-gray-500 py-2">
            <span class="text-gray-800 font-medium">Bio: </span> {{ user?.bio }}
          </p>
        </div>

        <!-- @click="askModification()" -->
        <div v-if="user?._id == decoded?.sub">
          <span
            @click="router.push({ name: 'settings' })"
            class="absolute right-5 cursor-pointer hover:bg-amber-200 cursor-prointer top-5 inline-flex items-center justify-center rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-4 h-4"
            >
              <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.06A1.65 1.65 0 0 0 11 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.06a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.06A1.65 1.65 0 0 0 20.91 9H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
              />
            </svg>

            <p class="text-sm px-1 whitespace-nowrap">Paramètres</p>
          </span>

          <button
            @click="handleLogout"
            class="cursor-pointer block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
    <!-- Liste des citations de l'utilisateur -->
    <MyQuotesView />
  </div>
</template>

<script setup>
import { useLoginStore } from '@/stores/login'
import { jwtDecode } from 'jwt-decode'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MyQuotesView from '@/views/MyQuotesView.vue'
import OPTmodal from '@/ui/OPTmodal.vue'

const router = useRouter()
const route = useRoute()
const loginStore = useLoginStore()
const token = loginStore.token
const decoded = token ? jwtDecode(token) : null
const user = ref(null)

async function myQuotes() {
  try {
    const response = await fetch(`http://localhost:4000/api/auth/profil/${route.params.id}`)
    if (!response.ok) throw new Error('Erreur réseau')
    const result = await response.json()
    // Si ton API renvoie { data: [...] }, ajuste ici
    user.value = result.data || result
  } catch (error) {
    console.error('Problème au cours du chargement :', error)
    user.value = []
  }
}

const handleLogout = () => {
  loginStore.logout()
  decoded.value = null
  router.push({ name: 'login' })
}

onMounted(myQuotes)
</script>
