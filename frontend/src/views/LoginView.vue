<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiFetch } from '@/services/api.js'
import { useLoginStore } from '@/stores/login'

const router = useRouter()
const route = useRoute()
const loginStore = useLoginStore()
const cannotConnect = ref(null)

const candidateUser = reactive({
  email: '',
  password: '',
})

onMounted(() => {
  // Vérifie si on revient de Google OAuth avec token
  const token = route.query.token
  if (token) {
    try {
      loginStore.login({token})
      router.push('/home')
    } catch (error) {
      console.error('Erreur lors du parsing des données Google:', error)
    }
  }
})

async function connect() {
  try {
    const data = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: candidateUser.email,
        password: candidateUser.password,
      }),
    })
    if (!data.ok) return cannotConnect.value = true
    const user = await data.json()
    loginStore.login(user)
    router.push('/home')
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-white">
    <div class="w-full flex items-center justify-center">
      <div class="w-3/4 max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 class="text-2xl font-bold text-blue-600 mb-6">Login in</h2>
        <form @submit.prevent="connect">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="candidateUser.email"
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm mb-2"> Password </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="candidateUser.password"
            />
            <samp v-if="cannotConnect" class="text-red-500" >Mot de pass ou email invalid</samp>
          </div>

          <button
            type="submit"
            class="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

<a href="http://localhost:4000/api/auth/google">
  Se connecter avec Google
</a>

        <p class="mt-6 text-sm text-center text-gray-600">
          Already have an account?
          <p @click="router.push({ name: 'register' })" class="cursor-pointer text-blue-600 hover:underline inline"> Sign in </p>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
