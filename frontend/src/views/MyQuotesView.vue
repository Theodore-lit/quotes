<template>
  <!-- <div class="bg-gray-100 min-h-screen py-12"> -->
    <div class="mx-auto max-w-3xl sm:px-6 lg:px-8">
      <!-- Header du Profil -->

      <!-- Liste des citations de l'utilisateur -->
      <div class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-900 pt-5 px-4 sm:px-0">Publications</h2>

        <div v-if="!quotes" class="text-center py-10 text-gray-800 animate-s animate-spin rounded-full">
        </div>

        <template v-else-if="quotes.length > 0">
          <div v-for="quote in quotes" :key="quote._id" class="bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg rounded-lg border border-amber-200 hover:shadow-xl hover:shadow-amber-300 transition-all duration-300">
            <Quote :quote="quote" @userAction="myQuotes()" />
          </div>
        </template>

        <!-- Cas vide -->
        <div
          v-else
          class="text-center py-20 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow border-2 border-dashed border-amber-300"
        >
          <p class="text-amber-900">Vous n'avez pas encore publié de citations.</p>
          <button
            @click="router.push({ name: 'add-quote' })"
            class="mt-4 text-amber-700 font-bold hover:text-amber-800 transition-colors"
          >
            Écrire ma première citation
          </button>
        </div>
      </div>
    </div>
    
  <!-- </div> -->
</template>

<script setup>

const props = defineProps({
  reload : Boolean
})
import Quote from '@/components/Quote.vue'
import { useLoginStore } from '@/stores/login'
import { jwtDecode } from 'jwt-decode'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { userQuotes } from '@/services/quotes'
import { useWebSocketStore } from '@/stores/webSocketStore'
const socketStore = useWebSocketStore()

const filteredQuotes = computed(() => {
  let result = [...socketStore.quotes] // On pioche dans le store !
  return result
})

const router = useRouter()
const route = useRoute()
const loginStore = useLoginStore()
const token = loginStore.token
const decoded = token ? jwtDecode(token) : null
const quotes = ref(null)
import { notifySuccess, notifyError, confirmDelete, notifyWarning } from '@/utils/notifications.js'

async function myQuotes() {
  try {
    const ID = route.params.id
    quotes.value = await userQuotes(ID)
  } catch (error) {
    notifyWarning('Aïe Aïe, problème au cours du chargement. Vérifiez votre connexion')
    quotes.value = []
  }
}

watch(
  () =>props.reload,
  (reload) => {
    if (reload) myQuotes()
  }
)


onMounted(myQuotes)
</script>
