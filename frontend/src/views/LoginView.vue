<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLoginStore } from '@/stores/login'
import { notifySuccess, notifyError, notifyWarning } from '@/utils/notifications.js';
import { login as loginUser } from '@/services/auth'
const url = import.meta.env.VITE_API_URL;

const router = useRouter()
const route = useRoute()
const loginStore = useLoginStore()

const candidateUser = reactive({
  email: '',
  password: '',
})

onMounted(() => {
  // Vérifie si on revient de Google OAuth avec token
  const token = route.query.token
  if (token) {
    try {
      loginStore.login({ token })
      router.push('/home')
    } catch (error) {
      notifyWarning('Les données de votre compte google ne sont pas accessible.')
    }
  }
})

async function connect() {
  try {
    const user = await loginUser({
      email: candidateUser.email,
      password: candidateUser.password,
    })
    loginStore.login(user)
    router.push('/home')
  } catch (error) {
    notifyError(
      error.response?.data?.message ?? "Mot de passe ou identifiant incorrect",
    )
  }
}
</script>

<template>
  <div class="w-full flex items-center justify-center min-h-screen" style="background-image: url('../assets/img/bgLogin.png')">

    <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">

      <!-- Title -->
      <div class=" w-full flex items-center justify-center"><svg width="100" height="100" viewBox="0 0 100 100"
          fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 25C36.19 25 25 36.19 25 50C25 54.2 26.05 58.15 27.85 61.6L25 72L35.4 69.15C38.85 70.95 42.8 72 47 72C60.81 72 72 60.81 72 47"
            stroke="#F59E0B" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />

          <circle cx="50" cy="48" r="13" stroke="#F59E0B" stroke-width="6" />

          <path d="M68 33L66.5 29.5L63 28L66.5 26.5L68 23L69.5 26.5L73 28L69.5 29.5L68 33Z" fill="#F59E0B" />

          <line x1="62" y1="21" x2="63.5" y2="19" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" />
          <line x1="68" y1="18" x2="68" y2="15" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" />
          <line x1="74" y1="21" x2="72.5" y2="19" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" />
        </svg></div>
      <p class="text-gray-500 text-center mt-2">Login to your account</p>

      <!-- Form -->
      <form @submit.prevent="connect" class="mt-6 space-y-4">

        <!-- Email -->
        <div>
          <label class="block text-gray-500 font-medium mb-1">Email</label>
          <input type="email" placeholder="Enter your email"
            class="w-full px-4 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400"
            v-model="candidateUser.email" />

        </div>

        <!-- Password -->
        <div>
          <label class="block text-gray-500 font-medium mb-1">Password</label>
          <input type="password" placeholder="Enter your password"
            class="w-full px-4 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400"
            v-model="candidateUser.password" />
        </div>

        <!-- Login Button -->
        <button type="submit"
          class="w-full bg-amber-500 text-white py-2 rounded-lg cursor-pointer font-semibold hover:bg-amber-600 transition">
          Login
        </button>

        <!-- Divider -->
        <div class="flex items-center gap-3 my-4">
          <hr class="flex-1 border-gray-300">
          <span class="text-gray-400 text-sm">OR</span>
          <hr class="flex-1 border-gray-300">
        </div>

        <!-- Google Login -->
        <a :href="`${url}/auth/google`"
          class="w-full cursor-pointer flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition">

          <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" alt="Google Logo">

          <span class="text-gray-700 font-medium">Login with Google</span>
        </a>

      </form>

      <!-- Register Link -->
      <p class="text-center text-gray-600 text-sm mt-6">
        Don't have an account?
        <spam @click="router.push({ name: 'register' })" class="cursor-pointer text-amber-600 font-semibold hover:underline">
          Register
        </spam>
      </p>

    </div>

  </div>
</template>

<style scoped></style>
