<script setup>
import FooterNavComponent from '@/components/FooterNavComponent.vue'
import NavBarComponent from '@/components/NavBarComponent.vue'
import { useLoginStore } from '@/stores/login'
import { jwtDecode } from 'jwt-decode'
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { notifySuccess, notifyError, confirmDelete, notifyWarning } from '@/utils/notifications.js'

const loginStore = useLoginStore()
const route = useRoute()
const decoded = ref(null)

const isAuthPage = computed(() => ['login', 'register'].includes(route.name))

const decodeToken = () => {
  if (loginStore.token) {
    try {
      decoded.value = jwtDecode(loginStore.token)
    } catch (e) {
      notifyWarning('Connectez-vous pour continuez')
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
  <div class="bg-gradient-to-b from-white to-amber-50">
    <div class="mx-auto max-w-3xl sm:px-6 lg:px-8">
      <NavBarComponent v-if="decoded && !isAuthPage" />
      <router-view></router-view>
      <div class="text-amber-700 text-sm italic text-center pb-10 pt-4">
        ©Tout Droit Réservé Mise en ligne par Li't-dev
      </div>
      <FooterNavComponent v-if="decoded && !isAuthPage" />
    </div>
  </div>
</template>

<style scoped></style>
