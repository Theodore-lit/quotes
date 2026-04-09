<script setup>
import { useLoginStore } from '@/stores/login'
import { useEditStore } from '@/stores/edit'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale/fr'
import { jwtDecode } from 'jwt-decode'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const editStore = useEditStore()
const loginStore = useLoginStore()
const decoded = ref('')
const timeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
}
const token = loginStore.token
if (token) {
  decoded.value = jwtDecode(token)
}

const isLiked = (quote) => {
  return quote.likesCount.some((like) => {
    const userIdInLike = like.user
    return userIdInLike === decoded.value?.sub
  })
}

const isMarked = (quote) => {
  return quote.bookmarksCount.some((mark) => {
    const userIdInMark = mark.user
    return userIdInMark === decoded.value?.sub
  })
}

async function liked(quoteId, userId) {
  try {
    const res = await fetch(`http://localhost:4000/api/likes?userId=${userId}&quoteId=${quoteId}`)
    const existingLikes = await res.json()
    // Si le like existe déjà (tableau non vide), on le supprime (Unlike)
    if (existingLikes.length > 0) {
      const likeId = existingLikes[0]._id
      await fetch(`http://localhost:4000/api/likes/${likeId}`, {
        method: 'DELETE',
      })
    } else {
      const response = await fetch('http://localhost:4000/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: userId,
          quote: quoteId,
        }),
      })
    }
    emit('userAction')
  } catch (error) {
    console.error('Problème au cours du chargement :', error)
  }
}

async function bookmarked(quoteId, userId) {
  try {
    const res = await fetch(
      `http://localhost:4000/api/bookmarks?userId=${userId}&quoteId=${quoteId}`,
    )

    const existingBookmarks = await res.json()
    // Si le mark existe déjà (tableau non vide), on le supprime (Unmark)
    if (existingBookmarks?.length > 0) {
      const markId = existingBookmarks[0]._id
      await fetch(`http://localhost:4000/api/bookmarks/${markId}`, {
        method: 'DELETE',
      })
    } else {
      const response = await fetch('http://localhost:4000/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: userId,
          quote: quoteId,
        }),
      })
    }
    emit('userAction')
  } catch (error) {
    console.error('Problème au cours du chargement :', error)
  }
}

// Suppression et modification
async function deleteQuote(id) {
  const response = await fetch(`http://localhost:4000/api/quotes/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Erreur réseau')
  myQuotes()
}

async function editQuote(quoteId) {
  try {
    const res = await fetch(`http://localhost:4000/api/quotes/${quoteId}`)
    const quote = await res.json()
    editStore.toEdit(quote.data)
    router.push('/addquote')
  } catch (error) {
    console.log(error)
  }
}


const props = defineProps({
  quote: Object,
})

const emit = defineEmits(['userAction'])
const isHovered = ref(false)
</script>

<template>
  <div class="px-4 py-5 sm:p-6">

    <div v-if="decoded.sub == props.quote.author"
      class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button @click="editQuote(props.quote._id)" class="p-1 text-blue-600 hover:bg-blue-50 rounded">
        <svg xmlns="http://www.w3.org" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </button>
      <button @click="deleteQuote(props.quote._id)" class="p-1 text-red-600 hover:bg-red-50 rounded">
        <svg xmlns="http://www.w3.org" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </button>
    </div>
    <!-- Header : Avatar + Info -->
    <div class="relative inline-block" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
      <div class="flex items-center gap-3 mb-4 cursor-pointer">
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold uppercase text-sm overflow-hidden">
          <img v-if="props.quote.author?.avatar" :src="`http://localhost:4000/uploads/${props.quote.author.avatar}`"
            class="h-full w-full object-cover" />
          <span v-else>{{ props.quote.author?.username?.substring(0, 2) }}</span>
        </div>
        <div>
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            {{ props.quote.author?.username }}
          </h3>
          <p class="text-xs font-medium text-indigo-600">{{ timeAgo(props.quote.createdAt) }}</p>
        </div>

      </div>

      <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1" name="fade">
        <article v-if="isHovered"
          class="absolute z-50 bottom-full left-0 mb-2 w-64 p-4 bg-white rounded-lg shadow-2xl border border-gray-200">
          <div class="absolute h-4 w-full top-full left-0 bg-transparent"></div>

          <div class="flex flex-col gap-2">
            <h4 class="font-bold text-gray-800">{{ props.quote.author?.username }}</h4>
            <p class="text-sm text-gray-600 leading-tight">
              {{ props.quote.author?.bio || 'Passionné de développement full-stack.' }}
            </p>
            <div class="border-t pt-2 mt-2">
              <button @click="router.push({ name: 'profil', params: { id: props.quote.author._id } })"
                class="text-xs cursor-pointer bg-indigo-600 text-white px-3 py-1 rounded">
                Voir le profil
              </button>
            </div>
          </div>
        </article>
      </Transition>
    </div>

    <div class="mt-2 max-w-xl text-sm text-gray-700">
      <p>{{ props.quote.text }}</p>
    </div>
    <div class="mt-3 flex gap-4 text-sm text-gray-600">
      <p class="p-1 bg-indigo-200 rounded-lg" v-for="tags in props.quote.tags">#{{ tags }}</p>
    </div>

    <div v-if="props.quote.image" class="mt-4 overflow-hidden rounded-lg border border-gray-200">
      <img :src="`http://localhost:4000/uploads/${props.quote.image}`" alt="Image de la citation"
        class="w-full h-auto object-cover" />
    </div>

    <!-- Section Boutons -->
    <div class="mt-6 flex items-center gap-6 border-t border-gray-100 pt-4">
      <!-- Coeur (Like) -->
      <button @click="liked(props.quote._id, decoded.sub)"
        class="cursor-pointer group flex items-center gap-1 transition-colors"
        :class="isLiked(props.quote) ? 'text-red-600' : 'text-gray-500 hover:text-red-500'">
        <svg xmlns="http://www.w3.org" :fill="isLiked(props.quote) ? 'currentColor' : 'none'" viewBox="0 0 24 24"
          stroke-width="1.5" stroke="currentColor" class="w-6 h-6 transition-all duration-200"
          :class="{ 'scale-125': isLiked(props.quote) }">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
        <span class="text-xs font-bold">{{ props.quote.likesCount?.length || 0 }}</span>
      </button>

      <!-- Commentaire -->
      <button @click="router.push({ name: 'comment-quote', params: { id: props.quote._id } })"
        class="cursor-pointer group flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
        <svg xmlns="http://www.w3.org" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48L4.32 21l3.364-1.121c1.332.242 2.733.371 4.316.371Z" />
        </svg>
        <span class="text-xs">{{ props.quote.commentsCount?.length || 0 }}</span>
      </button>

      <!-- Favoris -->
      <button @click="bookmarked(props.quote._id, decoded.sub)"
        class="cursor-pointer group flex items-center gap-1 text-gray-500 hover:text-yellow-500 transition-colors"
        :class="isMarked(props.quote) ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-500'">
        <svg xmlns="http://www.w3.org" :fill="isMarked(props.quote) ? 'currentColor' : 'none'" viewBox="0 0 24 24"
          stroke-width="1.5" stroke="currentColor" class="w-5 h-5" :class="{ 'scale-90': isMarked(props.quote) }">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
        <!-- <span class="text-xs">{{ props.quote.bookmarksCount?.length || 0 }}</span> -->
      </button>
    </div>
  </div>
</template>

<style scoped></style>
