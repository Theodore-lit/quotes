<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router' // Importe useRoute et useRouter
// import decoded from '@/services/user'
import { formatDistanceToNow } from 'date-fns' // Décommente l'import
import { fr } from 'date-fns/locale'
import { useLoginStore } from '@/stores/login'
const route = useRoute() // Initialise la route actuelle
const router = useRouter() // Ajoute router
const loginStore = useLoginStore()
import { jwtDecode } from 'jwt-decode'
import Quote from '@/components/Quote.vue'
let decoded = ref('')
const token = loginStore.token
if (token) {
  decoded.value = jwtDecode(token)
}


const toEdit = ref(null);
const quote = ref(null) // Renommé 'quotes' en 'quote' car c'est un seul élément
const quoteId = route.params.id // Utilise 'route' et non 'router'

const timeAgo = (date) => {
  if (!date) return ''
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
}

// Vérification si l'actuel user a déjà cliqué
const isLiked = (comment) => {
  return comment.likesCount.some((like) => {
    const userIdInLike = like.user
    return userIdInLike === decoded.value?.sub
  })
}

// Pas besoin de 'export' ici si c'est utilisé uniquement dans ce composant
async function getQuoteDetails() {
  try {
    const response = await fetch(`http://localhost:4000/api/quotes/${quoteId}`)
    if (!response.ok) throw new Error('Erreur réseau')

    const result = await response.json()
    // Vérifie si ton API renvoie { data: ... } ou directement l'objet
    quote.value = result.data || result
  } catch (error) {
    console.error('Problème au cours du chargement :', error)
  }
}

const comments = ref('')
async function listComment() {
  try {
    const response = await fetch(
      `http://localhost:4000/api/comments?page=${1}&limit=${5}&quoteId=${quoteId}`,
    )
    const result = await response.json()
    comments.value = result.items
  } catch (err) {
    console.error(err)
  }
}
const newComment = ref('')

async function sendComment() {
  // Logique pour POST le commentaire vers /api/comments
  try {
    if (!newComment.value.trim()) return
    const res = await fetch('http://localhost:4000/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: decoded.value?.sub,
        text: newComment.value,
        quote: quoteId,
      }),
    })
    if (!res.ok) return console.log('Impossible de Commenter')
    // Après l'envoi réussi, vider le champ et rafraîchir
    listComment()
    newComment.value = ''
  } catch (error) {
    console.error(error)
  }
}

// Like des commentaires
async function liked(commentId, userId) {
  try {
    const res = await fetch(`http://localhost:4000/api/likes/comment?userId=${userId}&commentId=${commentId}`)
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
          comment: commentId,
        }),
      })
    }
    emit('userAction')
  } catch (error) {
    console.error('Problème au cours du chargement :', error)
  }
}

// Supprimer et modifier un commentaire
async function deleteComment(id) {
  const response = await fetch(`http://localhost:4000/api/comments/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Erreur réseau')
  listComment()
}

async function editComment(id) {
  try {
    const res = await fetch(`http://localhost:4000/api/comments/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`, // Toujours envoyer le token
      },
      body: JSON.stringify({
        text: newComment.value,
      }),
    })
    const quote = await res.json()
    // editStore.toEdit(quote.data)
    // router.push({name: 'comment-quote',hash:'commentForm'})
  } catch (error) {
    console.log(error)
  }
}

const handleSend=()=> {
  if (toEdit.value) {
    editComment(toEdit.value);
  } else {
    sendComment();
  }
  toEdit.value = null;
}

// Appelle la fonction au montage du composant
onMounted(getQuoteDetails)
onMounted(listComment)
</script>

<template>
  <div class="bg-gray-100 min-h-screen py-12">
    <div class="relative mx-auto max-w-3xl sm:px-6 lg:px-8">
      <!-- Carte de la Citation (Style identique) -->
      <div v-if="quote" class="bg-white shadow sm:rounded-lg overflow-hidden">
        <Quote :quote="quote" @userAction="getQuoteDetails" />
      </div>
      <!-- Section Commentaires -->
      <div class="bg-gray-50 border-t border-gray-200 px-4 py-6 sm:px-6">
        <h4 class="text-sm font-semibold text-gray-900 mb-4">Commentaires</h4>
        <!-- Liste des commentaires existants -->
        <ul class="mt-8 space-y-6">
          <li v-for="comment in comments[0]" :key="comment._id" class="flex gap-3">
            <div v-if="decoded.sub == comment.user"
              class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="toEdit = comment._id" class="p-1 text-blue-600 hover:bg-blue-50 rounded">
                <svg xmlns="http://www.w3.org" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                  class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
              <button @click="deleteComment(comment._id)" class="p-1 text-red-600 hover:bg-red-50 rounded">
                <svg xmlns="http://www.w3.org" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                  class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs uppercase">
              {{ comment.user?.username?.substring(0, 2) }}
            </div>
            <div class="flex-1 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <div class="flex items-center justify-between">
                <h5 class="text-sm font-bold text-gray-900">{{ comment.user?.username }}</h5>
                <span class="text-xs text-gray-500">{{ timeAgo(comment.createdAt) }}</span>
              </div>
              <p class="mt-1 text-sm text-gray-600">{{ comment.text }}</p>
            </div>
            <!-- Coeur (Like) -->
            <button @click="liked(comment._id, decoded.sub)"
              class="cursor-pointer group flex items-center gap-1 transition-colors"
              :class="isLiked(comment) ? 'text-black' : 'text-gray-300 hover:text-gray-600'">
              <svg xmlns="http://www.w3.org" :fill="isLiked(comment) ? 'currentColor' : 'none'" viewBox="0 0 24 24"
                stroke-width="1.5" stroke="currentColor" class="w-5 h-5 transition-all duration-200"
                :class="{ 'scale-120': isLiked(comment) }">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              <span class="text-xs font-bold">{{ comment.likesCount?.length || 0 }}</span>
            </button>
          </li>
        </ul>
      </div>

      <!-- Loader -->
      <div v-if="!quote" class="text-center py-10">
        <p class="text-gray-500 animate-pulse">Chargement de la citation...</p>
      </div>

      <!-- Formulaire pour ajouter un commentaire -->
      <div id="commentForm" class="flex gap-3 sticky">
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-400 text-white text-xs uppercase">
          {{ decoded.value?.username?.substring(0, 2) || '?' }}
        </div>
        <div class="min-w-0 flex-1">
          <form @submit.prevent="handleSend">
            <textarea v-model="newComment" rows="2"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              placeholder="Ajouter un commentaire..."></textarea>
            <div class="mt-2 flex justify-end">
              <button type="submit"
                class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                {{ toEdit ? 'Mettre à jour' : 'Publier' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- <Quote v-if="quote" :quote="quote" @userAction="getQuoteDetails()" /> -->


    </div>

    <!-- Bouton flottant -->
    <button @click="router.push({ name: 'add-quote' })"
      class="cursor-pointer fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition-all hover:scale-110 active:scale-95 z-50">
      <svg xmlns="http://www.w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"
        class="w-8 h-8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>
  </div>
</template>
