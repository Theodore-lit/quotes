<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { useLoginStore } from '@/stores/login'
import { useWebSocketStore } from '@/stores/webSocketStore' // 1. Importe le store
import Quote from '@/components/Quote.vue'
import { listQuotes } from '@/services/quotes'

const loginStore = useLoginStore()
const socketStore = useWebSocketStore() // 2. Initialise le store

const decoded = ref('')
const search = ref('')
const filterPopu = ref(false)

// 3. On utilise socketStore.quotes au lieu de la ref locale
// On peut garder page et limit ici ou les mettre dans le store
const page = ref('')
const limit = ref('')

const token = loginStore.token
if (token) {
  decoded.value = jwtDecode(token)
}

// 4. Ta computed écoute maintenant le store
const filteredQuotes = computed(() => {
  let result = [...socketStore.quotes] // On pioche dans le store !

  if (search.value) {
    result = result.filter((q) => q.text.toLowerCase().includes(search.value.toLowerCase()))
  }

  if (filterPopu.value) {
    result.sort((a, b) => (b.likesCount?.length || 0) - (a.likesCount?.length || 0))
  } else {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  return result
})
async function getQuotes() {
  try {
    const data = await listQuotes({
      page: page.value,
      limit: limit.value,
      search: search.value,
    })
    // 5. On remplit le store avec les données de l'API
    socketStore.quotes = data
  } catch (error) {
    console.error('Problème au cours du chargement :', error)
  }
}

watch(() => [search.value, limit.value], getQuotes)

onMounted(() => {
  socketStore.initSocket() // 6. On lance les écouteurs d'événements
  getQuotes() // 7. On charge les données initiales
})
</script>

<template>
  <div class=" min-h-screen pb-8 pt-5 space-y-6 px-4">

      <div class="py-10 flex flex-col items-center gap-4">
  <h2 class="text-2xl italic md:text-4xl font-bold text-center tracking-tight text-gray-800">
    Découvrez les meilleures citations avec 
    <span class="text-amber-500">citApp</span>
  </h2>

  <div 
    v-if="filteredQuotes.length > 1" 
    class="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-100 my-2 text-amber-700 text-sm font-semibold border border-amber-200 shadow-sm transition-all hover:scale-105"
  >
    <span class="relative flex h-2 w-2 mr-2">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
    </span>
    Plus de {{ filteredQuotes.length }} pépites à lire
  </div>
</div>
      <div v-for="quote in filteredQuotes" :key="quote._id" class="bg-white shadow rounded-lg">
        <Quote :quote="quote" @userAction="getQuotes()" />
      </div>
  </div>
</template>

<style scoped></style>
