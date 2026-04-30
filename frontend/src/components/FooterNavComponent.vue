<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useLoginStore } from '@/stores/login'
import { jwtDecode } from 'jwt-decode'
import { Home, Star, Search, PlusSquare, Bookmark, UserCircle } from 'lucide-vue-next'
import { ref } from 'vue'
const loginStore = useLoginStore()
const router = useRouter()
const route = useRoute()
const isActive = (routeName) => route.name === routeName
import { watch } from 'vue'

const decoded = ref(null)

// Fonction pour décoder le token proprement
const decodeToken = () => {
  if (loginStore.token) {
    try {
      decoded.value = jwtDecode(loginStore.token)
    } catch (e) {
      console.error('Token invalide')
      loginStore.logout()
    }
  }
}

watch(
  () => loginStore.token,
  () => {
    decodeToken()
  },
  { immediate: true },
)
</script>

<template>
  <nav class="flex sticky opacity-30 bottom-0 max-w-200 p-4 justify-around bg-gray-800  rounded-t-sm h-15 items-center">
    <Home @click="router.push('/')" class="cursor-pointer px-3 py-2 text-sm font-medium rounded-md transition-colors"
      :class="isActive('home') ? 'text-amber-600 bg-amber-50' : 'text-white hover:bg-gray-50 hover:text-gray-700'" :size="50" />
    <Search @click="router.push('/search')"
      class="cursor-pointer px-3 py-2 text-sm font-medium rounded-md transition-colors" :class="isActive('search') ? 'text-amber-600 bg-amber-50' : 'text-white hover:bg-gray-50 hover:text-gray-700'
        " :size="50" />
    <PlusSquare @click="router.push({ name: 'add-quote', params: { id: decoded?.sub } })"
      class="cursor-pointer px-3 py-2 text-sm font-medium rounded-md transition-colors" :class="isActive('add-quote') ? 'text-amber-600 bg-amber-50' : 'text-white hover:bg-gray-50 hover:text-gray-700'
        " :size="50" />
    <Star @click="router.push({ name: 'bookmark', params: { id: decoded?.sub } })"
      class="cursor-pointer px-3 py-2 text-sm font-medium rounded-md transition-colors" :class="isActive('bookmark') ? 'text-amber-600 bg-amber-50' : 'text-white hover:bg-gray-50 hover:text-gray-700'
        " :size="50" />
    <UserCircle @click="router.push({ name: 'profil', params: { id: decoded?.sub } })"
      class="cursor-pointer px-3 py-2 text-sm font-medium rounded-md transition-colors" :class="isActive('profil') ? 'text-amber-600 bg-amber-50' : 'text-white hover:bg-gray-50 hover:text-gray-700'
        " :size="50" />
  </nav>
</template>

<style scoped></style>
