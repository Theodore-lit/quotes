<template>
  <div class="min-h-screen py-12 px-4 bg-gradient-to-b from-amber-50 to-white">
    <div class="mx-auto max-w-3xl sm:px-6 lg:px-8 space-y-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 px-4 sm:px-0">Mes Favoris</h2>

      <!-- État de chargement -->
      <div v-if="!quotes" class="text-center py-10">
        <p class="text-amber-600 animate-pulse">Chargement de vos favoris...</p>
      </div>

      <!-- Liste des citations mises en favoris -->
      <template v-else-if="quotes.length > 0">
        <div
          v-for="quote in quotes"
          :key="quote._id"
          class="bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg rounded-lg overflow-hidden border border-amber-200 hover:shadow-xl hover:shadow-amber-300 transition-all duration-300"
        >
          <div class="px-4 py-5 sm:p-6">
            <!-- Header : Identique à l'accueil -->
            <div class="flex items-center gap-3 mb-4">
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white font-bold uppercase text-sm"
              >
                {{ quote.author?.username?.substring(0, 2) }}
              </div>
              <div>
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                  {{ quote.author?.username }}
                </h3>
                <p class="text-xs text-amber-700 font-medium">Favori enregistré</p>
              </div>
            </div>

            <!-- Contenu -->
            <div class="mt-2 text-sm text-gray-700 italic">
              <p class="text-lg">" {{ quote.text }} "</p>
            </div>

            <!-- Actions rapides -->
            <div class="mt-6 flex items-center justify-between border-t border-amber-200 pt-4">
              <button
                @click="router.push({ name: 'comment-quote', params: { id: quote._id } })"
                class="text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
              >
                Voir la discussion →
              </button>

              <!-- Optionnel: Bouton pour retirer le favori ici aussi -->
              <button
                @click="removeBookmark(quote._id)"
                class="text-amber-400 hover:text-red-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  class="w-5 h-5 text-amber-600"
                >
                  <path
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- État Vide -->
      <div
        v-else
        class="bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg rounded-lg p-12 text-center border-2 border-dashed border-amber-300"
      >
        <svg
          xmlns="http://www.w3.org"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1"
          stroke="currentColor"
          class="mx-auto h-12 w-12 text-amber-400"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-semibold text-amber-900">Aucun favori</h3>
        <p class="mt-1 text-sm text-amber-700">
          Commencez par explorer des citations pour les enregistrer ici.
        </p>
        <div class="mt-6">
          <button
            @click="router.push('/')"
            class="inline-flex items-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors"
          >
            Explorer les citations
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userBookmarks } from '@/services/quotes'
import { notifySuccess, notifyError, confirmDelete, notifyWarning } from '@/utils/notifications.js'

const route = useRoute()
const router = useRouter()
const quoteId = route.params.id // Ici l'ID de l'USER passé dans l'URL
const quotes = ref(null)

async function getBookmark() {
  try {
    quotes.value = await userBookmarks(quoteId)
  } catch (error) {
    notifyWarning('Aïe Aïe, problème au cours du chargement. Vérifiez votre connexion')
    quotes.value = []
  }
}

async function removeBookmark(id) {
  // Optionnel : ajouter ici la logique pour supprimer le favori et rafraîchir
}

onMounted(getBookmark)
</script>
