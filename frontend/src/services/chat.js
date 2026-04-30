import api from '@/api/axios.config.js'

export async function sendChatMessage(message) {
  const res = await api.post('/chat', { message })
  return res.data.reply
}

