<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { formatDistanceToNow } from 'date-fns'
import { fr, id } from 'date-fns/locale'
import router from '@/router'
import { useLoginStore } from '@/stores/login'
import Quote from '@/components/Quote.vue'
const loginStore = useLoginStore()
const decoded = ref('')
const timeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
}
const token = loginStore.token
if (token) {
  decoded.value = jwtDecode(token)
}
const quotes = ref([])
const allTags = ref([])
const page = ref('')
const limit = ref('')
const search = ref('')
const tags = ref('')

const filterPopu = ref(false)

// changer filtre
const setFilter = (toggle) => {
  filterPopu.value = toggle
}

const filteredQuotes = computed(() => {
  let result = [...quotes.value]

  // 🔍 recherche
  if (search.value) {
    result = result.filter((q) => q.text.toLowerCase().includes(search.value.toLowerCase()))
  }

  // 🔥 tri
  if (filterPopu.value == true) {
    result.sort((a, b) => (b.likesCount?.length || 0) - (a.likesCount?.length || 0))
  } else {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  return result
})

async function getQuotes() {
  try {
    if (!search.value && !tags.value) return;
    const response = await fetch(
      `http://localhost:4000/api/quotes?page=${page.value}&limit=${limit.value}&search=${search.value}&tags=${tags.value}`,
    )
    if (!response.ok) throw new Error('Erreur réseau')
    const result = await response.json()
    quotes.value = result.data
    allTags.value = result.allTags
  } catch (error) {
    console.error('Problème au cours du chargement :', error)
  }
}

watch(
  () => [search.value, limit.value, tags.value],
  () => {
    getQuotes()
  },
)

onMounted(getQuotes)
</script>

<template>
  <div class=" min-h-screen py-12">
    <div class="mx-auto max-w-3xl sm:px-6 lg:px-8 space-y-6">
      <!-- 🔍 Barre de recherche + filtres -->
      <div
        class="bg-white shadow sm:rounded-lg p-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between"
      >
        <!-- Input recherche -->
        <div class="flex-1">
          <input
            v-model="search"
            type="text"
            placeholder="Rechercher une citation..."
            class="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <!-- Boutons filtres -->
        <div class="flex items-center gap-2">
          <select
            v-model="tags"
            class="cursor-pointer px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium rounded-md transition-colors"
          >
            <option value="">Tout les Tags</option>
            <option v-for="tags in allTags" :value="tags">{{tags}}</option>
          </select>

          <button
            @click="setFilter(!filterPopu)"
            class="cursor-pointer px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="
              filterPopu
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            "
          >
            Populaire
          </button>
        </div>
      </div>
      <!-- 2. La boucle v-for uniquement sur la carte -->
      <div v-if="filteredQuotes.length > 0" v-for="quote in filteredQuotes" :key="quote._id" class="bg-white shadow sm:rounded-lg">
        <Quote :quote="quote" @userAction="getQuotes()" />
      </div> 
      <div v-else >
        Aucune citation ne correspond à votre recherche. 
      </div>
    </div>
  </div>
</template>

<style scoped></style>
