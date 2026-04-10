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

// Vérifie si l'ID de l'utilisateur actuel est dans le tableau likesCount
// const isLiked = (quote) => {
//   return quote.likesCount.some((like) => {
//     const userIdInLike = like.user
//     return userIdInLike === decoded.value?.sub
//   })
// }

// const isMarked = (quote) => {
//   return quote.bookmarksCount.some((mark) => {
//     const userIdInMark = mark.user
//     return userIdInMark === decoded.value?.sub
//   })
// }

async function getQuotes() {
  try {
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

// async function liked(quoteId, userId) {
//   try {
//     const res = await fetch(`http://localhost:4000/api/likes?userId=${userId}&quoteId=${quoteId}`)
//     const existingLikes = await res.json()
//     // Si le like existe déjà (tableau non vide), on le supprime (Unlike)
//     if (existingLikes.length > 0) {
//       const likeId = existingLikes[0]._id
//       await fetch(`http://localhost:4000/api/likes/${likeId}`, {
//         method: 'DELETE',
//       })
//     } else {
//       const response = await fetch('http://localhost:4000/api/likes', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user: userId,
//           quote: quoteId,
//         }),
//       })
//     }
//     getQuotes()
//   } catch (error) {
//     console.error('Problème au cours du chargement :', error)
//   }
// }

// async function bookmarked(quoteId, userId) {
//   try {
//     const res = await fetch(
//       `http://localhost:4000/api/bookmarks?userId=${userId}&quoteId=${quoteId}`,
//     )

//     const existingBookmarks = await res.json()
//     // Si le mark existe déjà (tableau non vide), on le supprime (Unmark)
//     if (existingBookmarks?.length > 0) {
//       const markId = existingBookmarks[0]._id
//       await fetch(`http://localhost:4000/api/bookmarks/${markId}`, {
//         method: 'DELETE',
//       })
//     } else {
//       const response = await fetch('http://localhost:4000/api/bookmarks', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user: userId,
//           quote: quoteId,
//         }),
//       })
//     }
//     getQuotes()
//   } catch (error) {
//     console.error('Problème au cours du chargement :', error)
//   }
// }

watch(
  () => [search.value, limit.value, tags.value],
  () => {
    getQuotes()
  },
)

onMounted(getQuotes)
</script>

<template>
  <div class="bg-gray-100 min-h-screen pb-12 pt-5 px-4">
    <div class="mx-auto max-w-3xl sm:px-6 lg:px-8 space-y-6">
      <!-- 🔍 Barre de recherche + filtres -->
      <div
        class="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between"
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
      <div v-for="quote in filteredQuotes" :key="quote._id" class="bg-white shadow rounded-lg">
        <Quote :quote="quote" @userAction="getQuotes()" />
      </div>
    </div>

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

<style scoped></style>
