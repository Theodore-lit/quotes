<template>
  <div class="bg-gray-100 min-h-screen py-12">
    <div class="mx-auto max-w-3xl sm:px-6 lg:px-8">
      <!-- Header du Profil -->
      <div
        class="bg-white shadow sm:rounded-lg mb-8 p-6 flex items-center gap-6 border-b-4 border-indigo-600"
      >
        <div
          class="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white text-3xl font-bold uppercase shadow-inner"
        >
          {{ decoded?.username?.substring(0, 2) }}
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ decoded?.username }}</h1>
          <div class="flex justify-between gap-5">
            <p class="text-sm text-gray-500">{{ decoded?.email }}</p>
            <p class="text-sm text-gray-500">{{ decoded?.gender == 'M'? 'Homme': 'Femme' }}</p>
          </div>
          <p v-if="decoded?.bio" class="text-sm text-gray-500 py-2"><span class="text-indigo-400">Bio: </span> {{ decoded?.bio }}</p>
          <div
            class="mt-2 inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-800"
          >
            {{ quotes?.length || 0 }} publications
          </div>
        </div>
      </div>

    </div>
    <!-- Liste des citations de l'utilisateur -->
    <MyQuotesComponent/>
    <!-- Bouton flottant -->
    <button
      @click="router.push({ name: 'add-quote' })"
      class="cursor-pointer fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition-all hover:scale-110 active:scale-95 z-50"
    >
      <svg
        xmlns="http://www.w3.org"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2.5"
        stroke="currentColor"
        class="w-8 h-8"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { useLoginStore } from '@/stores/login'
import { jwtDecode } from 'jwt-decode'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MyQuotesComponent from '@/components/MyQuotesComponent.vue'

const router = useRouter()
const loginStore = useLoginStore()
const token = loginStore.token
const decoded = token ? jwtDecode(token) : null
const quotes = ref(null)

async function myQuotes() {
  try {
    const response = await fetch(`http://localhost:4000/api/quotes/userQuotes/${decoded.sub}`)
    if (!response.ok) throw new Error('Erreur réseau')
    const result = await response.json()
    // Si ton API renvoie { data: [...] }, ajuste ici
    quotes.value = result.data || result
  } catch (error) {
    console.error('Problème au cours du chargement :', error)
    quotes.value = []
  }
}


onMounted(myQuotes)
</script>
