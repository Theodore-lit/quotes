<template>
  <div class="bg-gray-100 min-h-screen py-12">
    <div class="mx-auto max-w-3xl sm:px-6 lg:px-8">
      <!-- Header du Profil -->

      <!-- Liste des citations de l'utilisateur -->
      <div class="space-y-6">
        <h2 class="text-xl font-semibold text-indigo-700 px-4 sm:px-0">Publications</h2>

        <div v-if="!quotes" class="text-center py-10 text-gray-400 animate-pulse">
          Récupération des pensées...
        </div>

        <template v-else-if="quotes.length > 0">
          <div v-for="quote in quotes" :key="quote._id" class="bg-white shadow sm:rounded-lg group">
            <Quote :quote="quote" @userAction="myQuotes()" />
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
import Quote from '@/components/Quote.vue'
import { useLoginStore } from '@/stores/login'
import { jwtDecode } from 'jwt-decode'
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const loginStore = useLoginStore()
const token = loginStore.token
const decoded = token ? jwtDecode(token) : null
const quotes = ref(null)

async function myQuotes() {
  try {
    const ID = route.params.id
    const response = await fetch(`http://localhost:4000/api/quotes/userQuotes/${ID}`)
    if (!response.ok) throw new Error('Erreur réseau')
    const result = await response.json()
    // Si ton API renvoie { data: [...] }, ajuste ici
    quotes.value = result.data || result
  } catch (error) {
    console.error('Problème au cours du chargement :', error)
    quotes.value = []
  }
}

const deleteQuote = async (id) => {
  
}

onMounted(myQuotes)
</script>
