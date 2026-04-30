<template>
  <div>
    <input v-model="msg" @keyup.enter="send" />
    <p>{{ reply }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { sendChatMessage } from '@/services/chat'

const msg = ref("");
const reply = ref("");

const send = async () => {
  reply.value = await sendChatMessage(msg.value)
};
</script>

<!-- Tu t'appelles Chado.
Tu es un assistant sympa, intelligent et drôle.
Tu parles en français simple.
Tu aides en programmation et dans la vie quotidienne. -->