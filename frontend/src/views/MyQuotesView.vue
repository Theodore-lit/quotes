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
            class="mt-4 text-amber-300 font-bold hover:underline"
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
import { onMounted, ref, watch } from 'vue'
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

async function myQuotes() {
  try {
    const ID = route.params.id
    quotes.value = await userQuotes(ID)
  } catch (error) {
    console.error('Problème au cours du chargement :', error)
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
