<script setup>
import DefaultLayout from './layout/DefaultLayout.vue';
import Toast from 'primevue/toast';
import { onMounted } from 'vue';
import { useWebSocketStore } from '@/stores/webSocketStore';
const socketStore = useWebSocketStore()



onMounted(() => {
  socketStore.initSocket()
})

</script>

<template>
  <DefaultLayout/>
  <Toast />
</template>

<style scoped></style>
