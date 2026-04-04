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

const quote = ref(null) // Renommé 'quotes' en 'quote' car c'est un seul élément
const quoteId = route.params.id // Utilise 'route' et non 'router'

const timeAgo = (date) => {
  if (!date) return ''
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
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

// Appelle la fonction au montage du composant
onMounted(getQuoteDetails)
onMounted(listComment)
</script>

<template>
  <div class="bg-gray-100 min-h-screen py-12">
    <div class="mx-auto max-w-3xl sm:px-6 lg:px-8">
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
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs uppercase"
            >
              {{ comment.user?.username?.substring(0, 2) }}
            </div>
            <div class="flex-1 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <div class="flex items-center justify-between">
                <h5 class="text-sm font-bold text-gray-900">{{ comment.user?.username }}</h5>
                <span class="text-xs text-gray-500">{{ timeAgo(comment.createdAt) }}</span>
              </div>
              <p class="mt-1 text-sm text-gray-600">{{ comment.text }}</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Formulaire pour ajouter un commentaire -->
      <div class="flex gap-3">
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-400 text-white text-xs uppercase"
        >
          {{ decoded.value?.username?.substring(0, 2) || '?' }}
        </div>
        <div class="min-w-0 flex-1">
          <form @submit.prevent="sendComment">
            <textarea
              v-model="newComment"
              rows="2"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              placeholder="Ajouter un commentaire..."
            ></textarea>
            <div class="mt-2 flex justify-end">
              <button
                type="submit"
                class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Publier
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- <Quote v-if="quote" :quote="quote" @userAction="getQuoteDetails()" /> -->

      <!-- Loader -->
      <div v-if="!quote" class="text-center py-10">
        <p class="text-gray-500 animate-pulse">Chargement de la citation...</p>
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
