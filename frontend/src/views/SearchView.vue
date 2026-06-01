<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { formatDistanceToNow } from 'date-fns'
import { fr, id } from 'date-fns/locale'
import router from '@/router'
import { useLoginStore } from '@/stores/login'
import Quote from '@/components/Quote.vue'
import { listQuotes, listTags } from '@/services/quotes'
import { notifySuccess, notifyError, confirmDelete, notifyWarning } from '@/utils/notifications.js'
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
const tags = ref([])
const selectTags = ref([])

const filterPopu = ref(false)

// changer filtre
const setFilter = (toggle) => {
  filterPopu.value = toggle
}

const filteredQuotes = computed(() => {
  let result = [...quotes.value]

  // 🔍 recherche
  if (search.value.trim()) {
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
    if (!search.value.trim() && !selectTags.value.length) return;
    quotes.value = await listQuotes({
      page: page.value,
      limit: limit.value,
      search: search.value.trim(),
      tags: selectTags.value.join(','),
    })
  } catch (error) {
    notifyWarning('Aïe Aïe, problème au cours du chargement. Vérifiez votre connexion')
  }
}


const addTags = (tag) => {
  if (!selectTags.value.includes(tag)) {
    selectTags.value.push(tag)
  } else {
    selectTags.value = selectTags.value.filter(select => select !== tag)
  }
  getQuotes();
}

async function getTags() {
  try {
    if (!search.value && !tags.value) return;
    allTags.value = await listTags()
  } catch (error) {
    notifyWarning('Aïe Aïe, problème au cours du chargement. Vérifiez votre connexion')
  }
}

watch(
  () => [search.value, limit.value, tags.value],
  () => {
    getQuotes()
  },
)

onMounted(getQuotes)
onMounted(getTags)
</script>

<template>
  <div class="min-h-screen py-12 px-4 bg-gradient-to-b from-amber-50 to-white">
    <div class="mx-auto max-w-3xl sm:px-6 lg:px-8 space-y-6">
      <!-- 🔍 Barre de recherche + filtres -->
      <div class="bg-white shadow-lg rounded-lg p-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between border border-amber-200">
        <!-- Input recherche -->
        <div class="flex-1">
          <input v-model="search" type="text" placeholder="Rechercher une citation..."
            class="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-700 text-sm" />
        </div>

        <!-- Boutons filtres -->
        <div class="flex items-center gap-2">
          <button @click="setFilter(!filterPopu)"
            class="cursor-pointer px-3 py-2 text-sm font-medium rounded-md transition-colors" :class="filterPopu
                ? 'bg-amber-600 text-white'
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              ">
            🔥 Populaire
          </button>
        </div>
      </div>
      <div v-if="allTags.length > 0">
        <h2 class="text-amber-700 text-lg font-medium py-3" >#Tags</h2>
      <div class="flex gap-3 flex-wrap">
        <div
          class="cursor-pointer px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="selectTags.includes(tag) ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'"
          v-for="tag in allTags" @click="addTags(tag)" :value="tag">#{{ tag }}</div>
      </div>
      </div>
      <!-- 2. La boucle v-for uniquement sur la carte -->
      <div v-if="filteredQuotes.length > 0" v-for="quote in filteredQuotes" :key="quote._id"
        class="bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg rounded-lg border border-amber-200 hover:shadow-xl hover:shadow-amber-300 transition-all duration-300">
        <Quote :quote="quote" @userAction="getQuotes()" />
      </div>
      <div class="text-center h-100 content-center text-amber-600 animate-pulse" v-else>
        Aucune citation ne correspond à votre recherche.
      </div>
    </div>
  </div>
</template>

<style scoped></style>
