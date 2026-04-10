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
  <nav class="flex sticky bottom-0 max-w-200 p-4 justify-around bg-gray-200  rounded-t-lg h-15 items-center">
    <Home @click="router.push('/')" class="cursor-pointer px-3 py-2 text-sm font-medium rounded-md transition-colors"
      :class="isActive('home') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:bg-gray-50'" :size="50" />
    <Search @click="router.push('/search')"
      class="cursor-pointer px-3 py-2 text-sm font-medium rounded-md transition-colors" :class="isActive('search') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:bg-gray-50'
        " :size="50" />
    <PlusSquare @click="router.push({ name: 'add-quote', params: { id: decoded?.sub } })"
      class="cursor-pointer px-3 py-2 text-sm font-medium rounded-md transition-colors" :class="isActive('add-quote') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:bg-gray-50'
        " :size="50" />
    <Star @click="router.push({ name: 'bookmark', params: { id: decoded?.sub } })"
      class="cursor-pointer px-3 py-2 text-sm font-medium rounded-md transition-colors" :class="isActive('bookmark') ? 'text-amber-500 bg-amber-100' : 'text-gray-400 hover:bg-gray-50'
        " :size="50" />
    <UserCircle @click="router.push({ name: 'profil', params: { id: decoded?.sub } })"
      class="cursor-pointer px-3 py-2 text-sm font-medium rounded-md transition-colors" :class="isActive('profil') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:bg-gray-50'
        " :size="50" />
  </nav>
</template>

<style scoped></style>
