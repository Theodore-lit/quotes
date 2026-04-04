<template>
  <div class="bg-gray-100 min-h-screen py-12">
    <div class="mx-auto max-w-3xl sm:px-6 lg:px-8">
      <!-- Header du Profil -->

      <!-- Liste des citations de l'utilisateur -->
      <div class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-700 px-4 sm:px-0">Mes publications</h2>

        <div v-if="!quotes" class="text-center py-10 text-gray-400 animate-pulse">
          Récupération de vos pensées...
        </div>

        <template v-else-if="quotes.length > 0">
          <div v-for="quote in quotes" :key="quote._id" class="bg-white shadow sm:rounded-lg group">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex justify-between items-start">
                <div class="text-xs text-gray-400 mb-2">
                  Publié le {{ new Date(quote.createdAt).toLocaleDateString('fr-FR') }}
                </div>

                <!-- Menu Actions (Édition/Suppression) -->
                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="editQuote(quote._id)"
                    class="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <svg
                      xmlns="http://www.w3.org"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </button>
                  <button
                    @click="deleteQuote(quote._id)"
                    class="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <svg
                      xmlns="http://www.w3.org"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <p class="text-gray-800 text-lg italic mt-1">" {{ quote.text }} "</p>

              <div
                v-if="quote.image"
                class="mt-4 overflow-hidden rounded-lg border border-gray-200"
              >
                <img
                  :src="`http://localhost:4000/uploads/${quote.image}`"
                  alt="Image de la citation"
                  class="w-full h-auto object-cover"
                />
              </div>

              <!-- Stats rapides -->
              <div class="mt-4 flex gap-4 text-xs text-gray-500 font-medium">
                <span>❤️ {{ quote.likesCount?.length || 0 }} likes</span>
                <span>💬 {{ quote.commentsCount?.length || 0 }} commentaires</span>
              </div>
            </div>
          </div>
        </template>

        <!-- Cas vide -->
        <div
          v-else
          class="text-center py-20 bg-white rounded-lg shadow border-2 border-dashed border-gray-200"
        >
          <p class="text-gray-500">Vous n'avez pas encore publié de citations.</p>
          <button
            @click="router.push({ name: 'add-quote' })"
            class="mt-4 text-indigo-600 font-bold hover:underline"
          >
            Écrire ma première citation
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useEditStore } from '@/stores/edit'
import { useLoginStore } from '@/stores/login'
import { jwtDecode } from 'jwt-decode'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loginStore = useLoginStore()
const editStore = useEditStore()
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

onMounted(myQuotes)
</script>
