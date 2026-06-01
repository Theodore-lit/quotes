<script setup>
import { ref, onMounted, computed } from 'vue'
import { notifySuccess, notifyError, confirmDelete, notifyWarning } from '@/utils/notifications.js';
import { useRoute, useRouter } from 'vue-router' // Importe useRoute et useRouter
// import decoded from '@/services/user'
import { formatDistanceToNow } from 'date-fns' // Décommente l'import
import { fr } from 'date-fns/locale'
import { useLoginStore } from '@/stores/login'
import { useWebSocketStore } from '@/stores/webSocketStore' 
const baseUrl = import.meta.env.VITE_API_URL;
const route = useRoute() // Initialise la route actuelle
const router = useRouter() // Ajoute router
const loginStore = useLoginStore()
import { jwtDecode } from 'jwt-decode'
import { getQuoteById } from '@/services/quotes'
import {
  listComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment as deleteCommentRequest,
} from '@/services/comments'
import { getLikesForComment, likeComment, unLikeComment, unlikeLike } from '@/services/likes'
import Quote from '@/components/Quote.vue'
const socketStore = useWebSocketStore()
let decoded = ref('')
const token = loginStore.token
if (token) {
  decoded.value = jwtDecode(token)
}

const toEdit = ref(null);
const quote = ref(null) // Renommé 'quotes' en 'quote' car c'est un seul élément
const quoteId = route.params.id // Utilise 'route' et non 'router'

async function editing(id) {
  try {
    const comment = await getCommentById(id)
    newComment.value = comment.data.text
    toEdit.value = id
  } catch (error) {
    notifyError(error)
  }
}

const timeAgo = (date) => {
  if (!date) return ''
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
}

// Vérification si l'actuel user a déjà cliqué
const isLiked = (comment) => {
  return comment?.likesCount?.find((like) =>
    like.user._id == decoded.value?.sub
  )
}

// Pas besoin de 'export' ici si c'est utilisé uniquement dans ce composant
async function getQuoteDetails() {
  try {
    quote.value = await getQuoteById(quoteId)
  } catch (error) {
    notifyError('Problème au cours du chargement :', error)
  }
}

async function listComment() {
  try {
    const response = await listComments({ page: 1, limit: 15, quoteId });
    socketStore.comments = response.items || [];    
  } catch (err) {
    notifyError(err)
  }
}
const comments = computed(()=> {
   let  result = [...socketStore.comments]; // On pioche dans le store !
  // const quoteId = route.params.id
  // if (quoteId) {
  //   result = result.filter(comment => comment.quote == quoteId)
  // }
  result = result?.filter(comment => comment)
  return result
})
const newComment = ref('')

async function sendComment() {
  // Logique pour POST le commentaire vers /api/comments
  try {
    await createComment({
      user: decoded.value?.sub,
      text: newComment.value,
      quote: quoteId,
    })
    notifySuccess("Commentaire ajouté avec success")
    // Après l'envoi réussi, vider le champ et rafraîchir
    listComment()
    newComment.value = ''
  } catch (error) {
    notifyError(error)
  }
}

// Like des commentaires
async function liked(commentId, userId) {
  try {
    const existingLikes = await getLikesForComment({ userId, commentId })

    // Si le like existe déjà (tableau non vide), on le supprime (Unlike)
    if (existingLikes.length > 0) {
      const likeId = existingLikes[0]._id
      await unLikeComment(likeId)
    } else {
      await likeComment({ user: userId, comment: commentId })
    }
    listComment()
  } catch (error) {
    notifyError('Problème au cours du chargement :', error)
  }
}

// Supprimer et modifier un commentaire
async function deleteComment(id) {
  try {
    const confirm = await confirmDelete("Voulez-vous vraiment supprimer ce commentaire ?");
    if (!confirm) return;
    await deleteCommentRequest(id)
    listComment()
  } catch (error) {
    notifyError("Impossible de supprimer")
  }
}

async function editComment(id) {
  try {
    await updateComment(id, { text: newComment.value })
    newComment.value = ''
    notifySuccess("Modifier avec success")
    listComment()
  } catch (error) {
    notifyError('Impossible de modifier')
  }
}

const handleSend = () => {
  if (toEdit.value) {

    editComment(toEdit.value);
  } else {
    sendComment();
  }
  toEdit.value = null;
}

// Appelle la fonction au montage du composant
onMounted(() => {
  socketStore.initSocket()
  listComment() //  On charge les données initiales
  getQuoteDetails()
})
</script>

<template>
  <div class=" min-h-screen py-12 px-4">
    <div class="relative mx-auto max-w-3xl sm:px-6 lg:px-8">
      <!-- Carte de la Citation (Style identique) -->
      <div v-if="quote" class="bg-white shadow sm:rounded-lg overflow-hidden">
        <Quote :quote="quote" @userAction="getQuoteDetails" />
      </div>
      <!-- Section Commentaires -->
      <div class=" my-10 px-4 py-6 sm:px-6">
        <h4 class="text-sm font-semibold mb-4">Commentaires</h4>
        <!-- Liste des commentaires existants -->

        <ul v-if="comments?.length > 0" class="mt-8 space-y-6">
          <li v-for="comment in comments" :key="comment._id" class="group flex gap-3">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white font-bold uppercase text-2xl overflow-hidden">
              <img v-if="comment.user?.avatar"
                :src="comment.user?.avatar || `${baseUrl}/uploads/${comment.user?.avatar}`"
                class="h-full w-full object-cover" alt="Profile" />
              <span v-else>
                {{ comment.user?.username?.substring(0, 1) }}
              </span>
            </div>
            <div class="flex-1 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center gap-2">
                  <h5 class="text-sm font-bold text-gray-900">{{ comment.user?.username }}</h5>
                  <span class="text-xs text-gray-500">{{ timeAgo(comment.createdAt) }}</span>
                </div>

                <div v-if="decoded?.sub == comment.user?._id"
                  class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="editing(comment._id)" class="cursor-pointer p-1 text-blue-600 ">
                    <svg xmlns="http://www.w3.org" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  <button @click="deleteComment(comment._id)" class="cursor-pointer p-1 text-red-600 ">
                    <svg xmlns="http://www.w3.org" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
              <p class="mt-1 text-sm text-gray-600">{{ comment.text }}</p>
            </div>
            <!-- Coeur (Like) -->
            <button @click="liked(comment._id, decoded.sub)"
              class="cursor-pointer group flex items-center gap-1 transition-colors"
              :class="isLiked(comment) ? 'text-red-800' : 'text-gray-500 hover:text-red-600'">
              <svg xmlns="http://www.w3.org" :fill="isLiked(comment) ? 'currentColor' : 'none'" viewBox="0 0 24 24"
                stroke-width="1.5" stroke="currentColor" class="w-4 h-4 transition-all duration-200"
                :class="{ 'scale-120': isLiked(comment) }">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              <span class="text-xs font-bold">{{ comment.likesCount?.length || 0 }}</span>
            </button>
          </li>
        </ul>
          <p v-else class="text-gray-500 text-sm italic">Aucun commentaire pour le moment. Soyez le premier à commenter !</p>
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
              class="cursor-pointer block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border"
              placeholder="Ajouter un commentaire..."></textarea>
            <div class="mt-2 flex justify-end">
              <button type="submit"
                class="cursor-pointer inline-flex items-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
                {{ toEdit ? 'Mettre à jour' : 'Publier' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- <Quote v-if="quote" :quote="quote" @userAction="getQuoteDetails()" /> -->


    </div>


  </div>
</template>
