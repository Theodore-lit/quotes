<template>
  <div>
    <input v-model="msg" @keyup.enter="send" />
    <p>{{ reply }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const msg = ref("");
const reply = ref("");

const send = async () => {
  const res = await fetch("http://localhost:4000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: msg.value }),
  });

  const data = await res.json();
  reply.value = data.reply;
};
</script>

<!-- Tu t'appelles Chado.
Tu es un assistant sympa, intelligent et drôle.
Tu parles en français simple.
Tu aides en programmation et dans la vie quotidienne. -->